import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRootDir = path.join(__dirname, "../../");

const BASE_URL = "https://json.tarkov.dev";
const LANG = "zh";

const args = process.argv.slice(2);
const mode = args[0];
if (mode !== "pve" && mode !== "pvp") {
  throw Error(
    `args mode only pve or pvp, but get args=${JSON.stringify(args)}`,
  );
}

let gameMode = mode;
if (gameMode === "pvp") {
  gameMode = "regular";
}

// JSON API objective type → GraphQL __typename mapping
const OBJECTIVE_TYPENAME_MAP = {
  visit: "TaskObjectiveBasic",
  giveItem: "TaskObjectiveItem",
  findItem: "TaskObjectiveItem",
  plantItem: "TaskObjectiveItem",
  sellItem: "TaskObjectiveItem",
  shoot: "TaskObjectiveShoot",
  extract: "TaskObjectiveExtract",
  findQuestItem: "TaskObjectiveQuestItem",
  giveQuestItem: "TaskObjectiveQuestItem",
  plantQuestItem: "TaskObjectiveQuestItem",
  buildWeapon: "TaskObjectiveBuildItem",
  useItem: "TaskObjectiveUseItem",
  mark: "TaskObjectiveMark",
  experience: "TaskObjectiveExperience",
  skill: "TaskObjectiveSkill",
  taskStatus: "TaskObjectiveTaskStatus",
  traderLevel: "TaskObjectiveTraderLevel",
  traderStanding: "TaskObjectiveTraderStanding",
  playerLevel: "TaskObjectivePlayerLevel",
};

const unknownItem = {
  attributes: [],
  quantity: 1,
  count: 1,
  item: {
    id: "unknown-item",
    name: "未知物品",
    normalizedName: "unknown-item",
    shortName: "unknown",
    width: 1,
    height: 1,
    types: [],
    iconLink: "https://assets.tarkov.dev/unknown-item-icon.jpg",
  },
};

// ---------------------------------------------------------------------------
// API helpers (with translation support)
// ---------------------------------------------------------------------------

async function apiFetch(path) {
  const url = `${BASE_URL}/${gameMode}/${path}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

/**
 * Fetch data from an endpoint with optional zh translation.
 * Endpoints that support translations return a `translations` array
 * with JSONPath patterns. We fetch the `_zh` variant and walk the
 * JSONPath patterns to replace translation keys with real text.
 */
async function fetchWithTranslation(endpoint) {
  const [responseData, langData] = await Promise.all([
    apiFetch(endpoint),
    apiFetch(`${endpoint}_${LANG}`),
  ]);

  if (!responseData.translations || responseData.translations.length === 0) {
    // No translations needed (e.g. crafts)
    return { data: responseData.data, translationMap: {} };
  }

  const translationMap = langData.data || {};

  // Walk each JSONPath pattern and apply translations
  for (const jPath of responseData.translations) {
    applyTranslationPath(responseData, jPath, translationMap);
  }

  return { data: responseData.data, translationMap };
}

// ---------------------------------------------------------------------------
// Simple JSONPath walker — handles the subset of JSONPath used by the API.
// Supported patterns:
//   $.data.tasks.*.name
//   $.data.items.*.shortName
//   $.data.*.name
//   $.data.tasks.*.objectives[*].description
//   $.data.tasks.*.objectives[*].exitStatus[*]
// ---------------------------------------------------------------------------

function applyTranslationPath(root, jPath, translationMap) {
  // Split: "$.data.tasks.*.objectives[*].description"
  // → ["$", "data", "tasks", "*", "objectives[*]", "description"]
  const segments = jPath.split(".");
  walkSegments(root, segments, 0, translationMap);
}

function walkSegments(obj, segments, idx, translationMap) {
  if (obj == null) return;
  if (idx >= segments.length) return;

  const seg = segments[idx];

  // Skip root marker "$"
  if (seg === "$") {
    walkSegments(obj, segments, idx + 1, translationMap);
    return;
  }

  // Handle `*` — iterate all keys of current object
  if (seg === "*") {
    for (const key of Object.keys(obj)) {
      walkSegments(obj[key], segments, idx + 1, translationMap);
    }
    return;
  }

  // Handle `field[*]` — access array field, then iterate each element
  const bracketMatch = seg.match(/^(.+)\[\*\]$/);
  if (bracketMatch) {
    const fieldName = bracketMatch[1];
    const arr = obj[fieldName];
    if (!Array.isArray(arr)) return;

    // No more segments → translate each array element (e.g. exitStatus[*])
    if (idx + 1 >= segments.length) {
      for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] === "string") {
          arr[i] = translationMap[arr[i]] ?? arr[i];
        }
      }
      return;
    }

    // More segments → recurse into each element
    for (const item of arr) {
      walkSegments(item, segments, idx + 1, translationMap);
    }
    return;
  }

  // Plain field name
  if (idx + 1 >= segments.length) {
    // Leaf — apply translation
    if (typeof obj[seg] === "string") {
      obj[seg] = translationMap[obj[seg]] ?? obj[seg];
    }
  } else {
    walkSegments(obj[seg], segments, idx + 1, translationMap);
  }
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function fetchAllData() {
  // Crafts has no translation support (translations: false), so fetch directly
  const [hideoutResp, tasksResp, craftsData, itemsResp, tradersResp, mapsResp] =
    await Promise.all([
      fetchWithTranslation("hideout"),
      fetchWithTranslation("tasks"),
      apiFetch("crafts").then((r) => r.data),
      fetchWithTranslation("items"),
      fetchWithTranslation("traders"),
      fetchWithTranslation("maps"),
    ]);

  // Merge all translation maps for resolving quest items etc.
  const globalTranslations = {
    ...hideoutResp.translationMap,
    ...tasksResp.translationMap,
    ...itemsResp.translationMap,
    ...tradersResp.translationMap,
    ...mapsResp.translationMap,
  };

  const hideoutData = hideoutResp.data;
  const tasksData = tasksResp.data;

  // items endpoint returns {items, itemCategories, ...} — extract items dict
  const itemsData = itemsResp.data.items || itemsResp.data;

  // maps endpoint returns {maps, mobs, ...} — extract maps dict
  const mapsDataActual = mapsResp.data.maps || mapsResp.data;

  return {
    hideoutData,
    tasksData,
    craftsData,
    itemsData,
    tradersData: tradersResp.data,
    mapsData: mapsDataActual,
    globalTranslations,
  };
}

// ---------------------------------------------------------------------------
// Lookup builders
// ---------------------------------------------------------------------------

function buildLookups(itemsData, tradersData, mapsData, tasksData) {
  const items = {};
  for (const [id, item] of Object.entries(itemsData)) {
    items[id] = {
      id: item.id,
      name: item.name || `${item.id} Name`,
      normalizedName: item.normalizedName || item.id,
      shortName: item.shortName || item.id,
      width: item.width ?? 1,
      height: item.height ?? 1,
      types: item.types || [],
      iconLink: item.iconLink || "",
      wikiLink: item.wikiLink || null,
    };
  }

  const traders = {};
  for (const [id, trader] of Object.entries(tradersData)) {
    traders[id] = {
      id: trader.id,
      name: trader.name || `${trader.id} Nickname`,
      normalizedName: trader.normalizedName || trader.id,
      imageLink: trader.imageLink || "",
    };
  }

  const maps = {};
  for (const [id, map] of Object.entries(mapsData)) {
    maps[id] = {
      id: map.id,
      name: map.name || `${map.id} Name`,
      normalizedName: map.normalizedName || map.id,
    };
  }

  // Build task lookup for resolving taskRequirements / taskUnlock
  const taskLookup = {};
  if (tasksData && tasksData.tasks) {
    for (const [id, task] of Object.entries(tasksData.tasks)) {
      taskLookup[id] = {
        id: task.id,
        name: task.name || `${task.id} name`,
        normalizedName: task.normalizedName || task.id,
        taskImageLink: task.taskImageLink || "",
        trader: traders[task.trader] || null,
      };
    }
  }

  return { items, traders, maps, taskLookup };
}

function buildStationLookup(hideoutData) {
  const lookup = {};
  for (const [id, station] of Object.entries(hideoutData)) {
    lookup[id] = {
      id: station.id,
      name: station.name || `${station.id} name`,
      normalizedName: station.normalizedName || station.id,
      imageLink: station.imageLink || "",
    };
  }
  return lookup;
}

// ---------------------------------------------------------------------------
// Data resolvers / converters
// ---------------------------------------------------------------------------

function convertAttributes(attributesObj) {
  if (!attributesObj || Object.keys(attributesObj).length === 0) {
    return [];
  }
  return Object.entries(attributesObj).map(([name, value]) => ({
    type:
      typeof value === "boolean"
        ? "boolean"
        : typeof value === "number"
          ? "number"
          : "string",
    name,
    value: String(value),
  }));
}

const FALLBACK_ICON = "https://assets.tarkov.dev/unknown-item-icon.jpg";

function resolveItem(itemId, items) {
  if (!itemId) return null;
  return (
    items[itemId] || {
      id: itemId,
      name: `${itemId} Name`,
      normalizedName: itemId,
      shortName: itemId,
      width: 1,
      height: 1,
      types: [],
      iconLink: FALLBACK_ICON,
      wikiLink: null,
    }
  );
}

function resolveQuestItem(itemId, items, translations) {
  if (!itemId) return null;

  // Try items lookup first
  if (items[itemId]) {
    return {
      ...items[itemId],
      description: items[itemId].description || "",
    };
  }

  // Quest-specific item not in items DB — translate from tasks_zh etc.
  return {
    id: itemId,
    name: translations[`${itemId} Name`] || `${itemId} Name`,
    normalizedName: itemId,
    shortName: translations[`${itemId} ShortName`] || itemId,
    description: translations[`${itemId} Description`] || "",
    width: 1,
    height: 1,
    types: [],
    iconLink: FALLBACK_ICON,
    wikiLink: null,
  };
}

function resolveTrader(traderId, traders) {
  return (
    traders[traderId] || {
      id: traderId,
      name: `${traderId} Nickname`,
      normalizedName: traderId,
      imageLink: "",
    }
  );
}

function resolveMap(mapId, maps) {
  return (
    maps[mapId] || {
      id: mapId,
      name: `${mapId} Name`,
      normalizedName: mapId,
    }
  );
}

function resolveStation(stationId, stationLookup) {
  return (
    stationLookup[stationId] || {
      id: stationId,
      name: `${stationId} name`,
      normalizedName: stationId,
      imageLink: "",
    }
  );
}

function resolveTask(taskId, taskLookup) {
  if (!taskId) return null;
  if (taskLookup[taskId]) return taskLookup[taskId];
  return {
    id: taskId,
    name: `${taskId} name`,
    normalizedName: taskId,
    taskImageLink: "",
    trader: null,
  };
}

function resolveContainedItem(contained, items) {
  return {
    item: resolveItem(contained.item, items),
    count: contained.count ?? 0,
    quantity: contained.count ?? 1,
    attributes: Array.isArray(contained.attributes)
      ? contained.attributes
      : convertAttributes(contained.attributes || {}),
  };
}

// ---------------------------------------------------------------------------
// Objective transformation
// ---------------------------------------------------------------------------

function transformObjective(obj, items, traders, maps, stationLookup, taskLookup, translations) {
  const typename = OBJECTIVE_TYPENAME_MAP[obj.type] || "TaskObjectiveBasic";

  const base = {
    __typename: typename,
    id: obj.id,
    type: obj.type,
    description: obj.description || "",
    maps: (obj.maps || []).map((m) => resolveMap(m, maps)),
    optional: obj.optional ?? false,
  };

  // Common zone transformation
  const zones = (obj.zones || []).map((z) => ({
    id: z.id,
    map: { id: z.map },
    position: z.position || { x: 0, y: 0, z: 0 },
    outline: z.outline || [],
    top: z.top ?? 0,
    bottom: z.bottom ?? 0,
  }));

  // requiredKeys from zones
  const requiredKeys = (obj.requiredKeys || []).map((keyId) =>
    resolveItem(keyId, items),
  );

  switch (obj.type) {
    case "visit":
      return {
        ...base,
        zones,
        requiredKeys: requiredKeys.length > 0 ? [requiredKeys] : null,
      };

    case "giveItem":
    case "findItem":
    case "plantItem":
    case "sellItem":
      return {
        ...base,
        items: (obj.items || []).map((id) => resolveItem(id, items)),
        count: obj.count ?? 0,
        foundInRaid: obj.foundInRaid ?? false,
        dogTagLevel: obj.dogTagLevel ?? 0,
        maxDurability: obj.maxDurability ?? 100,
        minDurability: obj.minDurability ?? 0,
        zones,
        requiredKeys: requiredKeys.length > 0 ? [requiredKeys] : null,
      };

    case "shoot":
      return {
        ...base,
        targetNames: obj.targetNames || [],
        count: obj.count ?? 0,
        shotType: obj.shotType || "",
        zoneNames: obj.zoneNames || [],
        bodyParts: obj.bodyParts || [],
        timeFromHour: obj.timeFromHour ?? 0,
        timeUntilHour: obj.timeUntilHour ?? 0,
        usingWeapon: (obj.usingWeapon || []).map((id) => resolveItem(id, items)),
        usingWeaponMods: [
          (obj.usingWeaponMods || []).map((id) => resolveItem(id, items)),
        ],
        wearing: [
          (obj.wearing || []).map((id) => resolveItem(id, items)),
        ],
        notWearing: (obj.notWearing || []).map((id) => resolveItem(id, items)),
        distance: obj.distance || { compareMethod: ">=", value: 0 },
        playerHealthEffect: obj.playerHealthEffect || null,
        enemyHealthEffect: obj.enemyHealthEffect || null,
        zones,
      };

    case "extract":
      return {
        ...base,
        exitStatus: obj.exitStatus || [],
        exitName: obj.exitName || "",
        count: obj.count ?? 0,
        requiredKeys: requiredKeys.length > 0 ? [requiredKeys] : null,
      };

    case "findQuestItem":
    case "giveQuestItem":
    case "plantQuestItem":
      return {
        ...base,
        questItem: resolveQuestItem(obj.questItem, items, translations),
        count: obj.count ?? 0,
        possibleLocations: (obj.possibleLocations || []).map((loc) => ({
          map: { id: loc.map },
          positions: loc.positions || [],
        })),
        zones,
        requiredKeys: requiredKeys.length > 0 ? [requiredKeys] : null,
      };

    case "buildWeapon":
      return {
        ...base,
        item: resolveItem(obj.item, items),
        containsAll: (obj.containsAll || []).map((id) => resolveItem(id, items)),
        containsCategory: (obj.containsCategory || []).map((id) => ({
          id,
          name: `${id} name`,
          normalizedName: id,
        })),
        attributes: obj.buildAttributes
          ? Object.entries(obj.buildAttributes).map(([name, req]) => ({
              name,
              requirement: {
                compareMethod: req.compareMethod || ">=",
                value: req.value ?? 0,
              },
            }))
          : [],
        zones,
      };

    case "useItem":
      return {
        ...base,
        useAny: (obj.useAny || []).map((id) => resolveItem(id, items)),
        compareMethod: obj.compareMethod || ">=",
        count: obj.count ?? 0,
        zoneNames: obj.zoneNames || [],
        zones,
      };

    case "mark":
      return {
        ...base,
        markerItem: resolveItem(obj.markerItem, items),
        zones,
        requiredKeys: requiredKeys.length > 0 ? [requiredKeys] : null,
      };

    case "experience":
      return {
        ...base,
        healthEffect: obj.healthEffect || null,
      };

    case "skill":
      return {
        ...base,
        skillLevel: {
          name: obj.skill || "",
          level: obj.level ?? 0,
        },
      };

    case "taskStatus":
      return {
        ...base,
        task: resolveTask(obj.task, taskLookup),
        status: obj.status || [],
      };

    case "traderLevel":
      return {
        ...base,
        trader: resolveTrader(obj.trader, traders),
        level: obj.level ?? 0,
      };

    case "traderStanding":
      return {
        ...base,
        trader: resolveTrader(obj.trader, traders),
        compareMethod: obj.compareMethod || ">=",
        value: obj.value ?? 0,
      };

    case "playerLevel":
      return {
        ...base,
        playerLevel: obj.playerLevel ?? 0,
      };

    default:
      return { ...base, zones };
  }
}

// ---------------------------------------------------------------------------
// Rewards transformation
// ---------------------------------------------------------------------------

function transformRewards(rewards, items, traders, stationLookup) {
  if (!rewards) {
    return {
      traderStanding: [],
      items: [],
      offerUnlock: [],
      skillLevelReward: [],
      traderUnlock: [],
      craftUnlock: [],
      achievement: [],
      customization: [],
    };
  }

  const traderStanding = (rewards.traderStanding || []).map((ts) => ({
    trader: resolveTrader(ts.trader, traders),
    standing: ts.standing ?? 0,
  }));

  const rewardItems = (rewards.items || []).map((ri) => ({
    item: resolveItem(ri.item, items),
    count: ri.count ?? 0,
    quantity: ri.count ?? 1,
    attributes: Array.isArray(ri.attributes)
      ? ri.attributes
      : convertAttributes(ri.attributes || {}),
  }));

  const offerUnlock = (rewards.offerUnlock || []).map((ou) => ({
    id: ou.id || "",
    trader: resolveTrader(ou.trader, traders),
    level: ou.level ?? 0,
    item: resolveItem(ou.item, items),
  }));

  const skillLevelReward = (rewards.skillLevelReward || []).map((sl) => ({
    name: sl.name || sl.skill || "",
    level: sl.level ?? 0,
  }));

  const traderUnlock = (rewards.traderUnlock || []).map((tu) =>
    resolveTrader(typeof tu === "string" ? tu : tu.id || tu, traders),
  );

  const craftUnlock = (rewards.craftUnlock || []).map((cu) => ({
    id: cu.id || "",
    station: resolveStation(cu.station, stationLookup),
    level: cu.level ?? 0,
    rewardItems: [
      {
        item: resolveItem(cu.item, items),
        count: cu.count ?? 0,
        quantity: cu.count ?? 1,
        attributes: [],
      },
    ],
  }));

  const achievement = (rewards.achievement || []).map((a) => {
    if (typeof a === "string") {
      return {
        id: a,
        name: `${a} Name`,
        description: "",
        imageLink: "",
        side: "",
        normalizedSide: "",
        rarity: "",
        normalizedRarity: "",
      };
    }
    return {
      id: a.id || "",
      name: a.name || "",
      description: a.description || "",
      imageLink: a.imageLink || "",
      side: a.side || "",
      normalizedSide: a.normalizedSide || "",
      rarity: a.rarity || "",
      normalizedRarity: a.normalizedRarity || "",
    };
  });

  const customization = (rewards.customization || []).map((c) => {
    if (typeof c === "string") {
      return {
        id: c,
        name: `${c} Name`,
        customizationType: "",
        customizationTypeName: "",
        imageLink: "",
      };
    }
    return {
      id: c.id || "",
      name: c.name || "",
      customizationType: c.customizationType || "",
      customizationTypeName: c.customizationTypeName || "",
      imageLink: c.imageLink || "",
    };
  });

  return {
    traderStanding,
    items: rewardItems,
    offerUnlock,
    skillLevelReward,
    traderUnlock,
    craftUnlock,
    achievement,
    customization,
  };
}

// ---------------------------------------------------------------------------
// Hideout transformation
// ---------------------------------------------------------------------------

function transformHideoutStations(
  hideoutData,
  craftsData,
  items,
  traders,
  stationLookup,
  taskLookup,
  translations,
) {
  // Build crafts-by-station index
  const craftsByStation = {};
  for (const craft of craftsData || []) {
    const stationId = craft.station;
    if (!craftsByStation[stationId]) {
      craftsByStation[stationId] = [];
    }

    const transformedCraft = {
      id: craft.id,
      station: resolveStation(craft.station, stationLookup),
      level: craft.level ?? 0,
      taskUnlock: craft.taskUnlock
        ? resolveTask(craft.taskUnlock, taskLookup)
        : null,
      duration: craft.duration ?? 0,
      requiredQuestItems: (craft.requiredQuestItems || []).map((qi) =>
        resolveQuestItem(qi.item, items, translations),
      ),
      requiredItems: (craft.requiredItems || []).map((ri) =>
        resolveContainedItem(ri, items),
      ),
      rewardItems: craft.productItem
        ? [resolveContainedItem(craft.productItem, items)]
        : [],
    };

    craftsByStation[stationId].push(transformedCraft);
  }

  // Transform stations from dict to array
  const stations = Object.values(hideoutData).map((station) => {
    const stationInfo = resolveStation(station.id, stationLookup);

    const levels = (station.levels || []).map((level) => ({
      id: level.id,
      level: level.level ?? 0,
      itemRequirements: (level.itemRequirements || []).map((req) => ({
        id: req.id,
        item: resolveItem(req.item, items),
        count: req.count ?? 0,
        quantity: req.count ?? 1,
        attributes: Array.isArray(req.attributes)
          ? req.attributes
          : convertAttributes(req.attributes || {}),
      })),
      stationLevelRequirements: (level.stationLevelRequirements || []).map(
        (slr) => ({
          id: slr.id,
          station: resolveStation(slr.station, stationLookup),
          level: slr.level ?? 0,
        }),
      ),
      traderRequirements: (level.traderRequirements || []).map((tr) => ({
        id: tr.id,
        trader: resolveTrader(tr.trader, traders),
        requirementType: tr.requirementType || "",
        compareMethod: tr.compareMethod || ">=",
        value: tr.value ?? 0,
      })),
    }));

    return {
      id: station.id,
      name: station.name || `${station.id} name`,
      normalizedName: station.normalizedName || station.id,
      imageLink: station.imageLink || stationInfo.imageLink || "",
      levels,
      crafts: craftsByStation[station.id] || [],
    };
  });

  return stations;
}

// ---------------------------------------------------------------------------
// Tasks transformation
// ---------------------------------------------------------------------------

function transformTasks(tasksData, items, traders, maps, stationLookup, taskLookup, translations) {
  const tasksDict = tasksData.tasks || {};

  // Build a local task lookup that includes the trader resolved
  const resolvedTaskLookup = {};
  for (const [id, t] of Object.entries(tasksDict)) {
    resolvedTaskLookup[id] = {
      id: t.id,
      name: t.name || `${t.id} name`,
      normalizedName: t.normalizedName || t.id,
      taskImageLink: t.taskImageLink || "",
      trader: traders[t.trader] || null,
    };
  }

  const tasks = Object.values(tasksDict).map((task) => ({
    id: task.id,
    tarkovDataId: task.tarkovDataId || task.id,
    name: task.name || `${task.id} name`,
    normalizedName: task.normalizedName || task.id,
    trader: resolveTrader(task.trader, traders),
    map: task.map ? resolveMap(task.map, maps) : null,
    experience: task.experience ?? 0,
    wikiLink: task.wikiLink || null,
    minPlayerLevel: task.minPlayerLevel ?? 0,
    taskRequirements: (task.taskRequirements || []).map((tr) => ({
      task:
        typeof tr.task === "string"
          ? resolveTask(tr.task, resolvedTaskLookup)
          : tr.task,
      status: tr.status || [],
    })),
    traderRequirements: (task.traderRequirements || []).map((tr) => ({
      trader: resolveTrader(tr.trader, traders),
      requirementType: tr.requirementType || "",
      compareMethod: tr.compareMethod || ">=",
      value: tr.value ?? 0,
    })),
    restartable: task.restartable ?? false,
    objectives: (task.objectives || []).map((obj) =>
      transformObjective(obj, items, traders, maps, stationLookup, resolvedTaskLookup, translations),
    ),
    failConditions: (task.failConditions || []).map((obj) =>
      transformObjective(obj, items, traders, maps, stationLookup, resolvedTaskLookup, translations),
    ),
    startRewards: transformRewards(task.startRewards, items, traders, stationLookup),
    finishRewards: transformRewards(task.finishRewards, items, traders, stationLookup),
    failureOutcome: transformRewards(task.failureOutcome, items, traders, stationLookup),
    factionName: task.factionName || "",
    kappaRequired: task.kappaRequired ?? false,
    lightkeeperRequired: task.lightkeeperRequired ?? false,
    taskImageLink: task.taskImageLink || "",
  }));

  return tasks;
}

// ---------------------------------------------------------------------------
// File output handlers
// ---------------------------------------------------------------------------

/**
 * Build a slimmed-down items dict suitable for the frontend.
 * Keeps all TarkovItem fields plus description and extra image links.
 */
function buildItemsOutput(itemsData) {
  const result = {};
  for (const [id, item] of Object.entries(itemsData)) {
    result[id] = {
      id: item.id,
      name: item.name || `${item.id} Name`,
      normalizedName: item.normalizedName || item.id,
      shortName: item.shortName || item.id,
      description: item.description || "",
      width: item.width ?? 1,
      height: item.height ?? 1,
      weight: item.weight ?? 0,
      types: item.types || [],
      iconLink: item.iconLink || "",
      gridImageLink: item.gridImageLink || "",
      baseImageLink: item.baseImageLink || "",
      inspectImageLink: item.inspectImageLink || "",
      image512pxLink: item.image512pxLink || "",
      image8xLink: item.image8xLink || "",
      wikiLink: item.wikiLink || null,
      link: item.link || "",
      lastOfferCount: item.lastOfferCount ?? 0,
    };
  }
  return result;
}

const handleItemsData = (itemsData) => {
  const filePath = path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/items.json`,
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const items = buildItemsOutput(itemsData);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 4), "utf-8");
};

const handleHideoutStationsData = (hideoutStations) => {
  const filePath = path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/hideoutStations.json`,
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // Filter [null] items in crafts
  hideoutStations.forEach((hideoutStation) => {
    hideoutStation.crafts.forEach((craft) => {
      craft.requiredQuestItems = craft.requiredQuestItems.map(
        (i) => i || unknownItem,
      );
      craft.requiredItems = craft.requiredItems.map(
        (i) => i || unknownItem,
      );
      craft.rewardItems = craft.rewardItems.map(
        (i) => i || unknownItem,
      );
    });
  });

  fs.writeFileSync(
    filePath,
    JSON.stringify({ hideoutStations }, null, 4),
    "utf-8",
  );
};

const handleTasksData = (tasks) => {
  const filePath = path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/tasks.json`,
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    JSON.stringify({ tasks }, null, 4),
    "utf-8",
  );
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Fetching data from JSON API (mode: ${gameMode}, lang: ${LANG})...`);
  const { hideoutData, tasksData, craftsData, itemsData, tradersData, mapsData, globalTranslations } =
    await fetchAllData();

  console.log(`  → ${Object.keys(itemsData).length} items fetched.`);
  handleItemsData(itemsData);

  console.log("Building lookups...");
  const { items, traders, maps, taskLookup } = buildLookups(
    itemsData,
    tradersData,
    mapsData,
    tasksData,
  );
  const stationLookup = buildStationLookup(hideoutData);

  console.log("Transforming hideout stations...");
  const hideoutStations = transformHideoutStations(
    hideoutData,
    craftsData,
    items,
    traders,
    stationLookup,
    taskLookup,
    globalTranslations,
  );
  handleHideoutStationsData(hideoutStations);
  console.log(`  → ${hideoutStations.length} stations written.`);

  console.log("Transforming tasks...");
  const tasks = transformTasks(
    tasksData,
    items,
    traders,
    maps,
    stationLookup,
    taskLookup,
    globalTranslations,
  );
  handleTasksData(tasks);
  console.log(`  → ${tasks.length} tasks written.`);

  console.log("Done.");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRootDir = path.join(__dirname, "../../");

const args = process.argv.slice(2);
const mode = args[0];
if (mode !== "pve" && mode !== "pvp") {
  throw Error(
    `args mode only pve or regular, but get args=${JSON.stringify(args)}`
  );
}

// 包含混合物品任务
const includedMixedItemsTasks = [
  "60c0c018f7afb4354815096a", // 猎人之路 - 工厂头目
  "59ca29fb86f77445ab465c87", // 惩罚者 - 5
  "5d25e2e286f77444001e2e48", // 猎人之路 - 脱销
  "6179b5eabca27a099552e052", // 反抗
  "60e71ccb5688f6424c7bfec4", // 战利品
];

// 藏身处与任务
const tasksFileData = fs.readFileSync(
  path.join(projectRootDir, `public/tarkov/data/${mode}/tasks.json`),
  "utf-8"
);
const tasks = JSON.parse(tasksFileData).tasks;
const hideoutStationsFileData = fs.readFileSync(
  path.join(projectRootDir, `public/tarkov/data/${mode}/hideoutStations.json`),
  "utf-8"
);
const hideoutStations = JSON.parse(hideoutStationsFileData).hideoutStations;

// 物品
const taskItems = [];
const barterItems = [];
const mixedItemsTasks = [];

function addTaskItem(taskItem, taskObjective, task) {
  let item = taskItems.find((i) => i.id === taskItem.id);
  if (!item) {
    item = {
      id: taskItem.id,
      name: taskItem.name,
      normalizedName: taskItem.normalizedName,
      types: taskItem.types,
      iconLink: handleImage(taskItem.iconLink),
      wikiLink: taskItem.wikiLink,
      tasks: [],
    };
    taskItems.push(item);
  }

  item.tasks.push({
    id: task.id,
    name: task.name,
    trader: task.trader.name,
    traderImageLink: handleImage(task.trader.imageLink),
    kappaRequired: task.kappaRequired,
    count: taskObjective.count,
    mixedItemsTask: taskObjective.items.length > 1,
  });
}

function addBarterTaskItem(taskItem, taskObjective, task) {
  let item = barterItems.find((i) => i.id === taskItem.id);
  if (!item) {
    item = {
      id: taskItem.id,
      name: taskItem.name,
      normalizedName: taskItem.normalizedName,
      types: taskItem.types,
      iconLink: handleImage(taskItem.iconLink),
      wikiLink: taskItem.wikiLink,
      tasks: [],
      hideoutStations: [],
    };
    barterItems.push(item);
  }

  item.tasks.push({
    id: task.id,
    name: task.name,
    trader: task.trader.name,
    traderImageLink: handleImage(task.trader.imageLink),
    kappaRequired: task.kappaRequired,
    count: taskObjective.count,
    mixedItemsTask: taskObjective.items.length > 1,
  });
}

function addBarterHideoutItem(hideoutReq, station, level) {
  let item = barterItems.find((i) => i.id === hideoutReq.item.id);
  if (!item) {
    item = {
      id: hideoutReq.item.id,
      name: hideoutReq.item.name,
      normalizedName: hideoutReq.item.normalizedName,
      types: hideoutReq.item.types,
      iconLink: handleImage(hideoutReq.item.iconLink),
      wikiLink: hideoutReq.item.wikiLink,
      tasks: [],
      hideoutStations: [],
    };
    barterItems.push(item);
  }

  item.hideoutStations.push({
    id: level.id,
    stationId: station.id,
    name: station.name,
    normalizedName: station.normalizedName,
    imageLink: handleImage(station.imageLink),
    level: level.level,
    count: hideoutReq.quantity,
  });
}

function convertToGiveItemTaskObjective(objective) {
  return {
    id: objective.id,
    description: objective.description,
    count: objective.count,
    items: objective.items.map((taskItem) => {
      return {
        id: taskItem.id,
        name: taskItem.name,
        normalizedName: taskItem.normalizedName,
        types: taskItem.types,
        iconLink: handleImage(taskItem.iconLink),
        wikiLink: taskItem.wikiLink,
      };
    }),
  };
}

function addMixedItemsTask(task, giveItemTaskObjectives) {
  mixedItemsTasks.push({
    id: task.id,
    name: task.name,
    taskImageLink: handleImage(task.taskImageLink),
    trader: task.trader.name,
    traderImageLink: handleImage(task.trader.imageLink),
    kappaRequired: task.kappaRequired,
    mixedItemsTask: true,
    objectives: giveItemTaskObjectives,
  });
}

function handleImage(link) {
  if (link.startsWith("https://assets.tarkov.dev/")) {
    return link.replace("https://assets.tarkov.dev/", "");
  } else {
    console.log("未知图片链接:", link);
  }
  return link;
}

// 任务物品
tasks.forEach((task) => {
  if (task.factionName !== "BEAR" && task.objectives) {
    // 阵营任务会重复 仅取USEC和Any
    const mixedItemsObjectives = [];
    task.objectives.forEach((objective) => {
      if (
        objective.__typename === "TaskObjectiveItem" &&
        objective.type === "giveItem" &&
        objective.foundInRaid
      ) {
        if (
          objective.items.length === 1 ||
          includedMixedItemsTasks.indexOf(task.id) > -1
        ) {
          const taskItem = objective.items[0];
          if (taskItem.types.includes("barter")) {
            // 交换用物品
            addBarterTaskItem(taskItem, objective, task);
          } else {
            // 其他任务物品
            addTaskItem(taskItem, objective, task);
          }
        }
        if (objective.items.length > 1) {
          mixedItemsObjectives.push(convertToGiveItemTaskObjective(objective));
        }
      }
    });
    if (mixedItemsObjectives.length > 0) {
      addMixedItemsTask(task, mixedItemsObjectives);
    }
  }
});

// 藏身处建造物品
hideoutStations.forEach((station) => {
  station.levels.forEach((level) => {
    if (level.itemRequirements) {
      level.itemRequirements.forEach((req) => {
        const foundInRaid =
          req.attributes.findIndex(
            (attr) => attr.name === "foundInRaid" && attr.value === "true"
          ) > -1;
        if (foundInRaid) {
          addBarterHideoutItem(req, station, level);
        }
      });
    }
  });
});

const barterItemsFilePath = path.join(
  projectRootDir,
  `public/tarkov/data/${mode}/foundInRaidBarterItems.json`
);
fs.mkdirSync(path.dirname(barterItemsFilePath), { recursive: true });
fs.writeFileSync(
  barterItemsFilePath,
  JSON.stringify(barterItems, null, 4),
  "utf-8"
);

const taskItemsFilePath = path.join(
  projectRootDir,
  `public/tarkov/data/${mode}/foundInRaidTaskItems.json`
);
fs.mkdirSync(path.dirname(taskItemsFilePath), { recursive: true });
fs.writeFileSync(
  taskItemsFilePath,
  JSON.stringify(taskItems, null, 4),
  "utf-8"
);

const mixedItemsTasksFilePath = path.join(
  projectRootDir,
  `public/tarkov/data/${mode}/mixedItemsTasks.json`
);
fs.mkdirSync(path.dirname(mixedItemsTasksFilePath), { recursive: true });
fs.writeFileSync(
  mixedItemsTasksFilePath,
  JSON.stringify(mixedItemsTasks, null, 4),
  "utf-8"
);

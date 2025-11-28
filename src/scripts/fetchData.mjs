import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { request, gql } from "graphql-request";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRootDir = path.join(__dirname, "../../");

const args = process.argv.slice(2);
const mode = args[0];
if (mode !== "pve" && mode !== "pvp") {
  throw Error(
    `args mode only pve or regular, but get args=${JSON.stringify(args)}`,
  );
}

let queryMode = mode;
if (queryMode === "pvp") {
  queryMode = "regular";
}

const hideoutStationsQuery = gql`
  query TarkovDevHideout {
    hideoutStations(lang: zh, gameMode: ${queryMode}) {
      id
      name
      normalizedName
      imageLink
      levels {
        id
        level
        itemRequirements {
          id
          item {
            id
            name
            normalizedName
            shortName
            width
            height
            types
            iconLink
            wikiLink
          }
          attributes {
            type
            name
            value
          }
          quantity
          count
        }
        stationLevelRequirements {
          id
          station {
            id
            name
            normalizedName
            imageLink
          }
          level
        }
        traderRequirements {
          id
          trader {
            id
            name
            normalizedName
            imageLink
          }
          requirementType
          compareMethod
          value
        }
      }
      crafts {
        id
        station {
          id
          name
          normalizedName
          imageLink
        }
        level
        taskUnlock {
          id
          name
          normalizedName
          taskImageLink 
          trader {
            id
            name
            normalizedName
            imageLink
          }
        }
        duration
        requiredQuestItems {
          id
          name
          normalizedName
          shortName
          width
          height
          iconLink
        }
        requiredItems {
          item {
            id
            name
            normalizedName
            shortName
            width
            height
            types
            iconLink
            wikiLink
          }
          count
          quantity
          attributes {
            type
            name
            value
          }
        }
        rewardItems {
          item {
            id
            name
            normalizedName
            shortName
            width
            height
            types
            iconLink
            wikiLink
          }
          attributes {
            type
            name
            value
          }
          quantity
          count
        }
      }
    }
  }
`;

const taskQuery = gql`
  query TarkovDevTasks {
    tasks(lang: zh, gameMode: pve) {
      id
      tarkovDataId
      name
      normalizedName
      trader {
        id
        name
        normalizedName
        imageLink
      }
      map {
        id
        name
        normalizedName
      }
      experience
      wikiLink
      minPlayerLevel
      taskRequirements {
        task {
          id
          name
          normalizedName
          taskImageLink
          trader {
            id
            name
            normalizedName
            imageLink
          }
        }
        status
      }
      traderRequirements {
        trader {
          id
          name
        }
        requirementType
        compareMethod
        value
      }
      restartable
      objectives {
        ...TaskObjectiveInfo
      }
      failConditions {
        ...TaskObjectiveInfo
      }
      startRewards {
        ...taskRewardFragment
      }
      finishRewards {
        ...taskRewardFragment
      }
      failureOutcome {
        ...taskRewardFragment
      }
      factionName
      kappaRequired
      lightkeeperRequired
      taskImageLink
    }
  }
  fragment TaskObjectiveInfo on TaskObjective {
    __typename
    id
    type
    description
    maps {
      id
      name
      normalizedName
    }
    optional
    ... on TaskObjectiveBasic {
      zones {
        id
        map {
          id
        }
        position {
          x
          y
          z
        }
        outline {
          x
          y
          z
        }
        top
        bottom
      }
      requiredKeys {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
    }
    ... on TaskObjectiveBuildItem {
      item {
        id
        name
        normalizedName
        shortName
        description
        types
        width
        height
        iconLink
        wikiLink
      }
      containsAll {
        id
        name
        normalizedName
        shortName
        description
        types
        width
        height
        iconLink
        wikiLink
      }
      containsCategory {
        id
        name
        normalizedName
      }
      attributes {
        name
        requirement {
          compareMethod
          value
        }
      }
    }
    ... on TaskObjectiveExperience {
      healthEffect {
        bodyParts
        effects
        time {
          compareMethod
          value
        }
      }
    }
    ... on TaskObjectiveExtract {
      exitStatus
      exitName
      count
      requiredKeys {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
    }
    ... on TaskObjectiveItem {
      items {
        id
        name
        normalizedName
        shortName
        description
        types
        width
        height
        iconLink
        wikiLink
      }
      count
      foundInRaid
      dogTagLevel
      maxDurability
      minDurability
      zones {
        id
        map {
          id
        }
        position {
          x
          y
          z
        }
        outline {
          x
          y
          z
        }
        top
        bottom
      }
      requiredKeys {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
    }
    ... on TaskObjectiveMark {
      markerItem {
        id
        name
        normalizedName
        shortName
        description
        types
        width
        height
        iconLink
        wikiLink
      }
      zones {
        id
        map {
          id
        }
        position {
          x
          y
          z
        }
        outline {
          x
          y
          z
        }
        top
        bottom
      }
      requiredKeys {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
    }
    ... on TaskObjectivePlayerLevel {
      playerLevel
    }
    ... on TaskObjectiveQuestItem {
      questItem {
        id
        name
        normalizedName
        shortName
        description
        width
        height
        iconLink
      }
      possibleLocations {
        map {
          id
        }
        positions {
          x
          y
          z
        }
      }
      zones {
        id
        map {
          id
        }
        position {
          x
          y
          z
        }
        outline {
          x
          y
          z
        }
        top
        bottom
      }
      count
      requiredKeys {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
    }
    ... on TaskObjectiveShoot {
      targetNames
      count
      shotType
      zoneNames
      bodyParts
      timeFromHour
      timeUntilHour
      usingWeapon {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
      usingWeaponMods {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
      wearing {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
      notWearing {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
      distance {
        compareMethod
        value
      }
      playerHealthEffect {
        bodyParts
        effects
        time {
          compareMethod
          value
        }
      }
      enemyHealthEffect {
        bodyParts
        effects
        time {
          compareMethod
          value
        }
      }
      zones {
        id
        map {
          id
        }
        position {
          x
          y
          z
        }
        outline {
          x
          y
          z
        }
        top
        bottom
      }
    }
    ... on TaskObjectiveSkill {
      skillLevel {
        name
        level
      }
    }
    ... on TaskObjectiveTaskStatus {
      task {
        id
        name
        normalizedName
        taskImageLink
        trader {
          id
          name
          normalizedName
          imageLink
        }
      }
      status
    }
    ... on TaskObjectiveTraderLevel {
      trader {
        id
        name
        normalizedName
        imageLink
      }
      level
    }
    ... on TaskObjectiveTraderStanding {
      trader {
        id
        name
        normalizedName
        imageLink
      }
      compareMethod
      value
    }
    ... on TaskObjectiveUseItem {
      useAny {
        id
        name
        normalizedName
        shortName
        description
        types
        width
        height
        iconLink
        wikiLink
      }
      compareMethod
      count
      zoneNames
      zones {
        id
        map {
          id
        }
        position {
          x
          y
          z
        }
        outline {
          x
          y
          z
        }
        top
        bottom
      }
    }
  }
  fragment taskRewardFragment on TaskRewards {
    traderStanding {
      trader {
        id
        name
        normalizedName
        imageLink
      }
      standing
    }
    items {
      item {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
      attributes {
        type
        name
        value
      }
      count
      quantity
    }
    offerUnlock {
      id
      trader {
        id
        name
        normalizedName
        imageLink
      }
      level
      item {
        id
        name
        normalizedName
        shortName
        width
        height
        types
        iconLink
        wikiLink
      }
    }
    craftUnlock {
      id
      station {
        id
        name
        normalizedName
        imageLink
      }
      level
      rewardItems {
        item {
          id
          name
          normalizedName
          shortName
          width
          height
          types
          iconLink
          wikiLink
        }
        attributes {
          type
          name
          value
        }
        count
        quantity
      }
    }
    skillLevelReward {
      name
      level
    }
    traderUnlock {
      id
      name
      normalizedName
      imageLink
    }
    achievement {
      id
      name
      description
      imageLink
      side
      normalizedSide
      rarity
      normalizedRarity
    }
    customization {
      id
      name
      customizationType
      customizationTypeName
      imageLink
    }
  }
`;

request("https://api.tarkov.dev/graphql", hideoutStationsQuery).then((data) => {
  const filePath = path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/hideoutStations.json`,
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  data.hideoutStations.forEach((hideoutStation) => {
    hideoutStation.crafts.forEach((craft) => {
      // Filter [null] items
      craft.requiredQuestItems = craft.requiredQuestItems.filter((i) => !!i);
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf-8");
});

request("https://api.tarkov.dev/graphql", taskQuery).then((data) => {
  const filePath = path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/tasks.json`,
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf-8");
});

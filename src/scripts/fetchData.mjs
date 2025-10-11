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
          quantity
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
          attributes {
            name
            value
          }
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
      neededKeys {
        keys {
          id
        }
        map {
          id
        }
      }
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
    }
    ... on TaskObjectiveBuildItem {
      item {
        id
      }
      containsAll {
        id
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
      }
      usingWeaponMods {
        id
      }
      wearing {
        id
      }
      notWearing {
        id
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
        containsItems {
          item {
            id
          }
          count
        }
      }
      count
      attributes {
        name
        value
      }
    }
    offerUnlock {
      trader {
        id
      }
      level
      item {
        id
      }
    }
    craftUnlock {
      id
      station {
        id
      }
      level
      rewardItems {
        item {
          id
        }
        count
      }
    }
    skillLevelReward {
      name
      level
    }
    traderUnlock {
      id
    }
  }
`;

request("https://api.tarkov.dev/graphql", hideoutStationsQuery).then((data) => {
  const filePath = path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/hideoutStations.json`,
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
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

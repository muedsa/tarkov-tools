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
    `args mode only pve or regular, but get args=${JSON.stringify(args)}`
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
            types
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
    tasks(lang: zh, gameMode: ${queryMode}) {
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
      wikiLink
      objectives {
        ...TaskObjectiveInfo
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
    optional
    ... on TaskObjectiveItem {
      items {
        id
        name
        normalizedName
        types
        iconLink
        wikiLink
      }
      count
      foundInRaid
      dogTagLevel
    }
  }
`;

request("https://api.tarkov.dev/graphql", hideoutStationsQuery).then((data) => {
  const filePath = path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/hideoutStations.json`
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf-8");
});

request("https://api.tarkov.dev/graphql", taskQuery).then((data) => {
  const filePath = path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/tasks.json`
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf-8");
});

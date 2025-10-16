type GameMode = "pve" | "pvp";

type TraderTaskDemandData = {
  id: string;
  name: string;
  trader: string;
  traderImageLink: string;
  kappaRequired: boolean;
  count: number;
  mixedItemsTask: boolean;
};

type HideoutStationDemandData = {
  id: string;
  stationId: string;
  name: string;
  normalizedName: string;
  imageLink: string;
  level: number;
  count: number;
};

type FoundInRaidItemData = {
  id: string;
  name: string;
  normalizedName: string;
  types: string[];
  iconLink: string;
  wikiLink: string;
  tasks?: TraderTaskDemandData[];
  hideoutStations?: HideoutStationDemandData[];
};

type UserCompletedHideoutStations = {
  [stationId: string]: number; // stationId to level
};

type UserCompletedTasks = string[]; // array of task ids

type UserFoundInRaidItems = {
  [itemId: string]: number; // itemId to count
};

type UserData = {
  loading: boolean;
  completedHideoutStations: UserCompletedHideoutStations;
  completedTasks: UserCompletedTasks;
  collectedItems: UserFoundInRaidItems;
};

type GiveItemTaskObjectiveItem = {
  id: string;
  description: string;
  count: string;
  items: FoundInRaidItemData[];
};

type MixedItemsTraderTaskData = {
  id: string;
  name: string;
  normalizedName: string;
  taskImageLink: string;
  trader: string;
  traderImageLink: string;
  kappaRequired: boolean;
  objectives: GiveItemTaskObjectiveItem[];
};

type TarkovTrader = {
  id: string;
  name: string;
  normalizedName: string;
  imageLink: string;
};

type TarkovMap = {
  id: string;
  name: string;
  normalizedName: string;
};

type TarkovItem = {
  id: string;
  name: string;
  normalizedName: string;
  shortName: string;
  types: string[];
  width: number;
  height: number;
  iconLink: string;
  wikiLink: string;
};

type TarkovQuestItem = {
  id: string;
  name: string;
  normalizedName: string;
  shortName: string;
  types: string[];
  width: number;
  height: number;
  iconLink: string;
  wikiLink: string;
};

type TarkovAttributeThreshold = {
  name: string;
  requirement: {
    compareMethod: string;
    value: number;
  };
};

type TarkovItemCategory = {
  id: string;
  name: string;
  normalizedName: string;
  imageLink: string;
};

interface TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveBasic";
  id: string;
  type: string;
  description: string;
  optional: false;
  maps: { id: string; name: string }[];
}

interface TarkovTaskObjectiveBuildItem extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveBuildItem";
  count: number;
  item: TarkovItem;
  containsAll: TarkovItem[];
  containsCategory: TarkovItemCategory[];
  attributes: TarkovAttributeThreshold[];
}

interface TarkovTaskObjectiveExperience extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveExperience";
  healthEffect: {
    bodyParts: string[];
    effects: string[];
    time: {
      compareMethod: string;
      value: number;
    };
  };
}

interface TarkovTaskObjectiveExtract extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveExtract";
  count: number;
}

interface TarkovTaskObjectiveItem extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveItem";
  count: number;
  foundInRaid: boolean;
  items: TarkovItem[];
}

interface TarkovTaskObjectiveMark extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveMark";
  markerItem: TarkovItem;
}

interface TarkovTaskPlayerLevel extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectivePlayerLevel";
  playerLevel: number;
}

interface TarkovTaskObjectiveQuestItem extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveQuestItem";
  count: number;
  questItem: TarkovQuestItem;
}

interface TarkovTaskObjectiveShoot extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveShoot";
  count: number;
  targetNames: string[];
}

interface TarkovTaskSkill extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveSkill";
  skillLevel: {
    name: string;
    level: number;
  };
}

interface TarkovTaskObjectiveTaskStatus extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveTaskStatus";
  task: {
    id: string;
    name: string;
    normalizedName: string;
  };
  status: string[];
}

interface TarkovTaskObjectiveTraderLevel extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveTraderLevel";
  trader: TarkovTrader;
  level: number;
}

interface TarkovTaskObjectiveTraderStanding extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveTraderStanding";
  trader: TarkovTrader;
  compareMethod: string;
  value: number;
}

interface TarkovTaskObjectiveUseItem extends TarkovTaskObjectiveBasic {
  __typename: "TaskObjectiveUseItem";
  useAny: TarkovItem[];
  compareMethod: string;
  count: number;
}

type TarkovTaskObjective =
  | TarkovTaskObjectiveBasic
  | TarkovTaskObjectiveBuildItem
  | TarkovTaskObjectiveExperience
  | TarkovTaskObjectiveExtract
  | TarkovTaskObjectiveItem
  | TarkovTaskObjectiveMark
  | TarkovTaskPlayerLevel
  | TarkovTaskObjectiveQuestItem
  | TarkovTaskObjectiveShoot
  | TarkovTaskSkill
  | TarkovTaskObjectiveTaskStatus
  | TarkovTaskObjectiveTraderLevel
  | TarkovTaskObjectiveTraderStanding
  | TarkovTaskObjectiveUseItem;

type TarkovTaskKey = {
  keys: TarkovItem[];
  map: TarkovMap;
};

type TarkovTraderTask = {
  id: string;
  name: string;
  normalizedName: string;
  experience: number;
  wikiLink: string;
  minPlayerLevel: number;
  factionName: string;
  neededKeys: TarkovTaskKey[]?;
  kappaRequired: boolean;
  lightkeeperRequired: boolean;
  taskImageLink: string;
  trader: TarkovTrader;
  map: TarkovMap?;
  objectives: TarkovTaskObjective[];
};

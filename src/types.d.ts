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

type TarkovTraderTask = {
  id: string;
  name: string;
  normalizedName: string;
  experience: number;
  wikiLink: string;
  minPlayerLevel: number;
  factionName: string;
  trader: TarkovTrader;
};

type TraderTaskData = {
  id: string;
  name: string;
  trader: string;
  traderImageLink: string;
  kappaRequired: boolean;
  count: number;
  mixedItemsTask: boolean;
};

type HideoutStationData = {
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
  tasks?: TraderTaskData[];
  hideoutStations?: HideoutStationData[];
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

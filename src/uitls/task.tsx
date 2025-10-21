import { cache } from "react";
import TasksData from "@/../public/tarkov/data/pvp/tasks.json";

const taskStatusNames: Record<string, string> = {
  active: "进行中",
  complete: "完成",
  failed: "失败",
};

export const getTaskStatusName = (status: string) =>
  taskStatusNames[status] ?? status;

const taskStatusTextCss: Record<string, string> = {
  active: "text-blue-400",
  complete: "text-green-400",
  failed: "text-red-400",
};

export const getTaskStatusTextCss = (status: string) =>
  taskStatusTextCss[status] ?? "";

const taskObjectiveItemTypeNames: Record<string, string> = {
  findItem: "搜寻",
  giveItem: "上交",
  plantItem: "放置",
  sellItem: "出售",
};

export const getTaskObjectiveItemTypeName = (type: string) =>
  taskObjectiveItemTypeNames[type] ?? type;

export const getTaskList = cache(() => {
  const { tasks } = TasksData as { tasks: TarkovTraderTask[] };
  return tasks;
});

export const getTask = cache((taskNormalizedName: string) => {
  const task = getTaskList().find(
    (t) => t.normalizedName === taskNormalizedName,
  );
  return task;
});

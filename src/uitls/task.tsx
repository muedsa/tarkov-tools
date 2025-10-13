import { cache } from "react";
import TasksData from "@/../public/tarkov/data/pvp/tasks.json";

export const getTaskList = cache(() => {
  const { tasks } = TasksData as { tasks: TarkovTraderTask[] };
  const taskList = tasks.filter((t) => t.factionName !== "BEAR");
  return taskList;
});

export const getTask = cache((taskNormalizedName: string) => {
  const task = getTaskList().find(
    (t) => t.normalizedName === taskNormalizedName,
  );
  return task;
});

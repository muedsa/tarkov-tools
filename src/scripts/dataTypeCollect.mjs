import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRootDir = path.join(__dirname, "../../");

const tasksFileData = fs.readFileSync(
  path.join(projectRootDir, `public/tarkov/data/pvp/tasks.json`),
  "utf-8",
);
const { tasks } = JSON.parse(tasksFileData);

const taskStatusList = new Set();

const taskObjectiveItemTypeList = new Set();

const possibleFailureTaskList = new Set();
const failConditionTypeNameList = new Set();

for (const task of tasks) {
  if (task.taskRequirements) {
    task.taskRequirements.forEach((tr) => {
      if (tr.status) {
        tr.status.forEach((s) => taskStatusList.add(s));
      }
    });
  }
  if (task.objectives) {
    task.objectives.forEach((o) => {
      if (o.__typename === "TaskObjectiveTaskStatus") {
        if (o.status) {
          o.status.forEach((s) => taskStatusList.add(s));
        }
      }

      if (o.__typename === "TaskObjectiveItem") {
        taskObjectiveItemTypeList.add(o.type);
      }
    });
  }

  if (task.failConditions && task.failConditions.length > 0) {
    possibleFailureTaskList.add(task.normalizedName);
    task.failConditions.forEach((o) => {
      failConditionTypeNameList.add(o.__typename);
    });
  }
}

console.log(taskStatusList);

console.log(taskObjectiveItemTypeList);

console.log(possibleFailureTaskList);

console.log(failConditionTypeNameList);

import type { Metadata } from "next";
import Link from "next/link";
import { getTaskList } from "@/uitls/task";
import TaskListComponent from "@/app/tasks/_components/task-list";
import { cache } from "react";

export const metadata: Metadata = {
  title: "地图任务",
};

const anyMap = { id: "any", name: "多个地点", normalizedName: "any" };

const mergedMap: Record<string, string> = {
  "ground-zero-21": "ground-zero",
  "night-factory": "factory",
};

const getTaskMapData = cache(() => {
  const taskList = getTaskList();
  const mapTasks = taskList.reduce(
    (groups, task) => {
      const maps = task.objectives.flatMap((obj) => obj.maps);
      // if (task.map) {
      //   maps.push(task.map);
      // }
      if (maps.length === 0) {
        maps.push(anyMap);
      }
      maps.forEach((map) => {
        const key = map.normalizedName;
        if (!groups[key]) {
          groups[key] = {
            map,
            tasks: [],
          };
        }
        const index = groups[key].tasks.findIndex(
          (t) => t.normalizedName === task.normalizedName,
        );
        if (index === -1) {
          groups[key].tasks.push(task);
        }
      });
      return groups;
    },
    {} as Record<string, { map: TarkovMap; tasks: TarkovTraderTask[] }>,
  );

  Object.keys(mergedMap).forEach((fromMap) => {
    const toMap = mergedMap[fromMap];
    const fromMapTasks = mapTasks[fromMap];
    const toMapTasks = mapTasks[toMap];
    if (fromMapTasks.tasks.length > 0) {
      fromMapTasks.tasks.forEach((task) => {
        const index = toMapTasks.tasks.findIndex(
          (t) => t.normalizedName === task.normalizedName,
        );
        if (index === -1) {
          toMapTasks.tasks.push(task);
        }
      });
    }
    delete mapTasks[fromMap];
  });

  const maps = Object.keys(mapTasks);
  const index = maps.indexOf(anyMap.normalizedName);
  if (index > -1) {
    maps.splice(index, 1);
    maps.push(anyMap.normalizedName);
  }
  return { maps, mapTasks };
});

const MapTaskPage = () => {
  const { maps, mapTasks } = getTaskMapData();
  return (
    <div className="p-2">
      <div className="flex gap-2 text-5xl my-2">
        <div className="p-2">
          <Link href="/tasks">商人任务</Link>
        </div>
        <div className="outline-2 p-2">地图任务</div>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {maps.map((key) => {
          const { map, tasks } = mapTasks[key];
          return (
            <div className="outline-2 p-2" key={key}>
              <div className="flex items-center">
                <div className="text-4xl flex-grow pl-2">{map.name}</div>
              </div>
              <TaskListComponent tasks={tasks} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapTaskPage;

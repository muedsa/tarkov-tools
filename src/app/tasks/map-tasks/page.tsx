import type { Metadata } from "next";
import Link from "next/link";
import { getTaskList } from "@/uitls/task";
import TaskListComponent from "@/app/tasks/_components/task-list";

export const metadata: Metadata = {
  title: "地图任务",
};

const anyMap = { id: "any", name: "多个地点", normalizedName: "any" };

const MapTaskPage = () => {
  const taskList = getTaskList();
  const mapTasksMap = taskList.reduce(
    (groups, task) => {
      const key = task.map?.normalizedName ?? anyMap.normalizedName;
      if (!groups[key]) {
        groups[key] = {
          map: task.map ?? anyMap,
          tasks: [],
        };
      }
      groups[key].tasks.push(task);
      return groups;
    },
    {} as Record<string, { map: TarkovMap; tasks: TarkovTraderTask[] }>,
  );

  const maps = Object.keys(mapTasksMap);
  const index = maps.indexOf(anyMap.normalizedName);
  if (index > -1) {
    maps.splice(index, 1);
    maps.push(anyMap.normalizedName);
  }
  console.log(maps);
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
          const { map, tasks } = mapTasksMap[key];
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

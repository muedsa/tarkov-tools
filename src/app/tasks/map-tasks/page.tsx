import TasksData from "@/../public/tarkov/data/pvp/tasks.json";
import Link from "next/link";
import TaskListComponent from "@/app/tasks/_components/task-list";

const MapTaskPage = () => {
  const { tasks } = TasksData as { tasks: TarkovTraderTask[] };
  const taskList = tasks.filter((t) => t.factionName !== "BEAR");
  const mapTasksMap = taskList.reduce(
    (groups, task) => {
      const key = task.map?.normalizedName ?? "any";
      if (!groups[key]) {
        groups[key] = {
          map: task.map ?? { id: "any", name: "任意", normalizedName: "any" },
          tasks: [],
        };
      }
      groups[key].tasks.push(task);
      return groups;
    },
    {} as Record<string, { map: TarkovMap; tasks: TarkovTraderTask[] }>,
  );

  return (
    <div className="p-2">
      <div className="flex gap-2 text-5xl my-2">
        <div className="p-2">
          <Link href="/tasks">商人任务</Link>
        </div>
        <div className="outline-2 p-2">地图任务</div>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {Object.keys(mapTasksMap).map((key) => {
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

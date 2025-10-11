import TasksData from "@/../public/tarkov/data/pvp/tasks.json";
import Image from "next/image";
import Link from "next/link";
import { handleTarkovDevImageLink } from "@/uitls/image-util";
import TaskListComponent from "./_components/task-list";

const traders = [
  "prapor",
  "therapist",
  "skier",
  "peacekeeper",
  "mechanic",
  "ragman",
  "jaeger",
  "fence",
  "btr-driver",
  "lightkeeper",
  "ref",
];

export default function TraderTaskPage() {
  const { tasks } = TasksData as { tasks: TarkovTraderTask[] };
  const taskList = tasks.filter((t) => t.factionName !== "BEAR");
  const traderTasksMap = taskList.reduce(
    (groups, task) => {
      if (!groups[task.trader.normalizedName]) {
        groups[task.trader.normalizedName] = {
          trader: task.trader,
          tasks: [],
        };
      }
      groups[task.trader.normalizedName].tasks.push(task);
      return groups;
    },
    {} as Record<string, { trader: TarkovTrader; tasks: TarkovTraderTask[] }>,
  );

  return (
    <div className="p-2">
      <div className="flex gap-2 text-5xl my-2">
        <div className="outline-2 p-2">商人任务</div>
        <div className="p-2">
          <Link href="/tasks/map-tasks">地图任务</Link>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {traders.map((key) => {
          const { trader, tasks } = traderTasksMap[key];

          return (
            <div className="outline-2 p-2" key={key}>
              <div className="flex items-center">
                <div className="size-[64px]">
                  <Image
                    src={handleTarkovDevImageLink(trader.imageLink)}
                    alt={trader.name}
                    width={64}
                    height={64}
                  />
                </div>
                <div className="text-4xl flex-grow pl-2">{trader.name}</div>
              </div>
              <TaskListComponent tasks={tasks} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

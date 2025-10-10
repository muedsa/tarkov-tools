import TasksData from "@/../public/tarkov/data/pvp/tasks.json";
import Image from "next/image";
import Link from "next/link";
import { handleTarkovDevImageLink } from "@/uitls/image-util";

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
  const traderTasksMap = taskList.reduce((groups, task) => {
    if (!groups[task.trader.normalizedName]) {
      groups[task.trader.normalizedName] = {
        trader: task.trader,
        tasks: [],
      };
    }
    groups[task.trader.normalizedName].tasks.push(task);
    return groups;
  }, {} as Record<string, { trader: TarkovTrader; tasks: TarkovTraderTask[] }>);

  return (
    <div className="grid grid-cols-6 gap-4 p-2">
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
            <ul className="list-disc list-inside mt-2 ml-2">
              {tasks.map((t) => (
                <li key={t.normalizedName}>
                  <Link href={`/tasks/${t.normalizedName}`} target="_blank">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

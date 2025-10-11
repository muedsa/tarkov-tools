import { handleTarkovDevImageLink } from "@/uitls/image-util";
import Image from "next/image";
import TaskKey from "./task-key";
import TaskObjective from "./task-objective";

const TaskPage = ({
  task,
  children,
}: {
  task: TarkovTraderTask;
  children: React.ReactNode;
}) => {
  return (
    <div className="p-2">
      <div className="flex border-2 mt-2">
        <div className="grow">
          <div className="flex gap-2 items-center p-2 bg-gray-950/40">
            <span className="border-1 rounded-lg p-1 text-base text-gold-one">
              任务
            </span>
            <span className="text-4xl">{task.name}</span>
            {task.kappaRequired && (
              <svg
                className="inline size-[1.25em]"
                viewBox="0 0 24 24"
                role="img"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z"
                  fill="currentcolor"
                ></path>
              </svg>
            )}
            {task.lightkeeperRequired && (
              <svg
                className="inline size-[1.25em]"
                viewBox="0 0 24 24"
                role="img"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M8,10V8H9V4H8V3L12,1L16,3V4H15V8H16V10H14.74L8.44,13.64L9,10H8M13,8V4H11V8H13M7,23L7.04,22.76L16.15,17.5L16.67,20.88L13,23H7M8.05,16.17L15.31,12L15.83,15.37L7.43,20.22L8.05,16.17Z"
                  fill="currentcolor"
                ></path>
              </svg>
            )}
          </div>
          <div className="text-xl p-2">
            地图:{" "}
            <span className="text-gold-one">{task.map?.name ?? "任意"}</span>
          </div>
          <div className="text-xl p-2">
            商人: <span className="text-gold-one">{task.trader.name}</span>
          </div>
        </div>
        <div className="w-[314] h-[177]">
          <Image
            width={314}
            height={177}
            alt={task.name}
            src={handleTarkovDevImageLink(task.taskImageLink)}
          ></Image>
        </div>
      </div>
      {task.neededKeys.length > 0 && (
        <div className="border-2 mt-4">
          <div className="text-3xl p-2 bg-gray-950/40">需要钥匙</div>
          {task.neededKeys.map((taskKey) => (
            <TaskKey key={taskKey.map.normalizedName} taskKey={taskKey} />
          ))}
        </div>
      )}
      <div className="border-2 mt-4">
        <div className="text-3xl p-2 bg-gray-950/40">任务目标</div>
        {task.objectives.map((objective) => (
          <TaskObjective key={objective.id} objective={objective} />
        ))}
      </div>
      <div className="border-2 mt-4">
        <div className="text-3xl p-2 bg-gray-950/40">任务攻略</div>
        <div className="p-2 task-guides">{children}</div>
      </div>
      <details className="mt-2">
        <summary>数据</summary>
        <pre className="p-2">{JSON.stringify(task, null, 4)}</pre>
      </details>
    </div>
  );
};

export default TaskPage;

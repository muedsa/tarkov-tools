import TaskItemImage from "./task-item-image";

export default function TaskKey({ taskKey }: { taskKey: TarkovTaskKey }) {
  return (
    <div className="p-2 bg-gray-950/30">
      <div className="text-white">{taskKey.map.name}</div>
      <div className="flex flex-wrap">
        {taskKey.keys.map((item) => (
          <TaskItemImage key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

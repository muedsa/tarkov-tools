"use client";

import { useState, useEffect } from "react";
import TaskCard from "./_components/task-card";

const MixedItemsTasksPage = ({ gameMode }: { gameMode: GameMode }) => {
  const [tasks, setTasks] = useState<MixedItemsTraderTaskData[]>([]);

  useEffect(() => {
    fetch(`/tarkov/data/${gameMode}/mixedItemsTasks.json`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [gameMode]);

  return (
    <div className="bg-gunmetal-dark p-4">
      <div className="text-6xl text-gold-one">
        其他需求物品任务
        <span className="align-top p-1 text-white bg-green rounded-xl text-sm">
          {gameMode.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} data={task} />
        ))}
      </div>
    </div>
  );
};

export default MixedItemsTasksPage;

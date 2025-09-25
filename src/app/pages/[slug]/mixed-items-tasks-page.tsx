"use client";

import { useState, useEffect } from "react";
import TaskCard from "./_components/task-card";

const MixedItemsTasksPage = () => {
  const [tasks, setTasks] = useState<MixedItemsTraderTaskData[]>([]);

  useEffect(() => {
    fetch("/tarkov/data/pve/mixedItemsTasks.json")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  return (
    <div className="bg-gunmetal-dark p-4">
      <div className="text-6xl text-gold-one">其他需求物品任务</div>
      <div className="grid grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} data={task} />
        ))}
      </div>
    </div>
  );
};

export default MixedItemsTasksPage;

import TaskGuideStyle from "./task-guide.module.css";

const TaskGuide = ({ children }: { children: React.ReactNode }) => (
  <div className="border-2 mt-4">
    <div className="text-3xl p-2 bg-gray-950/40">任务攻略</div>
    <div className={`p-2 ${TaskGuideStyle["task-guide"]}`}>{children}</div>
  </div>
);

export default TaskGuide;

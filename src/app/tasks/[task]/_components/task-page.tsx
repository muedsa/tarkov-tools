const TaskPage = ({
  task,
  children,
}: {
  task: TarkovTraderTask;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <div className="text-2xl p-2 my-2 color-glod-two">{task.name}</div>
      <pre className="p-2">{JSON.stringify(task, null, 4)}</pre>
      <div className="task-guides">{children}</div>
    </div>
  );
};

export default TaskPage;

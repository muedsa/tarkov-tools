import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import TasksData from "@/../public/tarkov/data/pvp/tasks.json";
import TaskPage from "./_components/task-page";

const NotFoundGuideComponent = () => <></>;

export default async function TaskPostPage({
  params,
}: {
  params: Promise<{ task: string }>;
}) {
  const { task } = await params;

  const { tasks } = TasksData as { tasks: TarkovTraderTask[] };
  const taskList = tasks.filter((t) => t.factionName !== "BEAR");

  const taskData = taskList.find((t) => t.normalizedName === task);

  if (!!!taskData) {
    return notFound();
  }

  const GuideComponent = dynamic(() =>
    import(`./${task}.mdx`).catch(() =>
      import(`./not-found-task-guide.mdx`).catch(() => NotFoundGuideComponent),
    ),
  );

  return (
    <TaskPage task={taskData}>
      <GuideComponent />
    </TaskPage>
  );
}

import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTask, getTaskList } from "@/uitls/task";
import TaskPage from "./_components/task-page";
import { handleTarkovDevImageLink } from "@/uitls/image-util";

const NotFoundGuideComponent = () => <></>;

type TaskPostPageProps = {
  params: Promise<{ task: string }>;
};

export async function generateStaticParams() {
  const taskList = getTaskList();

  return taskList.map((task) => ({
    task: task.normalizedName,
  }));
}

export async function generateMetadata({
  params,
}: TaskPostPageProps): Promise<Metadata> {
  const { task } = await params;
  const taskData = getTask(task);
  if (!!!taskData) {
    return {};
  }
  return {
    title: taskData.name,
    description: `${taskData.name} | 逃落塔科夫任务攻略`,
    openGraph: {
      images: [
        {
          url: handleTarkovDevImageLink(taskData.taskImageLink),
        },
      ],
    },
  };
}

export default async function TaskPostPage({ params }: TaskPostPageProps) {
  const { task } = await params;

  const taskData = getTask(task);

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

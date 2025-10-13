import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

type ItemsPageProps = {
  params: Promise<{ gameMode: GameMode; slug: string }>;
};

export async function generateStaticParams() {
  return [
    {
      gameMode: "pvp",
      slug: "found-in-raid-items-page",
    },
    {
      gameMode: "pvp",
      slug: "mixed-items-tasks-page",
    },
    {
      gameMode: "pve",
      slug: "found-in-raid-items-page",
    },
    {
      gameMode: "pve",
      slug: "mixed-items-tasks-page",
    },
  ];
}

export default async function ItemsPage({ params }: ItemsPageProps) {
  const { gameMode, slug } = await params;
  const DynamicPostPage = dynamic<{ gameMode: GameMode }>(() =>
    import(`./${slug}.tsx`).catch(() => notFound()),
  );
  return <DynamicPostPage gameMode={gameMode} />;
}

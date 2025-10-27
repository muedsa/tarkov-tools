import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ItemsPageProps = {
  params: Promise<{ gameMode: GameMode; slug: string }>;
};

export const dynamicParams = false;

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
      gameMode: "pvp",
      slug: "hideout-stations-page",
    },
    {
      gameMode: "pve",
      slug: "found-in-raid-items-page",
    },
    {
      gameMode: "pve",
      slug: "mixed-items-tasks-page",
    },
    {
      gameMode: "pve",
      slug: "hideout-stations-page",
    },
  ];
}

const titles: Record<string, string> = {
  "found-in-raid-items-page": "战局内带出物品",
  "mixed-items-tasks-page": "其他需求物品任务",
  "hideout-stations-page": "藏身处",
};

export async function generateMetadata({
  params,
}: ItemsPageProps): Promise<Metadata> {
  const { gameMode, slug } = await params;
  const title = `${titles[slug] ?? "物品收集工具"} ${gameMode.toUpperCase()}`;
  return {
    title: title,
    description: `${title} | 逃离塔科夫任务攻略`,
  };
}

export default async function ItemsPage({ params }: ItemsPageProps) {
  const { gameMode, slug } = await params;
  const DynamicPostPage = dynamic<{ gameMode: GameMode }>(() =>
    import(`./${slug}.tsx`).catch(() => notFound()),
  );
  return <DynamicPostPage gameMode={gameMode} />;
}

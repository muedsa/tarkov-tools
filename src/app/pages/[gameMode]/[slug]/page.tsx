import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ gameMode: GameMode; slug: string }>;
}) {
  const { gameMode, slug } = await params;
  const DynamicPostPage = dynamic<{ gameMode: GameMode }>(() =>
    import(`./${slug}.tsx`).catch(() => notFound())
  );
  return <DynamicPostPage gameMode={gameMode} />;
}

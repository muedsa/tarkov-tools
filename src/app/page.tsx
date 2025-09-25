import Link from "next/link";
import GenshinLaunch from "./_componets/genshin-launch";

export default function Home() {
  return (
    <>
      <GenshinLaunch />
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col row-start-2 items-center">
          <div className="text-5xl">Tarkov Tools</div>
          <p>Buiding...</p>
          <ol className="list-inside list-decimal text-sm/6 text-left">
            <li className="tracking-[-.01em]">
              <Link href="/pages/found-in-raid-items-page">战局内带出物品</Link>
            </li>
            <li className="mb-2 tracking-[-.01em]">
              <Link href="/pages/mixed-items-tasks-page">其他需求物品任务</Link>
            </li>
          </ol>
        </main>
      </div>
    </>
  );
}

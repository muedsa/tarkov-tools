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
          <ol className="mt-2 list-inside list-decimal text-sm/6 text-left">
            <li className="tracking-[-.01em]">
              <Link href="/pages/pvp/found-in-raid-items-page">
                战局内带出物品 PVP
              </Link>
            </li>
            <li className="tracking-[-.01em]">
              <Link href="/page/pvp/mixed-items-tasks-page">
                其他需求物品任务 PVP
              </Link>
            </li>
            <li className="tracking-[-.01em]">
              <Link href="/pages/pve/found-in-raid-items-page">
                战局内带出物品 PVE
              </Link>
            </li>
            <li className="tracking-[-.01em]">
              <Link href="/pages/pve/mixed-items-tasks-page">
                其他需求物品任务 PVE
              </Link>
            </li>
          </ol>
        </main>
      </div>
    </>
  );
}

import Link from "next/link";
import GenshinLaunch from "./_components/genshin-launch";

export default function Home() {
  return (
    <>
      <GenshinLaunch />
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col row-start-2 items-center">
          <div className="text-5xl">Tarkov Tools</div>
          <p>Buiding...</p>
          <ol className="mt-2 list-inside list-disc text-sm/6 text-left">
            <li className="tracking-[-.01em]">
              <Link href="/items/pvp/found-in-raid-items-page" target="_blank">
                战局内带出物品 PVP
              </Link>
            </li>
            <li className="tracking-[-.01em]">
              <Link href="/items/pvp/mixed-items-tasks-page" target="_blank">
                其他需求物品任务 PVP
              </Link>
            </li>
            <li className="tracking-[-.01em]">
              <Link href="/items/pve/found-in-raid-items-page" target="_blank">
                战局内带出物品 PVE
              </Link>
            </li>
            <li className="tracking-[-.01em]">
              <Link href="/items/pve/mixed-items-tasks-page" target="_blank">
                其他需求物品任务 PVE
              </Link>
            </li>
            <li className="tracking-[-.01em]">
              <Link href="/maps" target="_blank">
                地图
              </Link>
            </li>
            <li className="tracking-[-.01em]">
              <Link href="/tasks" target="_blank">
                任务
              </Link>
            </li>
          </ol>
        </main>
      </div>
    </>
  );
}

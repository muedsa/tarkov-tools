import type { Metadata } from "next";
import { UserDataProvider } from "./_components/user-data-context";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "物品收集工具",
};

export default async function ItemsPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ gameMode: string; slug: string }>;
}) {
  const { gameMode } = await params;
  if (gameMode !== "pve" && gameMode !== "pvp") {
    return notFound();
  }
  return <UserDataProvider gameMode={gameMode}>{children}</UserDataProvider>;
}

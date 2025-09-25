import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarkov Tools",
  description: "Escape from Tarkov tools and guides",
};

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

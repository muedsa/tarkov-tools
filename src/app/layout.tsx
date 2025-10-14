import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tarkov.muedsa.com"),
  title: {
    default: "逃离塔科夫工具 | Tarkov Tools",
    template: "%s | 逃离塔科夫工具 | Tarkov Tools",
  },
  description:
    "逃离塔科夫工具与任务攻略。Escape from Tarkov tools and task guides",
  keywords: ["逃离塔科夫", "塔科夫", "escape from tarkov", "tarkov"],
  applicationName: "逃离塔科夫工具 | Tarkov Tools",
  authors: { url: "https://github.com/muedsa/tarkov-tools", name: "MUEDSA" },
  openGraph: {
    type: "website",
    url: "https://tarkov.muedsa.com",
    title: "逃离塔科夫工具 | Tarkov Tools",
    description:
      "逃离塔科夫工具与任务攻略。Escape from Tarkov tools and task guides",
    siteName: "逃离塔科夫工具 | Tarkov Tools",
    images: [
      {
        url: "/tarkov/images/600302d73b897b11364cd161.webp",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

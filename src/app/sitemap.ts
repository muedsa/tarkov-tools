import type { MetadataRoute } from "next";
import path from "path";
import fs from "fs";
import { getTaskList } from "@/uitls/task";
import { handleTarkovDevImageLink } from "@/uitls/image-util";

const rootDir = path.resolve(process.cwd(), "src", "app");

const BASE_URL = "https://tarkov.muedsa.com";

const getFixedPageSitemap = (createDate: Date): MetadataRoute.Sitemap => {
  return [
    {
      url: BASE_URL,
      lastModified: fs.statSync(path.resolve(rootDir, "page.tsx")).mtime,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: fs.statSync(path.resolve(rootDir, "about", "page.tsx"))
        .mtime,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/maps`,
      lastModified: fs.statSync(path.resolve(rootDir, "maps", "page.tsx"))
        .mtime,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/items/pvp/found-in-raid-items-page`,
      lastModified: createDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/items/pvp/hideout-stations-page`,
      lastModified: createDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/items/pvp/mixed-items-tasks-page`,
      lastModified: createDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/items/pve/found-in-raid-items-page`,
      lastModified: createDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/items/pve/hideout-stations-page`,
      lastModified: createDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/items/pve/mixed-items-tasks-page`,
      lastModified: createDate,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/tasks`,
      lastModified: createDate,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
};

const getTaskPagesSitemap = (createDate: Date): MetadataRoute.Sitemap => {
  return getTaskList().map((task) => {
    return {
      url: `${BASE_URL}/tasks/${task.normalizedName}`,
      lastModified: createDate,
      changeFrequency: "monthly",
      images: [`${BASE_URL}${handleTarkovDevImageLink(task.taskImageLink)}`],
    };
  });
};

// output: "export"
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const createDate = new Date();
  return [
    ...getFixedPageSitemap(createDate),
    ...getTaskPagesSitemap(createDate),
  ];
}

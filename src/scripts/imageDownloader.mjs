import { fileURLToPath } from "node:url";
import path from "node:path";
import https from "node:https";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRootDir = path.join(__dirname, "../../");

const args = process.argv.slice(2);
const mode = args[0];
if (mode !== "pve" && mode !== "pvp") {
  throw Error(
    `args mode only pve or regular, but get args=${JSON.stringify(args)}`,
  );
}

// 图片保存路径
const saveDir = path.join(projectRootDir, "public/tarkov/images/");

// 下载图片到本地
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`请求失败，状态码: ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => resolve());
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => reject(err));
        console.log(err);
      });
  });
}

// 检查图片是否存在，若不存在则下载
async function checkAndSaveImage(imageKey) {
  if (!!!imageKey) return;
  let imageUrl = `https://assets.tarkov.dev/${imageKey}`;
  if (imageKey.startsWith("https://assets.tarkov.dev/")) {
    imageUrl = imageKey;
    imageKey = imageKey.replace("https://assets.tarkov.dev/", "");
  }
  const filePath = path.join(saveDir, imageKey);
  if (!fs.existsSync(filePath)) {
    console.log(`Downloaded: ${imageUrl} to ${filePath}`);
    await downloadImage(imageUrl, filePath);
  }
}

const tasksFileData = fs.readFileSync(
  path.join(projectRootDir, `public/tarkov/data/${mode}/tasks.json`),
  "utf-8",
);
const { tasks } = JSON.parse(tasksFileData);
for await (const task of tasks) {
  await checkAndSaveImage(task.taskImageLink);
  await checkAndSaveImage(task.trader.imageLink);
  if (task.objectives) {
    for await (const objective of task.objectives) {
      if (objective.items) {
        for await (const item of objective.items) {
          if (item.iconLink) await checkAndSaveImage(item.iconLink);
        }
      }
      if (objective.questItem?.iconLink) {
        await checkAndSaveImage(objective.questItem.iconLink);
      }
      if (objective.useAny) {
        for await (const item of objective.useAny) {
          if (item.iconLink) await checkAndSaveImage(item.iconLink);
        }
      }
    }
  }
}

const foundInRaidBarterItemsFileData = fs.readFileSync(
  path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/foundInRaidBarterItems.json`,
  ),
  "utf-8",
);
const foundInRaidBarterItems = JSON.parse(foundInRaidBarterItemsFileData);
for await (const item of foundInRaidBarterItems) {
  await checkAndSaveImage(item.iconLink);
  if (item.tasks) {
    for await (const task of item.tasks) {
      await checkAndSaveImage(task.traderImageLink);
    }
  }
  if (item.hideoutStations) {
    for await (const station of item.hideoutStations) {
      await checkAndSaveImage(station.imageLink);
    }
  }
}

const foundInRaidTaskItemsFileData = fs.readFileSync(
  path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/foundInRaidTaskItems.json`,
  ),
  "utf-8",
);
const foundInRaidTaskItems = JSON.parse(foundInRaidTaskItemsFileData);
for await (const item of foundInRaidTaskItems) {
  await checkAndSaveImage(item.iconLink);
  if (item.tasks) {
    for await (const task of item.tasks) {
      await checkAndSaveImage(task.traderImageLink);
    }
  }
  if (item.hideoutStations) {
    for await (const station of item.hideoutStations) {
      await checkAndSaveImage(station.imageLink);
    }
  }
}

const mixedItemsTasksFileData = fs.readFileSync(
  path.join(projectRootDir, `public/tarkov/data/${mode}/mixedItemsTasks.json`),
  "utf-8",
);
const mixedItemsTasks = JSON.parse(mixedItemsTasksFileData);
for await (const task of mixedItemsTasks) {
  await checkAndSaveImage(task.taskImageLink);
  await checkAndSaveImage(task.traderImageLink);
  if (task.objectives) {
    for await (const objective of task.objectives) {
      if (objective.items) {
        for await (const item of objective.items) {
          await checkAndSaveImage(item.iconLink);
        }
      }
    }
  }
}

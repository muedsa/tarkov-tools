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
    `args mode only pve or regular, but get args=${JSON.stringify(args)}`
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
      });
  });
}

// 检查图片是否存在，若不存在则下载
async function checkAndSaveImage(imageKey) {
  const imageUrl = `https://assets.tarkov.dev/${imageKey}`;
  const filePath = path.join(saveDir, imageKey);
  if (!fs.existsSync(filePath)) {
    await downloadImage(imageUrl, filePath);
    console.log(`Downloaded: ${imageKey}`);
  }
}

const foundInRaidBarterItemsFileData = fs.readFileSync(
  path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/foundInRaidBarterItems.json`
  ),
  "utf-8"
);
const foundInRaidBarterItems = JSON.parse(foundInRaidBarterItemsFileData);
foundInRaidBarterItems.forEach((item) => {
  checkAndSaveImage(item.iconLink);
  item.tasks?.forEach((task) => {
    checkAndSaveImage(task.traderImageLink);
  });
  item.hideoutStations?.forEach((station) => {
    checkAndSaveImage(station.imageLink);
  });
});

const foundInRaidTaskItemsFileData = fs.readFileSync(
  path.join(
    projectRootDir,
    `public/tarkov/data/${mode}/foundInRaidTaskItems.json`
  ),
  "utf-8"
);
const foundInRaidTaskItems = JSON.parse(foundInRaidTaskItemsFileData);
foundInRaidTaskItems.forEach((item) => {
  checkAndSaveImage(item.iconLink);
  item.tasks?.forEach((task) => {
    checkAndSaveImage(task.traderImageLink);
  });
  item.hideoutStations?.forEach((station) => {
    checkAndSaveImage(station.imageLink);
  });
});

const mixedItemsTasksFileData = fs.readFileSync(
  path.join(projectRootDir, `public/tarkov/data/${mode}/mixedItemsTasks.json`),
  "utf-8"
);

const mixedItemsTasks = JSON.parse(mixedItemsTasksFileData);
mixedItemsTasks.forEach((task) => {
  checkAndSaveImage(task.taskImageLink);
  checkAndSaveImage(task.traderImageLink);
  task.objectives.forEach((objective) => {
    objective.items.forEach((item) => {
      checkAndSaveImage(item.iconLink);
    });
  });
});

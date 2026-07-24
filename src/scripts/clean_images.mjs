import fs from "fs";
import path from "path";

const projectRootDir = process.cwd();

const IMAGE_DIR =
  process.env.IMAGE_DIR ||
  path.join(projectRootDir, "public", "tarkov", "images");
const JSON_DIRS = [
  path.join(projectRootDir, "public", "data"),
  path.join(projectRootDir, "public", "tarkov", "data"),
];

const SUPPORTED_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
]);

function usage() {
  console.log(
    "Usage: node src/scripts/clean_images.mjs [--yes] [--images <dir>] [--data <dir>]\n",
  );
  console.log("Options:");
  console.log(
    "  --yes         Actually delete files. Without it runs in dry-run mode.",
  );
  console.log("  --images DIR  Use custom images directory.");
  console.log(
    "  --data DIR    Use custom data directory (can be used multiple times).",
  );
  process.exit(1);
}

async function walk(dir) {
  const entries = await fs.promises
    .readdir(dir, { withFileTypes: true })
    .catch(() => []);
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function collectJsonText(dirs) {
  let all = "";
  for (const d of dirs) {
    try {
      const stat = await fs.promises.stat(d);
      if (!stat.isDirectory()) continue;
    } catch (e) {
      continue;
    }
    const files = await walk(d);
    for (const f of files) {
      if (path.extname(f).toLowerCase() !== ".json") continue;
      try {
        const raw = await fs.promises.readFile(f, "utf8");
        // parse to ensure valid JSON and then stringify to normalize
        const obj = JSON.parse(raw);
        all += JSON.stringify(obj).toLowerCase();
      } catch (e) {
        // fallback: include raw text if parse fails
        try {
          const raw = await fs.promises.readFile(f, "utf8");
          all += raw.toLowerCase();
        } catch {}
      }
    }
  }
  return all;
}

async function main() {
  const argv = process.argv.slice(2);
  let doDelete = false;
  const additionalDataDirs = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--yes") doDelete = true;
    else if (a === "--images") {
      i++;
      if (!argv[i]) usage();
      process.env.IMAGE_DIR = argv[i];
    } else if (a === "--data") {
      i++;
      if (!argv[i]) usage();
      additionalDataDirs.push(path.resolve(argv[i]));
    } else if (a === "-h" || a === "--help") usage();
    else usage();
  }

  const imagesDir = process.env.IMAGE_DIR || IMAGE_DIR;
  const dataDirs = JSON_DIRS.concat(additionalDataDirs);

  try {
    const stat = await fs.promises.stat(imagesDir);
    if (!stat.isDirectory()) throw new Error("not a directory");
  } catch (e) {
    console.error("Images directory not found:", imagesDir);
    process.exit(2);
  }

  console.log("Scanning JSON data directories...");
  const jsonText = await collectJsonText(dataDirs);
  if (!jsonText) console.log("Warning: no JSON content found in data dirs.");

  console.log("Scanning images in:", imagesDir, "(no subdirectories)");
  const entries = await fs.promises
    .readdir(imagesDir, { withFileTypes: true })
    .catch(() => []);
  const imageFiles = entries
    .filter(
      (e) =>
        e.isFile() && SUPPORTED_EXT.has(path.extname(e.name).toLowerCase()),
    )
    .map((e) => path.join(imagesDir, e.name));

  const toDelete = [];
  const txtLower = jsonText.toLowerCase();
  for (const f of imageFiles) {
    const filename = path.basename(f).toLowerCase();
    const basename = path.basename(f, path.extname(f)).toLowerCase();
    if (!txtLower.includes(filename) && !txtLower.includes(basename)) {
      toDelete.push(f);
    }
  }

  if (toDelete.length === 0) {
    console.log("No unreferenced images found. Nothing to delete.");
    return;
  }

  console.log(`Found ${toDelete.length} unreferenced image(s):`);
  for (const p of toDelete) console.log(" -", p);

  if (!doDelete) {
    console.log(
      "\nDry-run mode. To actually delete these files run:\n  node src/scripts/clean_images.mjs --yes\n",
    );
    return;
  }

  console.log("Deleting...");
  let deleted = 0;
  for (const p of toDelete) {
    try {
      await fs.promises.unlink(p);
      deleted++;
    } catch (e) {
      console.error("Failed to delete:", p, e.message);
    }
  }
  console.log(`Deleted ${deleted} file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

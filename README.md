# Tarkov tools

一个[逃离塔科夫](https://www.escapefromtarkov.com/)游戏工具。

## 功能

- 战局内带出物品 与 其他需求物品任务
- 地图
- 任务

## 本地开发

建议使用 Node.js 22 LTS（至少 22.13）及 `package.json` 中指定版本的 pnpm。若已安装 Corepack，可运行 `corepack enable pnpm` 启用 pnpm。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

运行 `pnpm run build` 将站点静态导出到 `out/`。

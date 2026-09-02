# syntax=docker/dockerfile:1

# ---------- 构建阶段：生成静态导出产物 out/ ----------
FROM node:22-alpine AS builder
WORKDIR /app

# 先复制依赖清单，最大化利用 Docker 层缓存（依赖未变时跳过 npm ci）
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# 复制其余源码并构建。next.config.ts 里 output: "export" 会将结果输出到 out/
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- 运行阶段：nginx 托管静态文件 ----------
FROM nginx:alpine AS runner

# 安装 tzdata 并设置系统时区为 Asia/Shanghai
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

# 静态导出产物 → nginx 默认站点根目录
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

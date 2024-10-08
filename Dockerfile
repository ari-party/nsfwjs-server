FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y curl libc6-dev

RUN corepack enable pnpm

WORKDIR /server

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "start"]

EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=5s --retries=10 --start-period=5s \
  CMD curl --fail http://localhost:${PORT:-3000}/healthcheck || exit 1

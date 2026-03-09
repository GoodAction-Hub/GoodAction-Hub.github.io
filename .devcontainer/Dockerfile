FROM oven/bun:1.3.10 AS bun

FROM mcr.microsoft.com/devcontainers/typescript-node:24
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY --from=bun /usr/local/bin/bunx /usr/local/bin/bunx

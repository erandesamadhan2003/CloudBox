FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install

FROM deps AS dev
COPY . .
EXPOSE 5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "5173"]

FROM deps AS build
COPY . .

RUN if [ ! -f .env.local ]; then echo ".env.local not found in build context" && exit 1; fi \
	&& set -a \
	&& . ./.env.local \
	&& set +a \
	&& bun run build

FROM nginx:1.27-alpine AS prod

RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

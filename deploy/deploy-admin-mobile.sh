#!/bin/bash
# Деплой admin-mobile через Docker (adminmb.safeddara.tj)
set -e

REPO_PATH="${DEPLOY_PATH:-$(cd "$(dirname "$0")/.." && pwd)}"

echo "=== Деплой admin-mobile (Docker) ==="
echo "→ Репозиторий: $REPO_PATH"

cd "$REPO_PATH"
echo "→ git pull..."
git pull origin main

echo "→ docker compose build..."
docker compose -f docker-compose.admin.yml build --no-cache admin

echo "→ docker compose up -d..."
docker compose -f docker-compose.admin.yml up -d admin

echo "✅ Деплой завершён!"
echo "Админка: http://localhost:3003 (порт 3003)"
echo "Nginx: proxy adminmb.safeddara.tj -> 127.0.0.1:3003"

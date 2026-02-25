# Деплой admin-mobile через Docker (SSH)
$ErrorActionPreference = "Stop"

$PROD_SERVER = if ($env:DEPLOY_SERVER) { $env:DEPLOY_SERVER } else { "193.111.11.98" }
$PROD_USER = if ($env:DEPLOY_USER) { $env:DEPLOY_USER } else { "slmtech" }
$PROD_SSH_PORT = if ($env:DEPLOY_SSH_PORT) { $env:DEPLOY_SSH_PORT } else { "3222" }
$PROD_PATH = if ($env:DEPLOY_PATH) { $env:DEPLOY_PATH } else { "/opt/safeddara-mobile" }
$SSH_KEY = if ($env:SSH_KEY) { $env:SSH_KEY } else { "$HOME\.ssh\id_rsa" }

Write-Host "=== Деплой admin-mobile (Docker) на $PROD_SERVER ===" -ForegroundColor Green

$cmd = @"
cd $PROD_PATH && git pull origin main && docker compose -f docker-compose.admin.yml build --no-cache admin && docker compose -f docker-compose.admin.yml up -d admin
"@

ssh -p $PROD_SSH_PORT -i $SSH_KEY "${PROD_USER}@${PROD_SERVER}" $cmd

Write-Host "`nДеплой завершён! Админка: https://adminmb.safeddara.tj/" -ForegroundColor Cyan
Write-Host "На сервере nginx: proxy adminmb.safeddara.tj -> 127.0.0.1:3003" -ForegroundColor Yellow

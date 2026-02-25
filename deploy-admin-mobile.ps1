# Deploy admin-mobile to safeddara.tj/admin-mobile
$ErrorActionPreference = "Stop"

$PROD_SERVER = if ($env:ADMIN_DEPLOY_SERVER) { $env:ADMIN_DEPLOY_SERVER } else { "safeddara-main" }
$PROD_USER = if ($env:ADMIN_DEPLOY_USER) { $env:ADMIN_DEPLOY_USER } else { "slmtech" }
$PROD_SSH_PORT = if ($env:ADMIN_DEPLOY_SSH_PORT) { $env:ADMIN_DEPLOY_SSH_PORT } else { "3222" }
$PROD_PATH = if ($env:ADMIN_DEPLOY_PATH) { $env:ADMIN_DEPLOY_PATH } else { "/var/www/safeddara.mobile-admin" }
$SSH_KEY = if ($env:SSH_KEY) { $env:SSH_KEY } else { "$HOME\.ssh\id_rsa" }

Write-Host "=== Deploy admin-mobile to $PROD_SERVER ===" -ForegroundColor Green

Write-Host "Build (mode admin-mobile)..." -ForegroundColor Yellow
npm run build:admin-mobile
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "Upload to server..." -ForegroundColor Yellow
scp -P $PROD_SSH_PORT -i $SSH_KEY -r dist/* "${PROD_USER}@${PROD_SERVER}:${PROD_PATH}/"

Write-Host "`nDone! Admin: https://safeddara.tj/admin-mobile" -ForegroundColor Green

#!/bin/bash
# Deploy admin-mobile to safeddara.tj/admin-mobile
set -e

PROD_SERVER="${ADMIN_DEPLOY_SERVER:-safeddara-main}"
PROD_USER="${ADMIN_DEPLOY_USER:-slmtech}"
PROD_SSH_PORT="${ADMIN_DEPLOY_SSH_PORT:-3222}"
PROD_PATH="${ADMIN_DEPLOY_PATH:-/var/www/safeddara.mobile-admin}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_rsa}"

echo "=== Deploy admin-mobile to $PROD_SERVER ==="

echo "Build (mode admin-mobile)..."
npm run build:admin-mobile

echo "Upload to server..."
rsync -avz --delete -e "ssh -p ${PROD_SSH_PORT} -i ${SSH_KEY}" dist/ "${PROD_USER}@${PROD_SERVER}:${PROD_PATH}/"

echo "Done! Admin: https://safeddara.tj/admin-mobile"

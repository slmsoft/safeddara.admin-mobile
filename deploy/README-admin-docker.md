# Admin-mobile через Docker

## Что сделано

- **Dockerfile.admin** — multi-stage: Node build + nginx
- **docker-compose.admin.yml** — сервис admin на порту 3003
- **deploy-admin-mobile.sh** — деплой на сервере
- **deploy-admin-mobile.ps1** — деплой через SSH с Windows
- **nginx-adminmb.safeddara.tj.conf** — nginx proxy на контейнер

## На сервере (первый раз)

### 1. Удалить старую админку (если была)

```bash
# Удалить статические файлы (опционально)
sudo rm -rf /var/www/safeddara.mobile-admin

# Удалить старый nginx config для admin-mobile в safeddara.tj (если был)
# или оставить только proxy на 3003
```

### 2. Клонировать / обновить репо

```bash
cd /opt
sudo git clone <repo-url> safeddara-mobile  # или твой путь
cd safeddara-mobile
# или если уже есть: cd /opt/safeddara-mobile && git pull origin main
```

### 3. Настроить nginx для adminmb.safeddara.tj

```bash
sudo cp deploy/nginx-adminmb.safeddara.tj.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/nginx-adminmb.safeddara.tj.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4. Запустить Docker

```bash
cd /opt/safeddara-mobile
docker compose -f docker-compose.admin.yml build --no-cache admin
docker compose -f docker-compose.admin.yml up -d admin
```

### 5. Проверка

```bash
curl -I http://127.0.0.1:3003
# Должен вернуть 200 OK
```

## Обновление (деплой)

```bash
cd /opt/safeddara-mobile
./deploy/deploy-admin-mobile.sh
```

Или с Windows:
```powershell
.\deploy\deploy-admin-mobile.ps1
```

## Порты

| Сервис        | Порт | Описание              |
|---------------|------|------------------------|
| admin-mobile  | 3003 | Админка в Docker      |

Nginx проксирует adminmb.safeddara.tj → 127.0.0.1:3003

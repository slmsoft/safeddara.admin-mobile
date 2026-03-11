# Исправление 401 для POST /admin/bookings

## Проблема

При создании бронирования из админки (POST /admin/bookings) возвращается **401 Unauthorized**, хотя GET /admin/bookings (список) работает с тем же JWT.

## Вероятная причина: CORS preflight (OPTIONS)

Браузер перед POST с `Content-Type: application/json` и `Authorization` отправляет **OPTIONS** (preflight).  
Если OPTIONS проходит через `adminAuth` → нет Authorization на preflight → **401**.

## Что нужно сделать на бэкенде (2api.safeddara.tj)

### Вариант 1: Пропустить OPTIONS в adminAuth

В `adminAuth` middleware в начале добавить:

```ts
export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  // Preflight не проверяем — у него нет Authorization
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers.authorization;
  // ... остальной код без изменений
}
```

### Вариант 2: CORS обрабатывает OPTIONS до adminAuth

Убедиться, что CORS middleware подключён **до** adminRouter и обрабатывает OPTIONS:

```ts
// index.ts или app.ts
import cors from 'cors';

app.use(cors({
  origin: ['https://adminmb.safeddara.tj', 'https://safeddara.tj'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// adminRouter с adminAuth — после cors
app.use('/admin', adminAuth, adminRouter);
```

### Вариант 3: Отдельный обработчик OPTIONS

Перед adminRouter:

```ts
app.options('/admin/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://adminmb.safeddara.tj');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204);
});
```

## Проверка

После изменений:
1. Перезапустить бэкенд
2. В админке нажать «Создать» в форме добавления бронирования
3. В Network проверить: OPTIONS должен вернуть 204, POST — 200 или 201

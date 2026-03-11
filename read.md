
ssh -p 3222 slmtech@193.111.11.98

SLM@tech123

docker restart 94129c8ae390

delete from devices;
delete from users



ssh -p 6122 ubuntu@193.111.11.98

SLM@tech26 


PostgreSQL может слушать только localhost. Тогда используй SSH-туннель:
В pgAdmin → Connection → вкладка SSH Tunnel:
Use SSH tunneling: включить

Tunnel host: 193.111.11.98
Tunnel port: 3222
Username: slmtech
Password: SLM@tech123

В Connection:

Host: 127.0.0.1
Port: 5432
Database: safeddaradb
Username: slmtech
Password: SLM@tech123

---
Backend: исправление 401 для POST /admin/bookings — см. docs/BACKEND_FIX_POST_BOOKINGS_401.md
(OPTIONS preflight должен не проходить через adminAuth)

---
API debugging (2api.safeddara.tj)

GET accommodations:
curl -X GET "https://2api.safeddara.tj/accommodations" -H "Content-Type: application/json"

Backend: для callback после оплаты нужен FRONTEND_PAYMENT_RETURN_URL (или FRONTEND_URL) в .env — редирект на /payment-return.

POST bookings (замени YOUR_SESSION_ID и cardId из api.safeddara.tj/cards/all):
curl -X POST "https://2api.safeddara.tj/bookings" -H "Content-Type: application/json" -H "X-Session-ID: YOUR_SESSION_ID" -d "{\"accommodationId\":\"19b5e2b9-eddf-4d8e-8aa6-9f105f773107\",\"checkIn\":\"2026-05-01\",\"checkOut\":\"2026-05-02\",\"guests\":2,\"guestName\":\"Test\",\"guestEmail\":\"test@example.com\",\"cardId\":1}"
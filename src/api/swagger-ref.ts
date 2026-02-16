/**
 * Справочник API по Swagger (safeddara-api/docs/swagger.yaml)
 * basePath: /api/v1
 * host: safed-api.oci.tj | api.safeddara.tj
 */

// ============ CARDS ============
// POST /cards/add — AddCard
//   Body: entities.Card { pan (required), cvv, expMonth, expYear, holder }
//   Response: { success, message, data: { userCard: { cardId, cardMasked, exp, cardBrand } } }
//   Security: X-Session-ID

// GET /cards/all — GetAllCards
//   Response: { success, message, data: { userCards: [{ cardId, cardMasked, exp, cardBrand }] } }
//   Security: X-Session-ID

// ============ CATEGORIES ============
// GET /categories/products/all — GetAllCategoriesWithProducts
//   Security: X-Session-ID

// ============ ORDERS ============
// POST /orders/products/create — CreateOrder
//   Body: entities.Order { cardId, categoryId, startDate, endDate, products }
//   Security: X-Session-ID

// GET /orders/{id}/barcode — GetBarcodeByOrderId
//   Returns: image/png
//   Security: X-Session-ID

// ============ PAYMENTS ============
// GET /payments/all — GetAllPayments
//   Response: { userPayments: UserPayment[] }
//   Security: X-Session-ID

// ============ USERS ============
// POST /users/register — Register
// POST /users/login — Login
// GET /users/refresh — RefreshSession (X-Session-ID)
// POST /users/send/sms-code — SendSMSCode
// POST /users/send/email — SendEmail
// POST /users/verify/sms-code — VerifySMSCode
// POST /users/verify/email — VerifyEmail
// GET /users/verify/device-token — VerifyDeviceToken

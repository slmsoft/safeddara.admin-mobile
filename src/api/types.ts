// TypeScript types — строго по Swagger (safeddara-api/docs/swagger.yaml)

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}

// entities.Card — Swagger required: pan (api.safeddara.tj)
export interface Card {
  pan: string; // Номер карты 16 цифр (required)
  pun?: string; // deprecated, use pan
  cvv?: string;
  expMonth?: string;
  expYear?: string;
  holder?: string;
}

export interface OrderProduct {
  productId: number;
  quantity: number;
}

export interface Order {
  cardId: number;
  categoryId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  products: OrderProduct[];
}

export interface UserRegistration {
  callingCode: string;
  deviceToken: string;
  deviceType: string;
  email: string;
  emailCode: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  smsCode: string;
}

export interface UserLogin {
  deviceToken: string;
  password: string;
}

export interface UserEmail {
  callingCode: string;
  deviceToken: string;
  email: string;
  phoneNumber: string;
  smsCode: string;
}

export interface UserEmailVerification {
  callingCode: string;
  deviceToken: string;
  email: string;
  emailCode: string;
  phoneNumber: string;
  smsCode: string;
}

export interface UserSMSVerification {
  callingCode?: string;
  deviceToken?: string;
  phoneNumber?: string;
  smsCode?: string;
}

export interface SendSMSCodeRequest {
  callingCode: string;
  deviceToken: string;
  phoneNumber: string;
}

// GET /payments/all response (from backend entities.UserPayment)
export interface UserPayment {
  date: string;
  orderTypeCode?: string;
  orderType?: string;
  orderId: string;
  totalPrice: number;
  status: 'payment_pending' | 'payment_paid' | 'payment_failed';
  orderURL?: string;
}

// API Response types
export type CardsResponse = ApiResponse<{ userCards: any[] }>;
export type CategoriesResponse = ApiResponse<{ categories: any[] }>;
export type OrderResponse = ApiResponse<null>;
export type PaymentsResponse = ApiResponse<{ userPayments: UserPayment[] }>;

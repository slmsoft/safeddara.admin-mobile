/**
 * Backend API client (2api.safeddara.tj)
 * Accommodations, bookings, payments
 */

import { getSessionId } from './auth';
import { adminAuthFetch } from './adminAuth';

const BACKEND_API_BASE =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_API_URL
    ? import.meta.env.VITE_BACKEND_API_URL
    : 'https://2api.safeddara.tj';

async function backendFetch<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<{ success: boolean; data?: T; message?: string }> {
  const url = `${BACKEND_API_BASE}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const sessionId = getSessionId();
    if (!sessionId) {
      throw new Error('Требуется авторизация');
    }
    headers['X-Session-ID'] = sessionId;
  }

  const res = await fetch(url, { ...options, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Сессия истекла или недействительна. Войдите в аккаунт снова.');
    }
    // Логируем при 400/500 для отладки POST /bookings
    if (res.status >= 400 && options.method === 'POST' && path === '/bookings') {
      try {
        const body = options.body ? JSON.parse(options.body as string) : null;
        console.error('[Backend API] POST /bookings failed', {
          status: res.status,
          requestBody: body,
          response: json,
        });
      } catch (_) {}
    }
    // Извлекаем сообщение об ошибке из разных форматов ответа
    const errMsg =
      json?.message ||
      json?.error ||
      (Array.isArray(json?.errors) && json.errors[0]?.message) ||
      (Array.isArray(json?.errors) && json.errors[0]) ||
      json?.details ||
      `Ошибка сервера (${res.status})`;
    throw new Error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
  }

  return json;
}

export interface Accommodation {
  id: string;
  type: string;
  title: string;
  description?: string;
  capacity: number;
  pricePerNight: number;
  area?: number;
  beds?: number;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
}

export interface CreateBookingBody {
  accommodationId: string;
  checkIn: string; // ISO date
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  cardId: number;
}

export interface CreateBookingResponse {
  booking: { id: string; [key: string]: unknown };
  orderURL?: string;
}

export const backendApi = {
  async getAccommodations(type?: string) {
    const q = type && type !== 'all' ? `?type=${encodeURIComponent(type)}` : '';
    return backendFetch<{ accommodations: Accommodation[]; total: number }>(
      `/accommodations${q}`,
      { method: 'GET' },
      false
    );
  },

  async getAccommodation(id: string) {
    return backendFetch<{ accommodation: Accommodation }>(
      `/accommodations/${id}`,
      { method: 'GET' },
      false
    );
  },

  async checkAvailability(accommodationId: string, checkIn: string, checkOut: string) {
    const params = new URLSearchParams({ checkIn, checkOut });
    return backendFetch<{ available: boolean }>(
      `/accommodations/${accommodationId}/availability?${params}`,
      { method: 'GET' },
      false
    );
  },

  async getBlockedDates(accommodationId: string, from?: string, to?: string) {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const q = params.toString() ? `?${params}` : '';
    return backendFetch<{ blockedDates: Array<{ id: string; startDate: string; endDate: string; reason?: string }> }>(
      `/accommodations/${accommodationId}/blocked-dates${q}`,
      { method: 'GET' },
      false
    );
  },

  async createBooking(body: CreateBookingBody) {
    return backendFetch<CreateBookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async getBookings() {
    return backendFetch<{ bookings: unknown[] }>('/bookings', { method: 'GET' });
  },

  /** GET /payments/all — платежи бронирований отеля (аналог Safeddara api /payments/all) */
  async getAllPayments() {
    return backendFetch<{ userPayments: Array<{ orderId?: string; orderURL?: string; orderUrl?: string; status?: string }> }>(
      '/payments/all',
      { method: 'GET' }
    );
  },

  async getBooking(id: string) {
    return backendFetch<{ booking: unknown }>(`/bookings/${id}`, { method: 'GET' });
  },

  async getNews(limit = 50, offset = 0) {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return backendFetch<{ news: NewsItem[]; total: number }>(
      `/news?${params}`,
      { method: 'GET' },
      false
    );
  },

  async getNewsItem(id: string) {
    return backendFetch<{ news: NewsItem }>(
      `/news/${id}`,
      { method: 'GET' },
      false
    );
  },

  async getRestaurantCategories() {
    return backendFetch<{ categories: RestaurantCategory[] }>(
      '/restaurants/categories',
      { method: 'GET' },
      false
    );
  },
};

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  category: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt?: string;
}

export interface RestaurantCategory {
  id: number;
  title: string;
  order: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    image?: string | null;
    isAvailable: boolean;
  }>;
}

/** Admin API — JWT auth via adminAuthFetch */
function adminFetch<T>(path: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string }> {
  return adminAuthFetch<T>(path, options);
}

export const adminApi = {
  accommodations: {
    list: () => adminFetch<{ accommodations: Accommodation[] }>('/accommodations'),
    create: (body: Partial<Accommodation> & { type?: string; title: string; capacity: number; pricePerNight: number }) =>
      adminFetch<{ accommodation: Accommodation }>('/accommodations', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Accommodation>) =>
      adminFetch<{ accommodation: Accommodation }>(`/accommodations/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch(`/accommodations/${id}`, { method: 'DELETE' }),
    blockedDates: {
      list: (id: string) => adminFetch<{ blockedDates: Array<{ id: string; startDate: string; endDate: string; reason?: string }> }>(`/accommodations/${id}/blocked-dates`),
      create: (id: string, body: { startDate: string; endDate: string; reason?: string }) =>
        adminFetch<{ blockedDate: { id: string; startDate: string; endDate: string; reason?: string } }>(`/accommodations/${id}/blocked-dates`, { method: 'POST', body: JSON.stringify(body) }),
      delete: (blockedDateId: string) => adminFetch(`/blocked-dates/${blockedDateId}`, { method: 'DELETE' }),
    },
  },
  news: {
    list: () => adminFetch<{ news: Array<{ id: string; title: string; content: string; image?: string; category: string; isPublished: boolean; publishedAt?: string }> }>('/news'),
    create: (body: { title: string; content?: string; image?: string; category?: string; isPublished?: boolean }) =>
      adminFetch<{ news: unknown }>('/news', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<{ title: string; content: string; image: string; category: string; isPublished: boolean }>) =>
      adminFetch<{ news: unknown }>(`/news/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch(`/news/${id}`, { method: 'DELETE' }),
  },
  restaurants: {
    categories: () => adminFetch<{ categories: Array<{ id: number; title: string; order: number; items: Array<{ id: string; name: string; price: number; image?: string; isAvailable: boolean }> }> }>('/restaurants/categories'),
    createCategory: (body: { title: string; order?: number }) =>
      adminFetch<{ category: unknown }>('/restaurants/categories', { method: 'POST', body: JSON.stringify(body) }),
    updateCategory: (id: number, body: { title?: string; order?: number }) =>
      adminFetch<{ category: unknown }>(`/restaurants/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteCategory: (id: number) => adminFetch(`/restaurants/categories/${id}`, { method: 'DELETE' }),
    createItem: (body: { categoryId: number; name: string; price: number; image?: string; isAvailable?: boolean }) =>
      adminFetch<{ item: unknown }>('/restaurants/items', { method: 'POST', body: JSON.stringify(body) }),
    updateItem: (id: string, body: Partial<{ categoryId: number; name: string; price: number; image: string; isAvailable: boolean }>) =>
      adminFetch<{ item: unknown }>(`/restaurants/items/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteItem: (id: string) => adminFetch(`/restaurants/items/${id}`, { method: 'DELETE' }),
  },
  bookings: {
    list: () => adminFetch<{ bookings: Array<{ id: string; guestName: string; guestEmail: string; accommodation: { id?: string; title: string }; checkIn: string; checkOut: string; guests: number; totalPrice: number; status: string }> }>('/bookings'),
    create: (body: { accommodationId: string; checkIn: string; checkOut: string; guests: number; guestName: string; guestEmail: string }) =>
      adminFetch<{ booking: unknown }>('/bookings', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: { status?: string }) =>
      adminFetch<{ booking: unknown }>(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  },
  payments: {
    list: () => adminFetch<{ payments: unknown[] }>('/payments'),
  },
  safeddara: {
    users: () => adminFetch<{ users: Array<{ id: string; firstName: string; lastName: string; phone: string; email: string; createdAt: string }> }>('/safeddara/users'),
    orders: () => adminFetch<{ orders: Array<{ id: string; userId: string; customerName: string; customerEmail: string; orderType: string; status: string; startDate: string; endDate: string; externalId: string | null; createdAt: string }> }>('/safeddara/orders'),
    payments: () => adminFetch<{ payments: Array<{ id: number; userId: string; orderId: string; totalAmount: number; status: string; orderUrl: string | null; createdAt: string }> }>('/safeddara/payments'),
  },
  admins: {
    list: () => adminFetch<{ admins: Array<{ id: string; email: string; role: string; createdAt: string }> }>('/admins'),
    create: (body: { email: string; password: string; role: 'admin' | 'accountant' }) =>
      adminFetch<{ admin: { id: string; email: string; role: string; createdAt: string } }>('/admins', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: { email?: string; password?: string }) =>
      adminFetch<{ admin: { id: string; email: string; role: string; createdAt: string } }>(`/admins/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => adminFetch(`/admins/${id}`, { method: 'DELETE' }),
  },
  stats: () =>
    adminFetch<{
      pageviews: number;
      monthlyUsers: number;
      newSignups: number;
      bookingsCount: number;
      totalRevenue: number;
      recentActivity: Array<{ type: string; user: string; action: string; time: string }>;
      revenueData?: Array<{ month: string; revenue: number }>;
    }>('/stats'),
};

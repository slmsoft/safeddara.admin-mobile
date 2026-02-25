/**
 * Admin JWT storage and auth fetch
 */

const ADMIN_JWT_KEY = 'admin_jwt';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_JWT_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_JWT_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_JWT_KEY);
}

const BACKEND_API_BASE =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_API_URL
    ? import.meta.env.VITE_BACKEND_API_URL
    : 'https://2api.safeddara.tj';

export async function adminAuthFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Требуется авторизация');
  }

  const url = `${BACKEND_API_BASE}/admin${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers as Record<string, string>),
    },
  });

  const json = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearAdminToken();
    throw new Error('Сессия истекла. Войдите снова.');
  }

  if (!res.ok) {
    throw new Error(json?.message || `HTTP ${res.status}`);
  }

  return json;
}

export interface AdminLoginResponse {
  token: string;
  admin: { id: string; email: string; role: string };
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; data?: AdminLoginResponse; message?: string }> {
  const url = `${BACKEND_API_BASE}/admin/auth/login`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, message: json?.message || 'Ошибка входа' };
  }
  return json;
}

export async function adminMe(): Promise<{
  success: boolean;
  data?: { admin: { id: string; email: string; role: string } };
  message?: string;
}> {
  return adminAuthFetch<{ admin: { id: string; email: string; role: string } }>('/auth/me');
}

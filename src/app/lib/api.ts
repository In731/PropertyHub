const BASE = (import.meta as any).env?.VITE_API_URL || `http://localhost:5000`;

const TOKEN_KEY = "ph_auth_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  updateProfile: (name: string, email: string) =>
    request<AuthResponse>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ success: boolean }>("/auth/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ─── Properties ───────────────────────────────────────────────────────────────

export interface ApiProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: string;
  image: string;
  images: string[];
  description: string;
  amenities: string[];
  yearBuilt?: number;
  parking?: number;
  furnished?: boolean;
  reraNumber?: string;
  userId?: string;
  userName?: string;
}

export const propertiesApi = {
  list: () => request<ApiProperty[]>("/properties"),

  create: (data: Omit<ApiProperty, "id" | "userId" | "userName">) =>
    request<ApiProperty>("/properties", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export interface ApiReview {
  id: string;
  property_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const reviewsApi = {
  list: (propertyId: string) => request<ApiReview[]>(`/properties/${propertyId}/reviews`),

  create: (propertyId: string, rating: number, comment: string) =>
    request<ApiReview>(`/properties/${propertyId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    }),
};

export const setupDB = () =>
  fetch(`${BASE}/setup`, {
    method: "POST",
  }).catch(() => null);

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

  forgotPassword: (email: string) => 
    request<{ success: boolean; message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    request<{ success: boolean; message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
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
  lat?: number;
  lng?: number;
}

export interface PaginatedProperties {
  data: ApiProperty[];
  total: number;
  page: number;
  totalPages: number;
}

export const propertiesApi = {
  list: (filters: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    
    const apiFilters: Record<string, any> = { ...filters };
    if (apiFilters.propertyType) {
      apiFilters.type = apiFilters.propertyType;
      delete apiFilters.propertyType;
    }
    if (apiFilters.location) {
      apiFilters.city = apiFilters.location;
      delete apiFilters.location;
    }

    Object.entries(apiFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const qs = params.toString();
    const url = qs ? `/properties?${qs}` : "/properties";
    return request<PaginatedProperties>(url);
  },

  get: (id: string) => request<ApiProperty>(`/properties/${id}`),

  create: (data: Omit<ApiProperty, "id" | "userId" | "userName">) =>
    request<ApiProperty>("/properties", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Omit<ApiProperty, "id" | "userId" | "userName">) =>
    request<ApiProperty>(`/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/properties/${id}`, {
      method: "DELETE",
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

  update: (propertyId: string, reviewId: string, rating: number, comment: string) =>
    request<ApiReview>(`/properties/${propertyId}/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify({ rating, comment }),
    }),

  delete: (propertyId: string, reviewId: string) =>
    request<{ success: boolean }>(`/properties/${propertyId}/reviews/${reviewId}`, {
      method: "DELETE",
    }),
};

// ─── Favorites ────────────────────────────────────────────────────────────────

export const favoritesApi = {
  list: () => request<ApiProperty[]>("/favorites"),

  add: (propertyId: string) =>
    request<{ success: boolean }>(`/favorites/${propertyId}`, { method: "POST" }),

  remove: (propertyId: string) =>
    request<{ success: boolean }>(`/favorites/${propertyId}`, { method: "DELETE" }),
};

// ─── News ─────────────────────────────────────────────────────────────────────

export interface ApiNewsArticle {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: any;
  categories: string[];
}

export const newsApi = {
  fetchLatest: async (): Promise<ApiNewsArticle[]> => {
    const rssUrl = encodeURIComponent("https://news.google.com/rss/search?q=real+estate+India");
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();
    return data.items || [];
  }
};

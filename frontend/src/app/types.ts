export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq ft
  type: 'apartment' | 'house' | 'villa' | 'studio' | 'commercial' | 'plot';
  status: 'for-sale' | 'for-rent';
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

export interface SearchFilters {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  status?: 'for-sale' | 'for-rent';
}

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { propertiesApi, ApiProperty } from "../lib/api";
import { Property } from "../types";

interface PropertiesContextType {
  properties: Property[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  refresh: (filters?: Record<string, any>, page?: number) => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

function apiToProperty(p: ApiProperty): Property {
  return {
    id:          p.id,
    title:       p.title,
    price:       p.price,
    location:    p.location,
    city:        p.city,
    bedrooms:    p.bedrooms,
    bathrooms:   p.bathrooms,
    area:        p.area,
    type:        p.type as Property["type"],
    status:      p.status as Property["status"],
    image:       p.image,
    images:      p.images,
    description: p.description,
    amenities:   p.amenities,
    yearBuilt:   p.yearBuilt,
    parking:     p.parking,
    furnished:   p.furnished,
    reraNumber:  p.reraNumber,
    userId:      p.userId,
    userName:    p.userName,
  };
}

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUserProperties = useCallback(async (filters: Record<string, any> = {}, targetPage: number = 1) => {
    setLoading(true);
    try {
      const { data, total, page, totalPages } = await propertiesApi.list({ ...filters, page: targetPage });
      setUserProperties(data.map(apiToProperty));
      setTotal(total);
      setPage(page);
      setTotalPages(totalPages);
    } catch (e) {
      console.error("Failed to fetch properties:", e);
      setUserProperties([]);
      setTotal(0);
      setPage(1);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProperties();
  }, [fetchUserProperties]);

  const properties = userProperties;

  return (
    <PropertiesContext.Provider value={{ properties, loading, total, page, totalPages, refresh: fetchUserProperties }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const ctx = useContext(PropertiesContext);
  if (!ctx) throw new Error("useProperties must be used inside PropertiesProvider");
  return ctx;
}

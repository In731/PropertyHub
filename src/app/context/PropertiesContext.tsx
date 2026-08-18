import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { propertiesApi, ApiProperty, setupDB } from "../lib/api";
import { Property } from "../types";

interface PropertiesContextType {
  properties: Property[];
  loading: boolean;
  refresh: () => Promise<void>;
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
  };
}

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProperties = useCallback(async () => {
    try {
      const data = await propertiesApi.list();
      setUserProperties(data.map(apiToProperty));
    } catch (e) {
      console.error("Failed to fetch properties:", e);
      setUserProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setupDB();
    fetchUserProperties();
  }, [fetchUserProperties]);

  const properties = userProperties;

  return (
    <PropertiesContext.Provider value={{ properties, loading, refresh: fetchUserProperties }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const ctx = useContext(PropertiesContext);
  if (!ctx) throw new Error("useProperties must be used inside PropertiesProvider");
  return ctx;
}

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Run DDL tables initialization automatically
const initTables = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS ph_users (
      id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      name          TEXT        NOT NULL,
      email         TEXT        UNIQUE NOT NULL,
      password_hash TEXT        NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS ph_properties (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      title       TEXT        NOT NULL,
      price       BIGINT      NOT NULL,
      location    TEXT        NOT NULL,
      city        TEXT        NOT NULL,
      bedrooms    INTEGER     DEFAULT 0,
      bathrooms   INTEGER     DEFAULT 0,
      area        NUMERIC     NOT NULL,
      type        TEXT        NOT NULL,
      status      TEXT        NOT NULL,
      image       TEXT        NOT NULL,
      images      JSONB       DEFAULT '[]',
      description TEXT,
      amenities   JSONB       DEFAULT '[]',
      year_built  INTEGER,
      parking     INTEGER     DEFAULT 0,
      furnished   BOOLEAN     DEFAULT FALSE,
      rera_number TEXT,
      user_id     UUID,
      user_name   TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS ph_reviews (
      id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      property_id   UUID        NOT NULL,
      user_id       UUID        NOT NULL,
      user_name     TEXT        NOT NULL,
      rating        INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment       TEXT        NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  try {
    await pool.query(createTablesQuery);
    console.log("Database tables verified/created successfully.");
    await seedProperties();
  } catch (error) {
    console.error("Database table initialization failed:", error);
  }
};

const seedProperties = async () => {
  try {
    const res = await pool.query("SELECT COUNT(*) FROM ph_properties");
    const count = parseInt(res.rows[0].count, 10);
    if (count > 0) {
      console.log("Properties table already seeded.");
      return;
    }

    console.log("Seeding properties table...");
    const sampleProperties = [
      {
        title: 'Modern 3BHK Apartment in Downtown',
        price: 450000,
        location: 'Downtown District',
        city: 'Mumbai',
        bedrooms: 3,
        bathrooms: 2,
        area: 1250,
        type: 'apartment',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1559329146-807aff9ff1fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzM0Mjk5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1559329146-807aff9ff1fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzM0Mjk5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MzgwODQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzczODIwNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYXN0ZXIlMjBiZWRyb29tJTIwc3VpdGV8ZW58MXx8fHwxNzczODQ1MDUzfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Beautiful modern apartment with stunning city views, premium fittings, and excellent connectivity to major business hubs.',
        amenities: JSON.stringify(['Gym', 'Swimming Pool', 'Parking', 'Security', 'Power Backup']),
        year_built: 2022,
        parking: 2,
        furnished: true,
        rera_number: 'P51900047457'
      },
      {
        title: 'Luxury Villa with Private Garden',
        price: 1250000,
        location: 'Bandra West',
        city: 'Mumbai',
        bedrooms: 5,
        bathrooms: 4,
        area: 3500,
        type: 'villa',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1628744448839-170bf324f27e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGZyb250JTIwdmlld3xlbnwxfHx8fDE3NzM0MzA3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1628744448839-170bf324f27e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGZyb250JTIwdmlld3xlbnwxfHx8fDE3NzM0MzA3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Spacious luxury villa featuring a private garden, modern architecture, and premium amenities in a prime location.',
        amenities: JSON.stringify(['Garden', 'Private Pool', 'Garage', 'Home Theater', 'Smart Home']),
        year_built: 2021,
        parking: 3,
        furnished: true,
        rera_number: 'P51900012345'
      },
      {
        title: 'Contemporary 2BHK for Rent',
        price: 35000,
        location: 'Koramangala',
        city: 'Bangalore',
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        type: 'apartment',
        status: 'for-rent',
        image: 'https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjB2aWxsYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzM0Mjc2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjB2aWxsYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzM0Mjc2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Well-maintained apartment in the heart of Koramangala, close to IT parks and entertainment hubs.',
        amenities: JSON.stringify(['Gym', 'Lift', 'Security', 'Power Backup', 'Parking']),
        year_built: 2020,
        parking: 1,
        furnished: true,
        rera_number: 'P52100023456'
      },
      {
        title: 'Cozy Studio Apartment',
        price: 18000,
        location: 'Indiranagar',
        city: 'Bangalore',
        bedrooms: 1,
        bathrooms: 1,
        area: 550,
        type: 'studio',
        status: 'for-rent',
        image: 'https://images.unsplash.com/photo-1772476361208-27d580dd3328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzczMzkwNjAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1772476361208-27d580dd3328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzczMzkwNjAzfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Perfect studio apartment for singles or young professionals. Fully furnished with modern amenities.',
        amenities: JSON.stringify(['Furnished', 'WiFi', 'Security', 'Parking']),
        year_built: 2023,
        parking: 1,
        furnished: true,
        rera_number: null
      },
      {
        title: 'Spacious 4BHK Family House',
        price: 850000,
        location: 'Whitefield',
        city: 'Bangalore',
        bedrooms: 4,
        bathrooms: 3,
        area: 2400,
        type: 'house',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1736007917095-88dd6bc641e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGFwYXJ0bWVudCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MzQzMDczNXww&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1736007917095-88dd6bc641e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGFwYXJ0bWVudCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MzQzMDczNXww&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Large family home with spacious rooms, modern kitchen, and beautiful backyard. Perfect for families.',
        amenities: JSON.stringify(['Garden', 'Parking', 'Security', 'Play Area', 'Pet Friendly']),
        year_built: 2019,
        parking: 2,
        furnished: false,
        rera_number: null
      },
      {
        title: 'Suburban 3BHK Independent House',
        price: 65000,
        location: 'Powai',
        city: 'Mumbai',
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        type: 'house',
        status: 'for-rent',
        image: 'https://images.unsplash.com/photo-1765765234094-bc009a3bba62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMGZhbWlseSUyMGhvbWV8ZW58MXx8fHwxNzczNDEzNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1765765234094-bc009a3bba62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMGZhbWlseSUyMGhvbWV8ZW58MXx8fHwxNzczNDEzNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Beautiful independent house in a quiet suburban area, ideal for families looking for peaceful living.',
        amenities: JSON.stringify(['Garden', 'Parking', 'Security', 'Terrace', 'Store Room']),
        year_built: 2018,
        parking: 2,
        furnished: false,
        rera_number: null
      },
      {
        title: 'Beachfront Luxury Villa',
        price: 2500000,
        location: 'Juhu Beach',
        city: 'Mumbai',
        bedrooms: 6,
        bathrooms: 5,
        area: 4500,
        type: 'villa',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1707075108813-edefd7b3308d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaGZyb250JTIwdmlsbGElMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NzM0MzA3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1707075108813-edefd7b3308d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaGZyb250JTIwdmlsbGElMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NzM0MzA3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Stunning beachfront villa with panoramic ocean views, private beach access, and world-class amenities.',
        amenities: JSON.stringify(['Beach Access', 'Pool', 'Gym', 'Spa', 'Cinema', 'Wine Cellar']),
        year_built: 2023,
        parking: 4,
        furnished: true,
        rera_number: 'P51900056789'
      },
      {
        title: 'Premium Penthouse with City Views',
        price: 95000,
        location: 'Cyber City',
        city: 'Gurgaon',
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        type: 'apartment',
        status: 'for-rent',
        image: 'https://images.unsplash.com/photo-1577214582508-fdde28e64474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwcGVudGhvdXNlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzczNDMwNzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1577214582508-fdde28e64474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwcGVudGhvdXNlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzczNDMwNzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzM4NDUwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MzgwODQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzczODIwNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Luxurious penthouse with breathtaking city views, modern interiors, and top-notch facilities.',
        amenities: JSON.stringify(['Terrace', 'Gym', 'Pool', 'Concierge', 'Valet Parking', 'Club House']),
        year_built: 2022,
        parking: 3,
        furnished: true,
        rera_number: 'P52200034567'
      },
      {
        title: 'Elegant 3BHK in Connaught Place',
        price: 750000,
        location: 'Connaught Place',
        city: 'Delhi',
        bedrooms: 3,
        bathrooms: 2,
        area: 1650,
        type: 'apartment',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1688306141976-0a8ef8c3f585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxoaSUyMGx1eHVyeSUyMGFwYXJ0bWVudCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3Mzg0NTA2MXww&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1688306141976-0a8ef8c3f585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxoaSUyMGx1eHVyeSUyMGFwYXJ0bWVudCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3Mzg0NTA2MXww&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MzgwODQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYXN0ZXIlMjBiZWRyb29tJTIwc3VpdGV8ZW58MXx8fHwxNzczODQ1MDUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzczODIwNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Prime location apartment in the heart of Delhi with modern amenities and excellent connectivity.',
        amenities: JSON.stringify(['Gym', 'Swimming Pool', 'Club House', 'Security', 'Power Backup', 'Lift']),
        year_built: 2021,
        parking: 2,
        furnished: true,
        rera_number: 'P52300045678'
      },
      {
        title: 'Modern Townhouse in Pune',
        price: 42000,
        location: 'Hinjewadi',
        city: 'Pune',
        bedrooms: 3,
        bathrooms: 2,
        area: 1400,
        type: 'house',
        status: 'for-rent',
        image: 'https://images.unsplash.com/photo-1667828369152-ddb46c1beebf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjB0b3duaG91c2UlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzM4NDUwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1667828369152-ddb46c1beebf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjB0b3duaG91c2UlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzM4NDUwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MzgwODQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzczODIwNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Contemporary townhouse near IT parks with spacious rooms and modern design.',
        amenities: JSON.stringify(['Garden', 'Parking', 'Security', 'Power Backup', 'Pet Friendly']),
        year_built: 2020,
        parking: 2,
        furnished: false,
        rera_number: null
      },
      {
        title: 'Luxury Villa in Koregaon Park',
        price: 1450000,
        location: 'Koregaon Park',
        city: 'Pune',
        bedrooms: 5,
        bathrooms: 4,
        area: 3800,
        type: 'villa',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1708173737538-a63303c8d0a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdW5lJTIwcmVzaWRlbnRpYWwlMjB2aWxsYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzM4NDUwNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1708173737538-a63303c8d0a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdW5lJTIwcmVzaWRlbnRpYWwlMjB2aWxsYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzM4NDUwNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MzgwODQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYXN0ZXIlMjBiZWRyb29tJTIwc3VpdGV8ZW58MXx8fHwxNzczODQ1MDUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzczODIwNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Exquisite villa in prime Pune location with luxury finishes, large garden, and premium amenities.',
        amenities: JSON.stringify(['Private Pool', 'Garden', 'Gym', 'Home Theater', 'Smart Home', 'Security']),
        year_built: 2023,
        parking: 4,
        furnished: true,
        rera_number: 'P52400067890'
      },
      {
        title: 'High-Rise 2BHK in Banjara Hills',
        price: 48000,
        location: 'Banjara Hills',
        city: 'Hyderabad',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        type: 'apartment',
        status: 'for-rent',
        image: 'https://images.unsplash.com/photo-1650289487939-2b9fa8a2d8a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRlcmFiYWQlMjBtb2Rlcm4lMjByZXNpZGVudGlhbCUyMHRvd2VyfGVufDF8fHx8MTc3Mzg0NTA2OXww&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1650289487939-2b9fa8a2d8a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRlcmFiYWQlMjBtb2Rlcm4lMjByZXNpZGVudGlhbCUyMHRvd2VyfGVufDF8fHx8MTc3Mzg0NTA2OXww&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzM4NDUwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzczODIwNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Premium apartment in upscale Banjara Hills with stunning views and world-class amenities.',
        amenities: JSON.stringify(['Gym', 'Pool', 'Club House', 'Security', 'Lift', 'Power Backup']),
        year_built: 2022,
        parking: 1,
        furnished: true,
        rera_number: 'P52500078901'
      },
      {
        title: 'Spacious 4BHK Villa in Gachibowli',
        price: 980000,
        location: 'Gachibowli',
        city: 'Hyderabad',
        bedrooms: 4,
        bathrooms: 3,
        area: 2600,
        type: 'villa',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1628744448839-170bf324f27e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGZyb250JTIwdmlld3xlbnwxfHx8fDE3NzM0MzA3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1628744448839-170bf324f27e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGZyb250JTIwdmlld3xlbnwxfHx8fDE3NzM0MzA3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MzgwODQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYXN0ZXIlMjBiZWRyb29tJTIwc3VpdGV8ZW58MXx8fHwxNzczODQ1MDUzfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Elegant villa near IT corridor with modern architecture, spacious layout, and premium fittings.',
        amenities: JSON.stringify(['Garden', 'Parking', 'Security', 'Club House', 'Play Area', 'Gym']),
        year_built: 2021,
        parking: 3,
        furnished: false,
        rera_number: 'P52500089012'
      },
      {
        title: 'Premium Commercial Office Space',
        price: 8500000,
        location: 'Bandra Kurla Complex',
        city: 'Mumbai',
        bedrooms: 0,
        bathrooms: 4,
        area: 5000,
        type: 'commercial',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1760246964044-1384f71665b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb21tZXJjaWFsJTIwb2ZmaWNlJTIwYnVpbGRpbmclMjBleHRlcmlvcnxlbnwxfHx8fDE3NzQ5MzE4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1760246964044-1384f71665b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb21tZXJjaWFsJTIwb2ZmaWNlJTIwYnVpbGRpbmclMjBleHRlcmlvcnxlbnwxfHx8fDE3NzQ5MzE4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Premium Grade-A commercial office space in the heart of BKC. Ideal for corporate headquarters with stunning city views, modern infrastructure, and excellent connectivity.',
        amenities: JSON.stringify(['Central AC', 'High-Speed Elevators', '24/7 Security', 'Reserved Parking', 'Cafeteria', 'Conference Rooms', 'Power Backup']),
        year_built: 2020,
        parking: 20,
        furnished: false,
        rera_number: 'C51900090123'
      },
      {
        title: 'Retail Shop in Prime Location',
        price: 75000,
        location: 'MG Road',
        city: 'Bangalore',
        bedrooms: 0,
        bathrooms: 2,
        area: 1200,
        type: 'commercial',
        status: 'for-rent',
        image: 'https://images.unsplash.com/photo-1770234849035-4cd18beb4202?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwcmV0YWlsJTIwc2hvcCUyMHNwYWNlfGVufDF8fHx8MTc3NDkzMTg2NHww&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1770234849035-4cd18beb4202?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwcmV0YWlsJTIwc2hvcCUyMHNwYWNlfGVufDF8fHx8MTc3NDkzMTg2NHww&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Prime retail space on busy MG Road with high foot traffic. Perfect for showrooms, boutiques, or flagship stores. Ground floor location with excellent visibility.',
        amenities: JSON.stringify(['Street Facing', 'Parking Available', 'Security', 'Power Backup', 'Washrooms']),
        year_built: 2019,
        parking: 5,
        furnished: false,
        rera_number: 'C52100101234'
      },
      {
        title: 'Modern Warehouse & Logistics Hub',
        price: 6500000,
        location: 'Bhiwandi',
        city: 'Mumbai',
        bedrooms: 0,
        bathrooms: 2,
        area: 15000,
        type: 'commercial',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1694885169342-909981fb408a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwd2FyZWhvdXNlJTIwYnVpbGRpbmcl||17749MzE4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1694885169342-909981fb408a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwd2FyZWhvdXNlJTIwYnVpbGRpbmcl||17749MzE4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Large warehouse facility ideal for logistics and storage. Features modern infrastructure, easy truck access, and proximity to major highways. Perfect for e-commerce and distribution businesses.',
        amenities: JSON.stringify(['Loading Docks', 'High Ceiling', 'Fire Safety Systems', 'Security', 'Office Space', 'Ample Parking']),
        year_built: 2021,
        parking: 30,
        furnished: false,
        rera_number: 'C51900112345'
      },
      {
        title: 'Residential Plot in Gated Community',
        price: 3500000,
        location: 'Sarjapur Road',
        city: 'Bangalore',
        bedrooms: 0,
        bathrooms: 0,
        area: 2400,
        type: 'plot',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1764222233275-87dc016c11dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHBsb3QlMjB2YWNhbnQlMjBsYW5kfGVufDF8fHx8MTc3NDkzMTg2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1764222233275-87dc016c11dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHBsb3QlMjB2YWNhbnQlMjBsYW5kfGVufDF8fHx8MTc3NDkzMTg2Nnww&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Premium residential plot in well-planned gated community. Clear title, approved layout plan, and ready for construction. Excellent location near IT corridor and schools.',
        amenities: JSON.stringify(['Gated Community', 'Underground Drainage', 'Street Lights', 'Park', 'Club House Access', 'Water Supply']),
        year_built: null,
        parking: 0,
        furnished: false,
        rera_number: null
      },
      {
        title: 'Agricultural Land with Farm House',
        price: 8500000,
        location: 'Lonavala',
        city: 'Pune',
        bedrooms: 0,
        bathrooms: 0,
        area: 43560,
        type: 'plot',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1772735470116-23f5c2fd0623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBmYXJtbGFuZCUyMHByb3BlcnR5fGVufDF8fHx8MTc3NDkzMTg2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1772735470116-23f5c2fd0623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBmYXJtbGFuZCUyMHByb3BlcnR5fGVufDF8fHx8MTc3NDkzMTg2Nnww&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Beautiful 1-acre agricultural land in scenic Lonavala. Features fertile soil, water source, and existing farm infrastructure. Ideal for weekend getaway or organic farming.',
        amenities: JSON.stringify(['Water Source', 'Electricity', 'Road Access', 'Scenic Views', 'Farm House Potential']),
        year_built: null,
        parking: 0,
        furnished: false,
        rera_number: null
      },
      {
        title: 'Commercial Plot on Highway',
        price: 12500000,
        location: 'Mumbai-Pune Highway',
        city: 'Mumbai',
        bedrooms: 0,
        bathrooms: 0,
        area: 5000,
        type: 'plot',
        status: 'for-sale',
        image: 'https://images.unsplash.com/photo-1765260906174-8974527cf134?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwbGFuZCUyMHByb3BlcnR5JTIwdGVycmFpbnxlbnwxfHx8fDE3NzQ5MzE4Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1765260906174-8974527cf134?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwbGFuZCUyMHByb3BlcnR5JTIwdGVycmFpbnxlbnwxfHx8fDE3NzQ5MzE4Njl8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ]),
        description: 'Strategic commercial plot on Mumbai-Pune highway with excellent visibility and high traffic. Perfect for hotels, resorts, restaurants, or commercial complexes. Clear title and all approvals.',
        amenities: JSON.stringify(['Highway Facing', 'High Visibility', 'Water Connection', 'Electricity Available', 'Easy Access']),
        year_built: null,
        parking: 0,
        furnished: false,
        rera_number: null
      }
    ];

    for (const p of sampleProperties) {
      await pool.query(
        `INSERT INTO ph_properties (
          title, price, location, city, bedrooms, bathrooms, area, type, status, image, images, description, amenities, year_built, parking, furnished, rera_number
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          p.title, p.price, p.location, p.city, p.bedrooms, p.bathrooms, p.area, p.type, p.status, p.image,
          p.images, p.description, p.amenities, p.year_built, p.parking, p.furnished, p.rera_number
        ]
      );
    }
    console.log("Successfully seeded database with dummy properties.");
  } catch (error) {
    console.error("Failed to seed properties table:", error);
  }
};

module.exports = {
  pool,
  initTables
};

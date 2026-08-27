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
      reset_token   TEXT,
      reset_token_expiry TIMESTAMPTZ,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS ph_properties (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      title       TEXT        NOT NULL,
      price       BIGINT      NOT NULL,
      location    TEXT        NOT NULL,
      city        TEXT        NOT NULL,
      lat         NUMERIC,
      lng         NUMERIC,
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
    CREATE TABLE IF NOT EXISTS ph_favorites (
      id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      property_id   UUID        NOT NULL,
      user_id       UUID        NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, property_id)
    );
  `;
  const alterTablesQuery = `
    ALTER TABLE ph_properties ADD COLUMN IF NOT EXISTS lat NUMERIC;
    ALTER TABLE ph_properties ADD COLUMN IF NOT EXISTS lng NUMERIC;
    ALTER TABLE ph_users ADD COLUMN IF NOT EXISTS reset_token TEXT;
    ALTER TABLE ph_users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMPTZ;

    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ph_reviews_property_id') THEN
            ALTER TABLE ph_reviews ADD CONSTRAINT fk_ph_reviews_property_id FOREIGN KEY (property_id) REFERENCES ph_properties(id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ph_reviews_user_id') THEN
            ALTER TABLE ph_reviews ADD CONSTRAINT fk_ph_reviews_user_id FOREIGN KEY (user_id) REFERENCES ph_users(id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ph_properties_user_id') THEN
            ALTER TABLE ph_properties ADD CONSTRAINT fk_ph_properties_user_id FOREIGN KEY (user_id) REFERENCES ph_users(id) ON DELETE SET NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ph_favorites_property_id') THEN
            ALTER TABLE ph_favorites ADD CONSTRAINT fk_ph_favorites_property_id FOREIGN KEY (property_id) REFERENCES ph_properties(id) ON DELETE CASCADE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ph_favorites_user_id') THEN
            ALTER TABLE ph_favorites ADD CONSTRAINT fk_ph_favorites_user_id FOREIGN KEY (user_id) REFERENCES ph_users(id) ON DELETE CASCADE;
        END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS idx_ph_properties_city ON ph_properties(city);
    CREATE INDEX IF NOT EXISTS idx_ph_properties_price ON ph_properties(price);
    CREATE INDEX IF NOT EXISTS idx_ph_properties_type ON ph_properties(type);
    CREATE INDEX IF NOT EXISTS idx_ph_properties_status ON ph_properties(status);
    CREATE INDEX IF NOT EXISTS idx_ph_properties_bedrooms ON ph_properties(bedrooms);
  `;
  try {
    await pool.query(createTablesQuery);
    await pool.query(alterTablesQuery);
    console.log("Database tables and constraints verified/created successfully.");
    await seedProperties();
  } catch (error) {
    console.error("Failed to initialize database tables:", error);
    throw error;
  }
};

const seedProperties = async () => {
  try {
    const countRes = await pool.query("SELECT COUNT(*) FROM ph_properties");
    if (parseInt(countRes.rows[0].count, 10) > 0) {
      return;
    }

    console.log("Empty database detected. Seeding dummy properties...");

    const dummyProperties = [
      {
        title: "Luxury 3BHK Apartment with Sea View",
        price: 25000000,
        location: "Bandra West, Mumbai",
        city: "Mumbai",
        bedrooms: 3,
        bathrooms: 3,
        area: 1650,
        type: "apartment",
        status: "for-sale",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1080",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1080",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1080",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1080"
        ]),
        description: "Experience ultra-modern coastal living in this premium 3 BHK apartment in Bandra West with panoramic Arabian Sea views and state-of-the-art home automation.",
        amenities: JSON.stringify(["Swimming Pool", "Gym", "Sea View", "Clubhouse", "24/7 Security", "Power Backup"]),
        year_built: 2022,
        parking: 2,
        furnished: true,
        rera_number: "P51800001234"
      },
      {
        title: "Modern 4BHK Independent Villa",
        price: 42000000,
        location: "Whitefield, Bangalore",
        city: "Bangalore",
        bedrooms: 4,
        bathrooms: 4,
        area: 3400,
        type: "villa",
        status: "for-sale",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1080",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1080",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080"
        ]),
        description: "Spacious independent villa featuring private garden, Italian marble flooring, and double-height living room near major IT hubs.",
        amenities: JSON.stringify(["Private Garden", "Gated Community", "Solar Panels", "Clubhouse", "Gym"]),
        year_built: 2023,
        parking: 2,
        furnished: false,
        rera_number: "PRM/KA/RERA/1251/446/PR/171015/000456"
      },
      {
        title: "Premium 2BHK Rental in Gated Society",
        price: 45000,
        location: "Koramangala, Bangalore",
        city: "Bangalore",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        type: "apartment",
        status: "for-rent",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1080",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1080",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1080"
        ]),
        description: "Fully furnished 2 BHK apartment ideal for tech professionals with close proximity to premier dining, cafes, and co-working hubs.",
        amenities: JSON.stringify(["Furnished", "High-speed Wi-Fi", "Lift", "Security", "Gym"]),
        year_built: 2021,
        parking: 1,
        furnished: true,
        rera_number: "PRM/KA/RERA/1251/310/PR/180516/001789"
      },
      {
        title: "Penthouse with Sky Deck & Private Pool",
        price: 85000000,
        location: "Golf Course Road, Gurgaon",
        city: "Delhi NCR",
        bedrooms: 5,
        bathrooms: 6,
        area: 5800,
        type: "penthouse",
        status: "for-sale",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1080",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1080",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1080"
        ]),
        description: "Palatial 5BHK penthouse on Golf Course Road offering bespoke designer interiors, private terrace pool, and panoramic skyline vistas.",
        amenities: JSON.stringify(["Private Pool", "Sky Deck", "Concierge Service", "Helipad Access", "Wine Cellar"]),
        year_built: 2023,
        parking: 4,
        furnished: true,
        rera_number: "GGM/382/114/2020/78"
      },
      {
        title: "Elegant 3BHK Apartment in Jubilee Hills",
        price: 18000000,
        location: "Jubilee Hills, Hyderabad",
        city: "Hyderabad",
        bedrooms: 3,
        bathrooms: 3,
        area: 2100,
        type: "apartment",
        status: "for-sale",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1080"
        ]),
        description: "Spacious luxury home situated in the heart of Jubilee Hills, featuring Vastu-compliant architecture and lush green surroundings.",
        amenities: JSON.stringify(["Vastu Compliant", "Clubhouse", "Gym", "Landscaped Gardens", "EV Charging"]),
        year_built: 2022,
        parking: 2,
        furnished: false,
        rera_number: "P02500003456"
      },
      {
        title: "Serene Riverside Studio Villa",
        price: 35000,
        location: "Kalyani Nagar, Pune",
        city: "Pune",
        bedrooms: 1,
        bathrooms: 1,
        area: 750,
        type: "villa",
        status: "for-rent",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080"
        ]),
        description: "Cozy riverside villa studio surrounded by lush greenery, perfect for work-from-home peace with quick city access.",
        amenities: JSON.stringify(["River View", "Balcony", "Wi-Fi", "Pet Friendly", "24/7 Security"]),
        year_built: 2020,
        parking: 1,
        furnished: true,
        rera_number: "P52100007890"
      }
    ];

    const CITY_COORDS = {
      "Mumbai": { lat: 19.0760, lng: 72.8777 },
      "Bangalore": { lat: 12.9716, lng: 77.5946 },
      "Delhi NCR": { lat: 28.4595, lng: 77.0266 },
      "Hyderabad": { lat: 17.3850, lng: 78.4867 },
      "Pune": { lat: 18.5204, lng: 73.8567 },
      "Chennai": { lat: 13.0827, lng: 80.2707 },
      "Kolkata": { lat: 22.5726, lng: 88.3639 },
      "Ahmedabad": { lat: 23.0225, lng: 72.5714 }
    };

    for (let i = 0; i < dummyProperties.length; i++) {
      const p = dummyProperties[i];
      const baseCoords = CITY_COORDS[p.city] || { lat: 19.0760, lng: 72.8777 };
      const lat = baseCoords.lat + (Math.random() - 0.5) * 0.08;
      const lng = baseCoords.lng + (Math.random() - 0.5) * 0.08;

      await pool.query(
        `INSERT INTO ph_properties (
          title, price, location, city, lat, lng, bedrooms, bathrooms, area, type, status, image, images, description, amenities, year_built, parking, furnished, rera_number
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          p.title, p.price, p.location, p.city, lat, lng, p.bedrooms, p.bathrooms, p.area, p.type, p.status, p.image,
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

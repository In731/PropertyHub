# PropertyHub 🏡

PropertyHub is a full-stack, premium real estate marketplace. It allows users to browse, filter, and search for properties via a highly interactive map interface, while also providing secure user authentication to manage personal listings and reviews.

🌍 **Live Demo:** [https://propertyhub-frontend-0yhu.onrender.com](https://propertyhub-frontend-0yhu.onrender.com)

---

## 🛠️ Tech Stack

### Frontend
* **React 18** via **Vite**
* **TypeScript** for robust typing
* **Tailwind CSS** + **Radix UI** for beautiful, accessible styling
* **Google Maps API** (`@react-google-maps/api`) for interactive property clustering
* **Lucide React** for crisp, scalable iconography
* **React Router** for seamless SPA navigation

### Backend
* **Node.js** & **Express**
* **PostgreSQL** (hosted via Neon) for reliable, relational data storage
* **JWT** & **bcrypt** for secure authentication and password hashing
* **Zod** for server-side validation

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Environment Setup
Copy the example environment file and fill in your actual credentials.

```bash
cp .env.example .env
```

Your `.env` file should look like this:
```ini
# Database configuration (Neon / PostgreSQL)
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend / API URLs
VITE_API_URL=http://localhost:5000
PORT=5000

# Third-party integrations
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Install Dependencies
Install the required packages for both the frontend and backend tools.

```bash
npm install
```

### 4. Database Setup & Seeding
The backend is configured to automatically initialize tables and seed dummy properties on its first successful run. Just ensure your `DATABASE_URL` is pointing to a valid PostgreSQL database.

### 5. Start the Development Servers

Start up the backend server on port 5000:
```bash
node backend/server.js
```

In a new terminal, start the Vite frontend:
```bash
npm run dev
```

Open your browser to `http://localhost:5173` to see the app running!

---

## 🔐 Core Features
- **Interactive Map Search:** Full-screen Google Maps integration with clustered property markers.
- **Server-Side Filtering:** Rapidly filter by city, price range, bedrooms, and property type with pagination.
- **User Authentication:** Secure signup/login with rate-limiting and JWT sessions.
- **Listing Management:** Create, edit, and delete your own property listings.
- **Reviews & Ratings:** Authenticated users can leave reviews and star ratings on any property.
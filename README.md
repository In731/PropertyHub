# PropertyHub 🏡

PropertyHub is a full-stack, premium real estate marketplace built as a modern **monorepo**. It allows users to browse, filter, and search for properties via an interactive map interface, calculate mortgage EMIs, estimate property valuations, and manage personal listings, reviews, and saved favorites.

🌍 **Live Demo:** [https://propertyhub-frontend-0yhu.onrender.com](https://propertyhub-frontend-0yhu.onrender.com)

---

## 🏗️ Architecture & Tech Stack

```text
/ (Monorepo Root)
├── frontend/             # Standalone React + Vite + TypeScript Web App
├── backend/              # Standalone Express.js + PostgreSQL API Service
├── package.json          # Root orchestration scripts
└── render.yaml           # Automated Cloud Deployment Blueprint (Render)
```

### Frontend (`frontend/`)
* **React 18** + **Vite** for fast HMR and compilation
* **TypeScript** for end-to-end type safety
* **Tailwind CSS v4** for modern, responsive dark/light styling
* **Google Maps API** for interactive location previews
* **Recharts** for interactive mortgage amortization schedules
* **Lucide React** for icons
* **React Router v7** for single-page app routing

### Backend (`backend/`)
* **Node.js** & **Express 5** (Modular MVC Architecture)
* **PostgreSQL (Neon)** for relational data persistence
* **JWT (JSON Web Tokens)** & **bcryptjs** for secure session authentication
* **Nodemailer** for email delivery and password reset flows
* **Rate Limiting & CORS** middleware protections

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Real Estate Website"
```

### 2. Install Dependencies
Install dependencies for both frontend and backend from the root directory:
```bash
npm run install:all
```

---

### 3. Environment Variables Configuration

#### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```ini
PORT=5000
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require
JWT_SECRET=your_super_secret_jwt_key_here

# SMTP Settings (e.g., Resend / SendGrid / Custom SMTP)
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=your_smtp_api_key_here
```

#### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:
```ini
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

### 4. Database Setup & Automated Seeding
The backend is configured to automatically initialize database tables and seed initial dummy properties on its first connection. Just ensure your `DATABASE_URL` is set in `backend/.env`.

---

### 5. Start Development Servers

You can run the development servers conveniently from the root directory:

**Start the Backend API Server:**
```bash
npm run dev:backend
```

**Start the Frontend Dev Server:** (in a separate terminal)
```bash
npm run dev:frontend
```

Open your browser to `http://localhost:5173` to explore the app!

---

## 🔐 Core Features

- **Interactive Map Search:** Google Maps integration with interactive click-to-preview cards.
- **Server-Side Filtering & Search:** Rapidly filter by city, price range, bedrooms, and property type with database pagination.
- **Direct Image Uploads:** Drag-and-drop unsigned multi-image uploader directly from the browser.
- **Financial Tools:**
  - **EMI Calculator:** Interactive loan calculator with real-time principal/interest amortization charts.
  - **Property Value Generator:** Instant property valuation estimate based on location, area, and age.
  - **Home Loan Services:** Comprehensive guide, eligibility checks, and loan comparisons.
- **Live Real Estate News:** Live RSS updates and market insights.
- **Database-Backed Favorites:** Persisted saved properties with authentication guards.
- **Production Authentication & Password Reset:** Secure signup/login with rate-limiting, JWT sessions, and email-based password recovery.
- **Listing Management:** Create, edit, and delete your own property listings.
- **Reviews & Ratings:** Authenticated users can leave reviews and star ratings on listings.
- **Dark Mode Support:** Smooth light/dark theme switching with persistent user preference.
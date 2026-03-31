# Fluid Architect — SaaS Management Suite

A production-style full-stack CRUD web application for inventory management, built with **React**, **Node.js/Express**, and **MySQL**.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![MySQL](https://img.shields.io/badge/MySQL-8-orange) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue)

## Features

- **JWT Authentication** — Login with email/password, access & refresh tokens
- **Role-Based Access** — Admin (full CRUD) and User (read-only) roles
- **Full CRUD** — Create, Read, Update, Delete products via REST API
- **Real-Time Search** — Debounced search bar with instant results
- **Server-Side Pagination** — Efficient large dataset handling
- **Dashboard Analytics** — Inventory value, stock alerts, category breakdown
- **Activity Feed** — Audit trail of all CRUD operations
- **Modern UI** — Material Design 3 inspired, TailwindCSS, glassmorphism effects
- **Responsive Design** — Works on desktop and tablet
- **Error Handling** — Toast notifications, form validation, loading states

## Project Structure

```
web-app-crud/
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth state management
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── utils/       # Helper functions
│   └── ...
├── backend/           # Node.js + Express REST API
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth, validation, error handling
│   │   ├── models/      # Database queries
│   │   └── routes/      # API endpoints
│   └── ...
├── database/          # SQL schema and seed data
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

## Setup Instructions

### Prerequisites

- **Node.js** 18+ — [Download](https://nodejs.org/)
- **MySQL** 8+ — [Download](https://dev.mysql.com/downloads/mysql/)
- **npm** (comes with Node.js)

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
cd web-app-crud

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Database Setup

1. **Open MySQL** (via MySQL Workbench, command line, or your preferred tool)

2. **Run the schema** to create the database and tables:
```bash
mysql -u root -p < database/schema.sql
```
Or copy/paste the contents of `database/schema.sql` into MySQL Workbench.

3. **Run the seed data** to populate sample records:
```bash
mysql -u root -p < database/seed.sql
```

> **Note:** The seed data creates two users. Since the passwords are bcrypt-hashed, you'll need to register fresh users via the API or use the registration feature. See *First Login* section below.

### Step 3: Environment Variables

The `.env` files are pre-configured. Review and update if needed:

**Backend** (`backend/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=ldpg1214
DB_NAME=crud_system_db
JWT_SECRET=fluid_architect_jwt_secret_key_2024_change_me
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Run the Application

**Terminal 1 — Start Backend:**
```bash
cd backend
npm run dev
```
You should see:
```
🚀 Fluid Architect API Server
   Port: 5000
   URL: http://localhost:5000
✅ MySQL connected successfully
```

**Terminal 2 — Start Frontend:**
```bash
cd frontend
npm run dev
```
You should see:
```
  VITE v5.x.x  ready in XXXms
  ➜  Local:   http://localhost:5173/
```

### Step 5: First Login

Since the seed passwords are pre-hashed, register a new admin user via the API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@test.com","password":"Admin123!","role":"admin"}'
```

Or from PowerShell:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/register" -ContentType "application/json" -Body '{"name":"Admin User","email":"admin@test.com","password":"Admin123!","role":"admin"}'
```

Then login at `http://localhost:5173/login` with:
- **Email:** admin@test.com
- **Password:** Admin123!

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email & password |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (paginated) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| GET | `/api/products/categories` | List categories |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Dashboard summary |

**Query Parameters for GET /api/products:**
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)
- `search` — Search by name or SKU
- `categoryId` — Filter by category ID
- `status` — Filter by: in_stock, low_stock, out_of_stock
- `sortBy` — Sort column: name, price, quantity, created_at
- `order` — Sort direction: asc, desc

## Test Credentials

After registering via the API:
- **Admin:** admin@test.com / Admin123!
- **User:** Create with role "user" for read-only access

## Tech Stack Details

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI library with hooks |
| Bundler | Vite 5 | Fast development server |
| Styling | TailwindCSS 3 | Utility-first CSS |
| Routing | React Router 6 | Client-side routing |
| HTTP | Axios | API communication |
| Backend | Express 4 | REST API framework |
| Database | MySQL 8 | Relational database |
| Auth | JWT | Stateless authentication |
| Hashing | bcryptjs | Password security |
| Validation | express-validator | Request validation |

## 📝 License

This project is for portfolio/educational purposes.

# 🍲 NeedNourish

**NeedNourish** is a full-stack platform designed to bridge the gap between food surplus and food scarcity. By connecting **Suppliers** (restaurants, bakeries, individuals) with **Needies** (NGOs, volunteers, people in need), we aim to reduce food waste and combat hunger using real-time geospatial data.

---

## 🚀 Key Features

### 🏢 For Suppliers (Donors)
- **Inventory Management**: Post surplus food with specific details like category, title, description, and expiry time.
- **Auto-Location Detection**: Automatically capture GPS coordinates using the browser's Geolocation API for accurate pick-up points.
- **Supplier Dashboard**: Track impact with real-time statistics on Total Posts, Active Listings, and Claimed Items.

### 🤝 For Needies (Receivers)
- **Spatial Discovery**: Explore available food listings within a **5km radius** of your current GPS location.
- **Instant Claim**: Secure available food items in one click before they expire.
- **Claim History**: Maintain a dedicated record of all successfully claimed food items and saved meals.

---

## 🛠️ Tech Stack

### Backend (Python/FastAPI)
- **Framework**: FastAPI (High performance, asynchronous support).
- **Database**: PostgreSQL with **PostGIS** extension for advanced geospatial queries.
- **ORM**: SQLAlchemy.
- **Security**: JWT (JSON Web Tokens) and Bcrypt for secure authentication and password hashing.

### Frontend (React)
- **Build Tool**: Vite.
- **Styling**: Tailwind CSS (v3).
- **Navigation**: React Router v7.
- **State Management**: React Context API (Auth Logic).
- **Icons**: Lucide React.

---

## 📂 Project Structure

```text
NeedNourish/
├── src/                # Backend (FastAPI)
│   ├── food/           # Food listing logic & PostGIS spatial queries
│   ├── supplier/       # Supplier account & dashboard logic
│   ├── needy/          # Receiver account & history logic
│   └── utils/          # Auth dependencies, DB config, and helpers
├── client/             # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/        # Axios instance & interceptors
│   │   ├── components/ # Reusable UI components (Navbar, FoodCard)
│   │   ├── context/    # Global Auth state & Role management
│   │   ├── pages/      # Supplier & Needy screen views
│   │   └── services/   # API communication layer (Service Pattern)
├── .env                # Secret keys & DB strings (Ignored by Git)
└── main.py             # Backend entry point

# ⚙️ Setup and Installation

## Prerequisites
- Python 3.10+
- Node.js (v18+)
- PostgreSQL with the PostGIS extension enabled (`CREATE EXTENSION postgis;`).

## 1. Backend Setup
### Activate your virtual environment:
```bash
source env/bin/activate
```
### Install dependencies:
```bash
pip install fastapi uvicorn sqlalchemy geoalchemy2 psycopg2-binary pydantic-settings python-jose[cryptography] passlib[bcrypt]
```
### Create a `.env` file in the root directory:
```env
DB_CONNECTION=postgresql://username:password@localhost:5432/neednourish
SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
```
### Start the server:
```bash
uvicorn main:app --reload
```

## 2. Frontend Setup
### Navigate to the client folder:
```bash
cd client
```
### Install dependencies:
```bash
npm install
```
### Create a `.env` file in the `client/` folder:
```env
VITE_API_URL=http://127.0.0.1:8000
```
### Start the development server:
```bash
npm run dev
```

# 📡 API Overview
|	Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /suppliers/register | Public | Create a donor account |
| POST | /needies/login | Public | Login for receivers (OAuth2 Form Data) |
| POST | /food/ | Supplier | Post a new food listing with GPS coords |
| GET  | /food/nearby | Public | Search available food via Lat/Long & Radius |
| POST | /food/{id}/claim | Needy | Claim a specific food item |



# 🛡️ Security 
- **CORS Policy:** Configured to allow secure cross-origin requests from the Vite frontend to the FastAPI backend.
- **Protected Routes:** Client-side logic ensures only authenticated users can access specific dashboards.
- **RBAC (Role-Based Access Control):** Backend dependencies verify user roles (supplier vs needy) before allowing sensitive operations like posting or claiming.

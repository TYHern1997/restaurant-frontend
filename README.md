# 🍽️ Sigma Serve

A full-stack restaurant booking web app that allows users in Kuala Lumpur to discover restaurants, make reservations, and share dining experiences through reviews and photos.

## 🔗 Live Demo
[https://restaurant-frontend-one-xi.vercel.app](https://restaurant-frontend-one-xi.vercel.app)

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Bootstrap, React Router |
| Backend | Express.js |
| Database | PostgreSQL (Neon) |
| Storage | Firebase Storage |
| Maps | Leaflet.js + OpenStreetMap |
| Geocoding | Nominatim API |
| Auth | JWT + bcryptjs |
| AI | OpenAI API |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel (frontend), Railway (backend) |

## ✨ Features
- User registration and login with JWT authentication
- Restaurant discovery with interactive map
- Table booking system (create, edit, delete)
- Mark bookings as visited
- Review system with star ratings and photos
- AI-powered review grammar correction
- Admin panel with restaurant and user management
- Automatic geocoding via Nominatim API
- Responsive design for mobile screens

## 🔑 Environment Variables
Create a `.env` file in the frontend root:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

Create a `.env` file in the backend root:

DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=

## 🚀 Running Locally
### Frontend
```bash
cd restaurant-frontend
npm install
npm run dev
```

### Backend
```bash
cd restaurant-backend
npm install
node index.js
```

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /login | User login |
| POST | /signup | User registration |
| GET | /restaurants | Get all restaurants |
| POST | /restaurants | Add restaurant (admin) |
| PUT | /restaurants/:id | Update restaurant (admin) |
| DELETE | /restaurants/:id | Delete restaurant (admin) |
| GET | /bookings | Get user bookings |
| POST | /bookings | Create booking |
| PUT | /bookings/:id | Update booking |
| DELETE | /bookings/:id | Delete booking |
| PUT | /bookings/:id/visited | Mark as visited |
| GET | /reviews/user/:id | Get user reviews |
| POST | /reviews | Submit review |
| PUT | /reviews/:id | Update review |
| GET | /reviews/recent | Get recent reviews |
| POST | /ai/correct-review | AI review correction |
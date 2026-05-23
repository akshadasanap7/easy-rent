# 🏠 EasyRent — Full Stack Rental Platform

A complete property rental web application built with React + Vite (client) and Node.js + Express + MongoDB (server).

---

## 🔗 Live Links

| Service | URL |
|---------|-----|
| 🌐 Client (Vercel) | https://easy-rent-client.vercel.app |
| 🚀 Server (Render) | https://easy-rent-api.onrender.com |
| 📦 GitHub Repo | https://github.com/yourusername/easy-rent |

> Replace the above URLs after deploying.

---

## 🧱 Tech Stack

### Client
- React 19 + Vite
- TailwindCSS v4 (dark glassmorphism design)
- React Router DOM v6
- Axios + Zustand (state management)
- React Hot Toast (notifications)
- React Icons + date-fns

### Server
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image uploads)
- Multer (file handling)
- bcryptjs (password hashing)

---

## 📁 Project Structure

```
easy-rent/
├── client/          # React + Vite frontend
│   └── src/
│       ├── api/         # Axios API calls
│       ├── components/  # Navbar, Footer, PropertyCard, SearchFilter
│       ├── pages/       # Home, Properties, PropertyDetail, Auth, Dashboard
│       └── store/       # Zustand auth store
└── server/          # Express backend
    ├── models/      # User, Property, Booking
    ├── routes/      # auth, properties, bookings, users
    ├── middleware/  # JWT protect, hostOnly
    └── config/      # Cloudinary setup
```

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/easy-rent.git
cd easy-rent
```

### 2. Server setup
```bash
cd server
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, Cloudinary keys
npm install
npm run dev
```

### 3. Client setup
```bash
cd vite-project
npm install
npm run dev
```

Client runs on `http://localhost:5173`  
Server runs on `http://localhost:5000`

---

## 🚀 Deployment

### Client → Vercel
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set root directory to `vite-project`
4. Add env variable: `VITE_API_URL=https://your-render-api.onrender.com`

### Server → Render
1. Create new Web Service on [render.com](https://render.com)
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all environment variables from `.env.example`

---

## ✨ Features

- 🔐 JWT Auth — Register/Login as Tenant or Host
- 🏠 Property Listings — Browse with search, filter by city/type/price/bedrooms
- 📸 Image Gallery — Upload up to 6 images per property (Cloudinary)
- 📅 Booking System — Request, confirm, cancel bookings
- ⭐ Reviews — Rate and review properties
- 🔖 Saved Properties — Bookmark favourite listings
- 🏡 Host Dashboard — Manage listings, view/approve bookings, revenue stats
- 👤 Profile — Update name, phone, avatar, switch role
- 📱 Fully Responsive — Mobile-first dark UI

---

## 📸 Design

Unique dark glassmorphism design with:
- Deep dark surface (`#0f0f13`)
- Violet/Indigo gradient accents
- Glass cards with blur backdrop
- Smooth hover animations
- Plus Jakarta Sans typography

---

## 📚 Based On

Lecture series: EasyRent Part 1–8  
(Project Setup → Properties List → Details → Images → Filter/Search → Final Brushup)

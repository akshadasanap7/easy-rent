# 🏠 EasyRent — Full Stack Rental Platform

<div align="center">

![EasyRent](https://img.shields.io/badge/EasyRent-Rental%20Platform-7c3aed?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Client-Vercel-000000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Server-Render-46E3B7?style=flat-square&logo=render)

</div>

---

## 🔗 Live Links

| Service | URL |
|---------|-----|
| 🌐 **Client (Vercel)** | [https://easy-rent-client.vercel.app](https://easy-rent-client.vercel.app) |
| 🚀 **Server (Render)** | [https://easyrent-api.onrender.com](https://easyrent-api.onrender.com) |
| 📦 **GitHub Repo** | [https://github.com/YOUR_USERNAME/easy-rent](https://github.com/YOUR_USERNAME/easy-rent) |

> ⚠️ Replace the above URLs with your actual deployed URLs.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 JWT Auth | Register / Login as Tenant or Host |
| 🏠 Property Listings | Browse with search & filter by city / type / price / bedrooms |
| 📸 Image Gallery | Upload up to 6 images per property via Cloudinary |
| 📅 Booking System | Request, confirm, and cancel bookings |
| ⭐ Reviews | Rate and review properties after stay |
| 🔖 Saved Properties | Bookmark favourite listings |
| 🏡 Host Dashboard | Manage listings, approve bookings, view revenue |
| 👤 Profile | Update name, phone, avatar, switch role |
| 🔔 Toast Notifications | Real-time feedback via React Hot Toast |
| 📱 Responsive | Mobile-first dark glassmorphism UI |

---

## 🧱 Tech Stack

### Client (`/vite-project`)
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI Framework |
| Vite | 8 | Build Tool |
| TailwindCSS | v4 | Styling |
| React Router DOM | v6 | Routing |
| Axios | latest | HTTP Client |
| Zustand | latest | State Management |
| React Hot Toast | latest | Notifications |
| React Icons | latest | Icon Library |
| date-fns | latest | Date Formatting |

### Server (`/server`)
| Package | Version | Purpose |
|---------|---------|---------|
| Express | 4 | Web Framework |
| Mongoose | 8 | MongoDB ODM |
| JWT | 9 | Authentication |
| bcryptjs | 2 | Password Hashing |
| Cloudinary | 2 | Image Uploads |
| Multer | 2 | File Handling |
| dotenv | 16 | Environment Variables |

---

## 📁 Project Structure

```
easy-rent/
├── vite-project/              # React + Vite Frontend
│   └── src/
│       ├── api/               # Axios instance, auth, properties, bookings
│       ├── components/
│       │   ├── layout/        # Navbar, Footer, ProtectedRoute
│       │   └── ui/            # PropertyCard, SearchFilter, Spinner, Badge
│       ├── pages/             # Home, Properties, PropertyDetail
│       │                      # Login, Register, AddProperty
│       │                      # Dashboard, MyBookings, Profile, Saved
│       └── store/             # Zustand auth store
│
└── server/                    # Express Backend
    ├── models/                # User, Property, Booking
    ├── routes/                # auth, properties, bookings, users
    ├── middleware/            # JWT protect, hostOnly
    └── config/                # Cloudinary setup
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/easy-rent.git
cd easy-rent
```

### 2. Server setup
```bash
cd server
cp .env.example .env
# Fill in your .env values
npm install
npm run dev        # runs on http://localhost:5000
```

### 3. Client setup
```bash
cd vite-project
npm install
npm run dev        # runs on http://localhost:5173
```

---

## 🚀 Deployment

### Client → Vercel
| Setting | Value |
|---------|-------|
| Root Directory | `vite-project` |
| Framework | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Env Variable | `VITE_API_URL=https://easyrent-api.onrender.com` |

### Server → Render
| Setting | Value |
|---------|-------|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Env Variables | See `.env.example` |

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Get all (with filters) |
| GET | `/api/properties/:id` | Get single property |
| POST | `/api/properties` | Create property (host) |
| PUT | `/api/properties/:id` | Update property (host) |
| DELETE | `/api/properties/:id` | Delete property (host) |
| POST | `/api/properties/:id/reviews` | Add review |
| GET | `/api/properties/host/my-listings` | Host listings |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my-bookings` | Tenant bookings |
| GET | `/api/bookings/host-bookings` | Host bookings |
| PUT | `/api/bookings/:id/status` | Update status |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/saved/:id` | Toggle saved |
| GET | `/api/users/saved` | Get saved properties |

---

## 📸 Design System

| Token | Value |
|-------|-------|
| Background | `#0f0f13` |
| Surface | `#18181f` |
| Brand | `#7c3aed` (Violet) |
| Accent | `#4f46e5` (Indigo) |
| Font | Plus Jakarta Sans |
| Style | Dark Glassmorphism |

---

## 📚 Based On

Lecture series: **EasyRent Part 1–8**

| Lecture | Topic |
|---------|-------|
| Part 1 | Project Setup |
| Part 2 | Properties List |
| Part 3 | Properties List API |
| Part 4 | Property Details |
| Part 5 | Handling Property Images |
| Part 6 | Filter and Search Logic |
| Part 7 | Fixing Search and Filter |
| Part 8 | Final Brushup |

---

## 📄 License

MIT © 2025 EasyRent

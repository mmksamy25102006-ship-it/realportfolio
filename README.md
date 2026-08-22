# Kumar's Full-Stack Portfolio 🚀

A complete full-stack personal portfolio website built with React, Node.js, Express, and MongoDB Atlas. Features a public-facing portfolio with dynamic projects loaded from the database, a working contact form, and a protected admin dashboard for content management.

---

## 🌟 Features

- **Animated intro screen** with portal effect
- **Hero section** with galaxy / shooting-star background
- **About, Skills, Projects, Contact, Footer** sections
- **Dynamic projects** fetched from MongoDB via REST API
- **Contact form** saves messages to the database
- **Admin Dashboard** — add/edit/delete projects, view/delete messages
- **JWT Authentication** — protected admin routes
- **Responsive** — mobile, tablet, desktop

---

## 🛠 Tech Stack

| Layer       | Technology                      |
|-------------|--------------------------------|
| Frontend    | React 19, Vite, React Router   |
| HTTP Client | Axios                          |
| Backend     | Node.js, Express.js            |
| Database    | MongoDB Atlas + Mongoose        |
| Auth        | JWT + bcryptjs                 |
| Deployment  | Vercel (frontend) + Render (backend) |

---

## 📁 Folder Structure

```
myportfolio/
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Hero, About, Skills, Projects, Contact, Footer, AdminNav, ProtectedRoute
│   │   ├── pages/             # AdminLogin, AdminDashboard, AdminProjects, AdminMessages
│   │   ├── services/api.js    # Axios API service
│   │   ├── hooks/useAuth.js   # Auth hook
│   │   ├── App.jsx            # Routes
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── controllers/           # authController, projectController, messageController
    ├── models/                # User, Project, Message
    ├── routes/                # authRoutes, projectRoutes, messageRoutes
    ├── middleware/auth.js     # JWT middleware
    ├── config/db.js           # MongoDB connection
    ├── server.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Installation & Local Development

### 1. Clone the repo

```bash
git clone https://github.com/mmksamy25102006-ship-it/myportfolio.git
cd myportfolio
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔐 Environment Variables

### backend/.env

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_super_long_random_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### frontend/.env

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🍃 MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a new **Cluster** (free M0 tier)
3. Click **Connect** → **Connect your application** → copy the connection string
4. Replace `<username>` and `<password>` with your DB user credentials
5. Add the connection string to `backend/.env` as `MONGODB_URI`
6. In **Network Access**, add `0.0.0.0/0` to allow all IPs (for development)

---

## 👤 Create Your Admin Account

After starting the backend, run this **once** to create your admin user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Kumar","email":"kumar@email.com","password":"yourpassword"}'
```

Then log in at: `http://localhost:5173/admin/login`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint            | Access  |
|--------|---------------------|---------|
| POST   | /api/auth/register  | Public  |
| POST   | /api/auth/login     | Public  |
| GET    | /api/auth/me        | Private |

### Projects
| Method | Endpoint            | Access  |
|--------|---------------------|---------|
| GET    | /api/projects       | Public  |
| GET    | /api/projects/:id   | Public  |
| POST   | /api/projects       | Admin   |
| PUT    | /api/projects/:id   | Admin   |
| DELETE | /api/projects/:id   | Admin   |

### Messages
| Method | Endpoint            | Access  |
|--------|---------------------|---------|
| POST   | /api/messages       | Public  |
| GET    | /api/messages       | Admin   |
| GET    | /api/messages/:id   | Admin   |
| PUT    | /api/messages/:id   | Admin   |
| DELETE | /api/messages/:id   | Admin   |

---

## 🚀 Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [https://render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo, set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (MONGODB_URI, JWT_SECRET, PORT, CLIENT_URL=your-vercel-url)
7. Copy the Render URL (e.g. `https://myportfolio-api.onrender.com`)

### Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://myportfolio-api.onrender.com/api`
4. Deploy

### Configure CORS for Production

In `backend/.env` on Render, set:
```
CLIENT_URL=https://your-portfolio.vercel.app
```

---

## 🔮 Future Improvements

- Image upload with Cloudinary
- Blog section
- Dark/light theme toggle
- Analytics dashboard
- Email notifications for new contact messages

---

© 2026 Kumar • Built with React + Node.js + MongoDB

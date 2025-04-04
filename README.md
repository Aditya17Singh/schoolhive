# School ERP System – Setup Guide

This project is a School ERP system built with **Next.js** (frontend) and **Express.js** (backend), using **MongoDB** as the database. Follow the steps below to get started with both the frontend and backend.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- `npm` or `pnpm` package manager
- MongoDB connection string

---

## 📦 Backend Setup

### 1. Clone the repository (if needed)
```bash
git clone <your-backend-repo-url>
cd backend

2. Install dependencies
npm install
# or
pnpm install

3. Create a .env file in the backend directory and add the following:
MONGODB_URI=mongodb+srv://adityasingh:jlC2AU7AsvfzvdIS@cluster0.b8qhzcy.mongodb.net/
JWT_SECRET=my_jwt_secret_key
FRONTEND_URL=http://localhost:3000

4. Start the backend server
npm run dev
# or
pnpm run dev


Frontend Setup
1. Navigate to the frontend directory
cd frontend

2. Install dependencies
npm install
# or
pnpm install

3. Create a .env.local file in the frontend directory and add the following:
MONGODB_URI=mongodb+srv://adityasingh:jlC2AU7AsvfzvdIS@cluster0.b8qhzcy.mongodb.net/
NEXTAUTH_SECRET=mysecret
NEXTAUTH_URL=http://localhost:3000

4. Start the frontend development server
npm run dev
# or
pnpm run dev

✅ You're all set!
Visit http://localhost:3000 to view the frontend. The backend will typically run on http://localhost:5000 unless otherwise configured.

📌 Notes
Make sure your MongoDB cluster allows connections from your local IP.

Don’t forget to keep your .env files out of version control!
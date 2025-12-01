# RBAC Auth System

A simple full-stack app with **Express (Backend)** and **React (Frontend)**.

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` and paste this:
```env
PORT=3000
DB_URL=your_mongodb_connection_string
SESSION_SECRET=any_secret_key
ALLOWED_ORIGINS_1=http://localhost:5173
```
Start the server:
```bash
npm run dev
```
The server will run on `http://localhost:3000`.

### 2. Frontend Setup
```bash
cd ../rbac-frontend
npm install
```
Create a `.env` file in `rbac-frontend/` and add this:
```env
VITE_API_BASE_URL=/api
```
> **Note:** This uses the proxy in `vite.config.js` to forward requests to the backend.

Start the frontend:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🗄️ MongoDB Setup
1.  Get your connection string from **MongoDB Atlas**.
2.  Paste it into `backend/.env` as `DB_URL`.
    *   Example: `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority`

---

## ☁️ Deployment

### Backend
Deploy the `backend` folder.
*   Ensure `package.json` has `"start": "node server.js"` (Already configured).
*   Set your Environment Variables (`DB_URL`, `SESSION_SECRET`, etc.) in your hosting provider settings.

### Frontend (Vercel)
Deploy the `rbac-frontend` folder.
*   **`vercel.json`**: Handles routing in production (redirects `/api` to your backend).
*   **`vite.config.js`**: Handles proxying in local development.

**Important:**
In `rbac-frontend/vercel.json`, update the destination URL to your **deployed backend URL**:
```json
"destination": "https://your-deployed-backend.com/$1"
```

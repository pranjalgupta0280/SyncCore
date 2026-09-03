# ⚡ SyncCore — Real-Time Team Collaboration & Analytics Platform

SyncCore is an enterprise-grade MERN stack real-time collaboration application designed for seamless team communication, Kanban project tracking, multi-member task delegation, and live MongoDB aggregation analytics.

![SyncCore Pitch Black UI](https://img.shields.io/badge/Design-Pitch--Black%20Glassmorphism-emerald?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-indigo?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io%20v4-black?style=for-the-badge)

---

## 🔗 Live Deployments

- **🌐 Live Web Application**: [https://synccore-kappa.vercel.app](https://synccore-kappa.vercel.app)
- **⚡ Live Backend API & WebSocket Service**: [https://synccore-cgqc.onrender.com](https://synccore-cgqc.onrender.com)

---

## 🖼️ Application Showcase & UI Screenshots

### 1. Landing Page & Hero Section
![SyncCore Landing Page](<./images/Screenshot 2026-09-03 202822.png>)

### 2. Workspace Dashboard & Sidebar Navigation
![Workspace Dashboard](<./images/Screenshot 2026-09-03 203524.png>)

### 3. Real-Time Channel & Direct Messaging (DMs)
![Real-Time Chat](<./images/Screenshot 2026-09-03 203614.png>)

### 4. Image Attachments & Lightbox Zoom
![Chat Image Attachments](<./images/Screenshot 2026-09-03 204245.png>)

### 5. Kanban Task Board & Subtask Workspaces
![Kanban Board](<./images/Screenshot 2026-09-03 204303.png>)

### 6. Single Assignee & Multi-Member Collaborators Checklist
![Multi-Member Assignment](<./images/Screenshot 2026-09-03 204634.png>)

### 7. Real-Time MongoDB Aggregation Analytics
![Performance Analytics](<./images/Screenshot 2026-09-03 204821.png>)

---

## ✨ Key Features

### 1. 💬 Real-Time Messaging & Image Attachments
- **Public Team Channels**: Real-time broadcast messaging in `#general`.
- **1-on-1 Direct Messages (DMs)**: Private user-to-user real-time chat with online handle discovery (`@username`).
- **Inline Image Attachments**: Client-side canvas compression reduces images to fast Base64 payloads with instant lightbox zoom preview.
- **WebSocket Resilience**: Built-in 50MB payload buffer & automatic room reconnection powered by Socket.io.

### 2. 📋 Kanban Workspaces & Subtask Management
- **Interactive Kanban Board**: Dynamic columns for `To Do`, `In Progress`, and `Completed`.
- **Single Primary Assignee**: Clear ownership with single user selection.
- **Multiple Collaborators**: Multi-member selection allowing multiple team members to work together on the same subtask.
- **Priority & Deadlines**: Low, Medium, High, and Urgent color-coded badges with deadline tracking.

### 3. 🔒 Granular Role-Based Access Control (RBAC)
- **Admin-Only Creation**: Only Team Admins (workspace creator or promoted Admins) can create projects, tasks, and subtasks.
- **Status Update Guards**: Task status can **only** be modified by the Team Admin, Primary Assignee, or assigned Collaborators. Unauthorized users see a disabled status selector with permission notifications.

### 4. 📊 Live MongoDB Aggregation Analytics
- **Workspace Completion Rate**: Radial percentage completion rate computed via MongoDB aggregation pipelines (`$project`, `$cond`, `$divide`).
- **Member Workload Distribution**: Individual member efficiency bars computed using `$setUnion` and `$unwind` across primary assignees and collaborators.
- **Overdue Risk Tracking**: Real-time warnings for uncompleted subtasks past deadline.

### 5. 🎨 Pitch-Black Glassmorphic Aesthetics
- Tailored pitch-black obsidian (`#050505`) backdrop, onyx card surfaces (`#0D0D0D`), emerald accent highlights (`#10B981`), and smooth glassmorphism borders.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **Core**: React 18, Vite
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System, Lucide React Icons
- **State & Routing**: React Context API (`AuthContext`, `TeamContext`)
- **Network & WebSockets**: Axios (JWT interceptors), Socket.io Client

### Backend (`/server`)
- **Runtime**: Node.js, Express 5
- **Database**: MongoDB Atlas / Mongoose v9 (Aggregation Pipelines, Subdocs)
- **Real-Time Engine**: Socket.io v4 (JWT handshake authentication middleware)
- **Security**: Bcrypt.js password hashing, JSON Web Tokens (JWT), CORS protection

---

## 📁 Repository Directory Structure

```text
SyncCore/
├── images/                     # Application UI Screenshots
│   ├── Screenshot 2026-09-03 202822.png
│   ├── Screenshot 2026-09-03 203524.png
│   ├── Screenshot 2026-09-03 203614.png
│   ├── Screenshot 2026-09-03 204245.png
│   ├── Screenshot 2026-09-03 204303.png
│   ├── Screenshot 2026-09-03 204634.png
│   └── Screenshot 2026-09-03 204821.png
│
├── client/                     # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/         # UI Components (TaskBoard, ChatPanel, AnalyticsPanel, etc.)
│   │   ├── context/            # AuthContext & TeamContext providers
│   │   ├── services/           # Axios API instance & Socket.io client
│   │   ├── App.jsx             # Main router & workspace view switcher
│   │   ├── index.css           # Pitch-black CSS theme tokens
│   │   └── main.jsx            # React root entry
│   ├── .env                    # Frontend production API URL configuration
│   └── package.json
│
├── server/                     # Node.js + Express Backend Service
│   ├── config/                 # MongoDB database connection resilience
│   ├── controllers/            # Auth, Team, Project, and Analytics controllers
│   ├── middlewares/            # JWT auth, RBAC permissions, global error handler
│   ├── models/                 # Mongoose models (User, Team, Project, Message)
│   ├── routes/                 # Express API routes (/api/auth, /api/teams, etc.)
│   ├── sockets/                # Socket.io event listeners & broadcast handlers
│   ├── .env.example            # Environment variables template
│   ├── render.yaml             # Render 1-click cloud deployment manifest
│   ├── server.js               # Express application entry point
│   └── package.json
│
└── ARCHITECTURE_FLOW.md        # Technical request lifecycle documentation & flowcharts
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas URI)

### 2. Clone Repository
```bash
git clone https://github.com/pranjalgupta0280/SyncCore.git
cd SyncCore
```

### 3. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/synccore
JWT_SECRET=synccore_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:3000
```
Start the server:
```bash
npm start
```

### 4. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🌐 Production Cloud Deployment Guide

### Deploying Backend on Render.com
1. Create a new **Web Service** on [Render.com](https://render.com).
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *Your MongoDB Atlas Connection String*
   - `JWT_SECRET`: *Your JWT Secret Key*
   - `CLIENT_URL`: `https://synccore-kappa.vercel.app`

### Deploying Frontend on Vercel
1. Import your repo on [Vercel](https://vercel.com).
2. Root Directory: `client`
3. Environment Variables:
   - `VITE_API_URL`: `https://synccore-cgqc.onrender.com`
   - `VITE_SOCKET_URL`: `https://synccore-cgqc.onrender.com`

---

## 📡 API Endpoint Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Login user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |
| `POST` | `/api/teams` | Create new team workspace | Private |
| `POST` | `/api/teams/:teamId/members` | Invite member by handle `@username` | Admin Only |
| `GET` | `/api/teams/:teamId/projects` | List all projects in workspace | Private |
| `POST` | `/api/teams/:teamId/projects` | Create project container | Admin Only |
| `POST` | `/api/projects/:projectId/subtasks` | Add subtask (1 Assignee + Collaborators) | Admin Only |
| `PATCH` | `/api/projects/:projectId/subtasks/:subtaskId` | Update subtask status | Admin/Assignee/Collaborator |
| `GET` | `/api/analytics/teams/:teamId/stats` | Compute MongoDB aggregation metrics | Private |

---

## 📜 License

This project is licensed under the ISC License. Created for enterprise real-time team collaboration.

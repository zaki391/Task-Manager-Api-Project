# 🚀 Task Manager Application

A modern, full-stack **Task Manager application** built with a **Node.js/Express Backend REST API** and a **React Single-Page Application (SPA)** on the frontend. 

This project allows users to efficiently **create, update, manage, and track tasks** within a clean, minimalistic UI with full backend integration.

---

## 🧱 Tech Stack

### Frontend
- **React.js** (Bootstrapped with Vite)
- **Vanilla CSS** (Minimalist design system)
- **Axios** (API requests)

### Backend
- **Node.js & Express.js**
- **In-memory data storage**
- **UUID** for unique IDs
- **CORS enabled**

---

## ✨ Features

- **Single Page Interface**: Smooth, instant updates without full page reloads.
- **Task Management**: Create, edit, and delete tasks instantly.
- **Task Tracking**: Toggle tasks between 'Pending' and 'Done'.
- **Filters & Sorting**: View specifically 'Done' or 'Pending' tasks, and sort them chronologically via the API.
- **Robust Error Handling**: Real-time feedback for API network issues or invalid field formats.

---

## 📂 Project Structure

```text
/backend
  ├── src/
  │   ├── routes/          # API route definitions
  │   ├── controllers/     # API logic handlers
  │   ├── middlewares/     # Error & 404 handlers
  │   └── utils/           # ID generator
  └── server.js            # Express entry point

/frontend
  ├── src/
  │   ├── pages/Dashboard.jsx  # Main application view & logic
  │   ├── api.js               # Global Axios configuration
  │   ├── App.jsx              # React app component
  │   ├── index.css            # Global styling
  │   └── main.jsx             # Vite entry point
  ├── index.html
  ├── package.json
  └── vite.config.js
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/zaki391/Task-Manager-Api-Project
cd Task-Manager-Api-Project
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
node server.js
```
The API server will securely run locally on `http://localhost:3000`.

### 3️⃣ Frontend Setup
Open a **new terminal tab**:
```bash
cd frontend
npm install
npm run dev
```
The React development server will start at `http://localhost:5173`. Open this URL in your browser to interact with the frontend application.

---

## 🔗 API Endpoints

- `GET /tasks` - Retrieve all tasks (accepts optional filters `?status=pending` & `?sort=createdAt`)
- `POST /tasks` - Create a task
- `GET /tasks/:id` - Get specific task
- `PUT /tasks/:id` - Update task details
- `PATCH /tasks/:id/done` - Mark task as completed
- `DELETE /tasks/:id` - Delete task

---

## ⚠️ Error Handling

- **400 Bad Request** → Invalid or missing input
- **404 Not Found** → Task does not exist
- **405 Method Not Allowed** → Unsupported HTTP method

---

## 👨‍💻 Author

**Zaki (zaki391)**  
B.Tech CSE (Data Science & Analytics)  
Passionate about Full-Stack Development & AI/ML

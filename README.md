# Task Manager Full-Stack App

A full-stack Task Manager application with a robust REST API backend and a clean, responsive vanilla HTML/CSS/JS frontend.

## 📂 Project Structure

- `/backend`: Node.js & Express.js REST API
- `/frontend`: Vanilla HTML, CSS, JavaScript UI

## 🚀 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *The server will run on http://localhost:3000.*

## 🎨 Frontend Usage

1. Open `frontend/index.html` in your web browser.
2. Alternatively, you can run a live server on the `frontend` directory (e.g., using VS Code Live Server extension).

## 🔗 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/tasks` | Create a new task (body: `title`, `description`) |
| `GET` | `/tasks` | Get all tasks (params: `?status=pending`, `?sort=createdAt`) |
| `GET` | `/tasks/:id` | Get a single task by ID |
| `PUT` | `/tasks/:id` | Update a task (body: `title`, `description`) |
| `PATCH` | `/tasks/:id/done` | Mark a task as done |
| `DELETE` | `/tasks/:id` | Delete a task |

## 🧪 Sample Requests (cURL)

**Create Task**
```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title": "Buy groceries", "description": "Milk, eggs, and bread"}'
```

**Get All Tasks**
```bash
curl http://localhost:3000/tasks
```

**Get Pending Tasks (Filtered)**
```bash
curl http://localhost:3000/tasks?status=pending
```

**Get Task by ID**
```bash
curl http://localhost:3000/tasks/YOUR_TASK_ID
```

**Update Task**
```bash
curl -X PUT http://localhost:3000/tasks/YOUR_TASK_ID \
-H "Content-Type: application/json" \
-d '{"title": "Buy groceries and snacks"}'
```

**Mark as Done**
```bash
curl -X PATCH http://localhost:3000/tasks/YOUR_TASK_ID/done
```

**Delete Task**
```bash
curl -X DELETE http://localhost:3000/tasks/YOUR_TASK_ID
```

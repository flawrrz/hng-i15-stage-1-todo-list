# To-Do List App (Node.js + React + MongoDB)

## Project Structure

- `backend/` - Express API + MongoDB
  - MongoDB config is in `backend/src/config/db.js`
- `frontend/` - React app (Vite)

## (1) Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`:

Run backend:

```bash
npm run dev
```

## (2) Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

## Features Implemented

- Add task
- Mark task complete/incomplete
- Delete task
- Drag-and-drop reorder

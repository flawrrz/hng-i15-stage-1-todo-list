# agents.md

## Project: Beginner To-Do List Web App

This document defines how to build and organize a beginner-friendly to-do list app using:
- **Backend:** Node.js + JavaScript
- **Frontend:** React
- **Database:** MongoDB

Core features:
- Add tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Move tasks around (reorder)

---

## (1) Recommended MVP Scope (Start Here)

To keep this easy as a beginner, start with:
- One user only (no login yet)
- One to-do list
- Reorder tasks within one list
- Save task order in MongoDB

You can add accounts, multiple lists, due dates, and categories later.

---

## (2) Data Model (MongoDB)

Use one `tasks` collection.

Suggested fields:
- `_id`
- `title` (string, required)
- `completed` (boolean, default `false`)
- `position` (number, used for ordering)
- `createdAt` (date)
- `updatedAt` (date)

Why `position` matters:
- It makes drag-and-drop ordering easy to save and reload.

---

## (3) API Endpoints (Simple and Clear)

Suggested REST endpoints:

- `GET /api/tasks`  
  Return all tasks sorted by `position` (ascending).

- `POST /api/tasks`  
  Create a new task.

- `PATCH /api/tasks/:id`  
  Update a task (title/completed).

- `DELETE /api/tasks/:id`  
  Delete a task.

- `PATCH /api/tasks/reorder`  
  Save new order after drag-and-drop.

---

## (4) Frontend Behavior (React)

Recommended screens/components:
- Task input form
- Task list
- Task item row with:
  - checkbox (mark complete)
  - delete button
  - drag handle (for moving)

State flow:
- Fetch tasks on page load
- Store in React state
- Update UI immediately on actions
- Sync changes to backend

For drag-and-drop, use a beginner-friendly library:
- `@dnd-kit/core` + `@dnd-kit/sortable`  
  (or `react-beautiful-dnd` if you prefer older tutorials)

---

## (5) Folder Structure (Beginner-Friendly)

Example structure:

```text
/backend
  /src
    /config
    /models
    /routes
    /controllers
    app.js
    server.js

/frontend
  /src
    /components
    /services
    App.jsx
    main.jsx
```

---

## (6) Validation and Error Handling

Minimum checks you should include:
- Task title cannot be empty
- Task title max length (for example, 120 chars)
- Return clear error messages from API
- Handle network errors in UI (show message)

---

## (7) Decisions You Should Make Now

Here are the key decisions. Recommended options are marked:

1. **Authentication now or later?**  
   - **Later (Recommended)** for beginner MVP  
   - Add now

2. **Single list or multiple lists?**  
   - **Single list (Recommended)**  
   - Multiple lists

3. **Move tasks only in one list, or between columns (Kanban)?**  
   - **One list reorder (Recommended)**  
   - Kanban columns

4. **Soft delete or hard delete?**  
   - **Hard delete (Recommended)**  
   - Soft delete (archive)

5. **Do you want due dates/priority in MVP?**  
   - **No (Recommended)**  
   - Yes

---

## (8) What You Might Add After MVP

Good next features:
- Due dates
- Priority labels
- Edit task title
- Filter: All / Active / Completed
- Clear completed tasks
- User accounts and per-user data

---

## (9) Build Order (Step-by-Step)

1. Create backend + MongoDB connection
2. Build task model
3. Build CRUD endpoints
4. Build reorder endpoint
5. Build React task list UI
6. Connect UI to API
7. Add drag-and-drop reorder
8. Add validation + error messages
9. Test all four core actions (add, check, delete, move)

---

## (10) Beginner Rule

Keep the first version small and working.  
A complete simple app is better than an incomplete advanced app.

---

## Confirmed Decisions (Your Selections)

- Authentication: **Later**
- List scope: **Single list**
- Moving tasks: **Reorder within one list**
- Deletion type: **Permanent delete**
- Due dates/priority in MVP: **No**

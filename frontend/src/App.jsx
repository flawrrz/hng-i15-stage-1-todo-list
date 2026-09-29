import { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import {
  createTask,
  deleteTask,
  getTasks,
  reorderTasks,
  updateTask
} from "./services/tasksApi";

function moveItem(items, fromIndex, toIndex) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [filter, tasks]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  async function handleAddTask(title) {
    setError("");
    setIsSaving(true);
    try {
      const newTask = await createTask(title);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (createError) {
      setError(createError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleComplete(id, completed) {
    setError("");
    setIsSaving(true);
    try {
      const updatedTask = await updateTask(id, { completed });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTask(id) {
    setError("");
    setIsSaving(true);
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEditTask(id, title) {
    setError("");
    setIsSaving(true);
    try {
      const updatedTask = await updateTask(id, { title });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
      return true;
    } catch (updateError) {
      setError(updateError.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function persistOrder(nextTasks, previousTasks) {
    setTasks(nextTasks);
    setError("");
    setIsSaving(true);

    try {
      await reorderTasks(nextTasks.map((task) => task._id));
    } catch (reorderError) {
      setTasks(previousTasks);
      setError(reorderError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tasks.findIndex((task) => task._id === active.id);
    const newIndex = tasks.findIndex((task) => task._id === over.id);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
      return;
    }

    const previousTasks = tasks;
    const nextTasks = moveItem(tasks, oldIndex, newIndex);
    await persistOrder(nextTasks, previousTasks);
  }

  return (
    <main className="container">
      <h1>To-Do List</h1>
      <p className="subtext">
        Completed: {completedCount} / {tasks.length}
      </p>

      <TaskForm onAddTask={handleAddTask} disabled={isSaving || loading} />

      <div className="filter-bar" aria-label="Task filters">
        {[
          { key: "all", label: "All" },
          { key: "active", label: "Active" },
          { key: "completed", label: "Completed" }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            type="button"
            className={`filter-button ${filter === filterOption.key ? "active" : ""}`}
            onClick={() => setFilter(filterOption.key)}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onEditTask={handleEditTask}
          onDragEnd={handleDragEnd}
          disabled={isSaving || filter !== "all"}
          filter={filter}
        />
      )}
    </main>
  );
}

export default App;

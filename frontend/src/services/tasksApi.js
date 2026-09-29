const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      message = "Request failed";
    }
    throw new Error(message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function getTasks() {
  return request("/tasks");
}

export function createTask(title) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify({ title })
  });
}

export function updateTask(id, updates) {
  return request(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates)
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: "DELETE" });
}

export function reorderTasks(taskIds) {
  return request("/tasks/reorder", {
    method: "PATCH",
    body: JSON.stringify({ taskIds })
  });
}

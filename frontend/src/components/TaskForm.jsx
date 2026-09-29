import { useState } from "react";

function TaskForm({ onAddTask, disabled }) {
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setValidationError("Task title is required.");
      return;
    }

    setValidationError("");
    await onAddTask(trimmedTitle);
    setTitle("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        maxLength={120}
        onChange={(event) => {
          setTitle(event.target.value);
          if (validationError) {
            setValidationError("");
          }
        }}
        placeholder="Add a new task..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        Add
      </button>
      {validationError && <p className="error-message">{validationError}</p>}
    </form>
  );
}

export default TaskForm;

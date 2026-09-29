import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";

function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEditTask,
  disabled
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    disabled
  });
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [validationError, setValidationError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(task.title);
      setValidationError("");
    }
  }, [task.title, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  async function handleSave() {
    const trimmedTitle = draftTitle.trim();

    if (!trimmedTitle) {
      setValidationError("Task title cannot be empty.");
      return;
    }

    if (trimmedTitle.length > 120) {
      setValidationError("Task title must be at most 120 characters.");
      return;
    }

    const wasUpdated = await onEditTask(task._id, trimmedTitle);
    if (wasUpdated) {
      setIsEditing(false);
      setValidationError("");
    }
  }

  function handleCancel() {
    setIsEditing(false);
    setDraftTitle(task.title);
    setValidationError("");
  }

  if (isEditing) {
    return (
      <li
        ref={setNodeRef}
        style={style}
        className={`task-item task-item-editing ${isDragging ? "task-item-dragging" : ""}`}
      >
        <div className="task-edit-form">
          <input
            ref={inputRef}
            type="text"
            value={draftTitle}
            maxLength={120}
            onChange={(event) => {
              setDraftTitle(event.target.value);
              if (validationError) {
                setValidationError("");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSave();
              }

              if (event.key === "Escape") {
                event.preventDefault();
                handleCancel();
              }
            }}
            disabled={disabled}
          />

          <div className="task-edit-actions">
            <button type="button" onClick={handleSave} disabled={disabled}>
              Save
            </button>
            <button type="button" className="secondary-button" onClick={handleCancel} disabled={disabled}>
              Cancel
            </button>
          </div>
        </div>
        {validationError && <p className="error-message">{validationError}</p>}
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`task-item ${isDragging ? "task-item-dragging" : ""}`}
    >
      <label className="task-title">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(event) => onToggleComplete(task._id, event.target.checked)}
          disabled={disabled}
        />
        <span className={task.completed ? "completed" : ""}>{task.title}</span>
      </label>

      <div className="task-actions">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={disabled}
          className="edit-button"
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task._id)}
          disabled={disabled}
          className="delete-button"
          aria-label={`Delete ${task.title}`}
        >
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
            focusable="false"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.75 4.5h10.5" />
            <path d="M5.75 2.75h4.5" />
            <path d="M4 4.5v8a.75.75 0 0 0 .75.75h6.5a.75.75 0 0 0 .75-.75v-8" />
            <path d="M6.5 6.5v4.75" />
            <path d="M9.5 6.5v4.75" />
            <path d="M4 12.5h8" />
          </svg>
        </button>
        <button
          type="button"
          className="drag-handle-button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={`Drag ${task.title}`}
        >
          <span aria-hidden="true" className="drag-icon">
            <svg
              viewBox="0 0 20 20"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 6h14" />
              <path d="M3 14h14" />
            </svg>
          </span>
        </button>
      </div>
    </li>
  );
}

export default TaskItem;

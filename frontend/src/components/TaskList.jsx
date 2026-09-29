import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggleComplete, onDelete, onEditTask, onDragEnd, disabled, filter }) {
  const sensors = useSensors(useSensor(PointerSensor));

  if (tasks.length === 0) {
    const emptyMessage =
      filter === "active"
        ? "No active tasks yet."
        : filter === "completed"
          ? "No completed tasks yet."
          : "No tasks yet. Add your first task.";

    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEditTask={onEditTask}
              disabled={disabled}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

export default TaskList;

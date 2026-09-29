const mongoose = require("mongoose");
const Task = require("../models/Task");

async function getTasks(req, res) {
  const tasks = await Task.find().sort({ position: 1, createdAt: 1 });
  res.status(200).json(tasks);
}

async function createTask(req, res) {
  const { title } = req.body;

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ message: "Task title is required." });
  }

  if (title.trim().length > 120) {
    return res.status(400).json({ message: "Task title must be at most 120 characters." });
  }

  const lastTask = await Task.findOne().sort({ position: -1 }).select("position").lean();
  const nextPosition = lastTask ? lastTask.position + 1 : 0;

  const task = await Task.create({
    title: title.trim(),
    position: nextPosition
  });

  res.status(201).json(task);
}

async function updateTask(req, res) {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task id." });
  }

  const updates = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "Task title cannot be empty." });
    }
    if (title.trim().length > 120) {
      return res.status(400).json({ message: "Task title must be at most 120 characters." });
    }
    updates.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Completed must be a boolean." });
    }
    updates.completed = completed;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update." });
  }

  const task = await Task.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  res.status(200).json(task);
}

async function deleteTask(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task id." });
  }

  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  res.status(200).json({ message: "Task deleted." });
}

async function reorderTasks(req, res) {
  const { taskIds } = req.body;

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({ message: "taskIds must be a non-empty array." });
  }

  const uniqueIds = new Set(taskIds);
  if (uniqueIds.size !== taskIds.length) {
    return res.status(400).json({ message: "taskIds cannot contain duplicates." });
  }

  const hasInvalidId = taskIds.some((id) => !mongoose.Types.ObjectId.isValid(id));
  if (hasInvalidId) {
    return res.status(400).json({ message: "taskIds contains an invalid id." });
  }

  const tasks = await Task.find({ _id: { $in: taskIds } }).select("_id");
  if (tasks.length !== taskIds.length) {
    return res.status(400).json({ message: "One or more tasks were not found." });
  }

  const operations = taskIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { position: index } }
    }
  }));

  await Task.bulkWrite(operations);

  const sortedTasks = await Task.find().sort({ position: 1, createdAt: 1 });
  res.status(200).json(sortedTasks);
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
};

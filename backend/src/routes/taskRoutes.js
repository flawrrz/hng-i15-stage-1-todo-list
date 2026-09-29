const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", asyncHandler(getTasks));
router.post("/", asyncHandler(createTask));
router.patch("/reorder", asyncHandler(reorderTasks));
router.patch("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

module.exports = router;

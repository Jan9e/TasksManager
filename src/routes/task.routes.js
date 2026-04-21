import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;
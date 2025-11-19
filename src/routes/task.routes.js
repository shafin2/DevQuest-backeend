import express from 'express';
import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
  getMyTasks,
} from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.js';
import { pmOnly } from '../middleware/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Task CRUD
router.post('/', createTask); // PM creates task (check in controller)
router.get('/my-tasks', getMyTasks); // Developer gets their assigned tasks
router.get('/project/:projectId', getProjectTasks); // Get all tasks for a project
router.patch('/:id', updateTask); // PM or assigned dev can update
router.delete('/:id', deleteTask); // PM only (checked in controller)

export default router;

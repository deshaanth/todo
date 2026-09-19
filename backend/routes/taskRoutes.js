import express from 'express';
import {
  healthCheck,
  getTasks,
  syncTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/health', healthCheck);
router.get('/tasks', getTasks);
router.post('/tasks/sync', syncTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;

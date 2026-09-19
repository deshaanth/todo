import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// In-Memory Task Database
let tasksDatabase = [];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverless: true, timestamp: new Date().toISOString() });
});

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json({ tasks: tasksDatabase });
});

// POST sync tasks batch
app.post('/api/tasks/sync', (req, res) => {
  const { tasks } = req.body;
  if (Array.isArray(tasks)) {
    tasksDatabase = tasks;
  }
  res.json({ status: 'success', syncedCount: tasksDatabase.length, timestamp: Date.now() });
});

// POST create single task
app.post('/api/tasks', (req, res) => {
  const newTask = req.body;
  tasksDatabase.unshift(newTask);
  res.status(201).json({ status: 'created', task: newTask });
});

// PUT update single task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasksDatabase.findIndex(t => t.task_id === id);
  if (index !== -1) {
    tasksDatabase[index] = { ...tasksDatabase[index], ...req.body };
    res.json({ status: 'updated', task: tasksDatabase[index] });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// DELETE single task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasksDatabase = tasksDatabase.filter(t => t.task_id !== id);
  res.json({ status: 'deleted', id });
});

export default app;

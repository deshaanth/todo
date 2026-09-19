// In-Memory Task Database & Controller Logic

let tasksDatabase = [];

export const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    serverless: true,
    timestamp: new Date().toISOString()
  });
};

export const getTasks = (req, res) => {
  res.json({ tasks: tasksDatabase });
};

export const syncTasks = (req, res) => {
  const { tasks } = req.body;
  if (Array.isArray(tasks)) {
    tasksDatabase = tasks;
  }
  res.json({
    status: 'success',
    syncedCount: tasksDatabase.length,
    timestamp: Date.now()
  });
};

export const createTask = (req, res) => {
  const newTask = req.body;
  tasksDatabase.unshift(newTask);
  res.status(201).json({ status: 'created', task: newTask });
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const index = tasksDatabase.findIndex(t => t.task_id === id);
  if (index !== -1) {
    tasksDatabase[index] = { ...tasksDatabase[index], ...req.body };
    res.json({ status: 'updated', task: tasksDatabase[index] });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  tasksDatabase = tasksDatabase.filter(t => t.task_id !== id);
  res.json({ status: 'deleted', id });
};

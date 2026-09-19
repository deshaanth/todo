import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount API routes under /api
app.use('/api', taskRoutes);

export default app;

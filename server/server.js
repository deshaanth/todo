// Express & Node.js Local Server Entrypoint
import app from '../api/index.js';
import { createServer } from 'http';

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`🚀 SmartTask Real-Time Sync Backend running at http://localhost:${PORT}`);
});

import express, { NextFunction, Request, Response } from 'express';
import { router as apiRouter } from './routes/api.js';
import TApiResponse from './models/api-response.js';
import { logError, logInfo } from './lib/logger.js';

const app = express();

const port = 3000;

app.use('/api', apiRouter);

// for handling a possible 404 error
app.use((req: Request, res: Response<TApiResponse>, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});

// global error handler, the apis can pass their unexpected internal errors to be handler here
app.use((err: Error, req: Request, res: Response<TApiResponse>, next: NextFunction) => {
  logError(err.stack);
  res.status(500).json( {message: err.message });
});

app.listen(port, () => {
  logInfo(`service listening on port ${port}`)
});

export default app;

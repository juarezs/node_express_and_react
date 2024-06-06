import express from 'express';
import { router as filesRouter } from './api/files.js';
import { router as usersRouter } from './api/users.js';

export const router = express.Router();
router.use('/files', filesRouter);
router.use('/users', usersRouter);

import { Request, Response } from 'express';
import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from './app.js';
import TApiResponse from './models/api-response.js';
import TDataResponse from './models/data-response.js';
import TUser from './models/user.js';

describe('Express App', () => {

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Not Found' });
  });

  it('should return handle error', async () => {
    
    vi.mock('./routes/api.js', async (importOriginal) => {
      return {
        ...await importOriginal<typeof import('./routes/api.js')>(),
        router: (req: Request, res: Response<TApiResponse | TDataResponse<TUser[]>>) => {throw new Error('the error')}
      }
    });

    const response = await request(app).get('/api/users');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'the error' });
  });
});

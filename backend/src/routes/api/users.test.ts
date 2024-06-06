import { describe, expect, it, vi } from 'vitest';
import TUser from '../../models/user.js';
import { createRequest, createResponse } from 'node-mocks-http';
import { Request, Response } from 'express';
import db from '../../lib/db.js';
import { getUsers } from './users.js';
import TDataResponse from '../../models/data-response.js';

vi.spyOn(db, 'all');
vi.mock('../../lib/db.js', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('../../lib/db.js')>(),
    all: vi.fn()
  }
});

const users: TUser[] = [
  {
      'name': 'John Doe',
      'city': 'New York',
      'country': 'USA',
      'favorite_sport': 'Basketball'
  },
  {
      'name': 'Jane Smith',
      'city': 'London',
      'country': 'UK',
      'favorite_sport': 'Football'
  },
  {
      'name': 'Mike Johnson',
      'city': 'Paris',
      'country': 'France',
      'favorite_sport': 'Tennis'
  },
  {
      'name': 'Karen Lee',
      'city': 'Tokyo',
      'country': 'Japan',
      'favorite_sport': 'Swimming'
  },
  {
      'name': 'Tom Brown',
      'city': 'Sydney',
      'country': 'Australia',
      'favorite_sport': 'Running'
  },
  {
      'name': 'Emma Wilson',
      'city': 'Berlin',
      'country': 'Germany',
      'favorite_sport': 'Basketball'
  }
];

describe('GET /users', () => {

  it('should return a list of all users', async () => {    
    const req = createRequest<Request>({
      method: 'GET',
      url: '/users',
    });
    const res = createResponse<Response>();
    const next = vi.fn();

    const dbAllMock = db.all as ReturnType<typeof vi.fn>;
    dbAllMock.mockResolvedValue(users);

    await getUsers(req, res, next);

    expect(dbAllMock).toHaveBeenLastCalledWith('SELECT * FROM users');
    
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ data: users } as TDataResponse<TUser[]>);
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should return a list of users with one keyword filter', async () => {    
    const req = createRequest<Request>({
      method: 'GET',
      url: '/users',
      query: { q: 'john'}
    });
    const res = createResponse<Response>();
    const next = vi.fn();

    const dbAllMock = db.all as ReturnType<typeof vi.fn>;
    dbAllMock.mockResolvedValue(users);

    await getUsers(req, res, next);

    expect(dbAllMock).toHaveBeenLastCalledWith(
      `SELECT * FROM users WHERE  (name LIKE '%' || ? || '%' OR city LIKE '%' || ? || '%' OR country LIKE '%' || ? || '%' OR favorite_sport LIKE '%' || ? || '%')`,
      'john', 'john', 'john', 'john'
    );
    
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ data: users } as TDataResponse<TUser[]>);
  });

  it('should return a list of users with multiple keywords filter', async () => {    
    const req = createRequest<Request>({
      method: 'GET',
      url: '/users',
      query: { q: ['john', 'usa']}
    });
    const res = createResponse<Response>();
    const next = vi.fn();

    const dbAllMock = db.all as ReturnType<typeof vi.fn>;
    dbAllMock.mockResolvedValue(users);

    await getUsers(req, res, next);

    expect(dbAllMock).toHaveBeenLastCalledWith(
      `SELECT * FROM users WHERE  (name LIKE '%' || ? || '%' OR city LIKE '%' || ? || '%' OR country LIKE '%' || ? || '%' OR favorite_sport LIKE '%' || ? || '%') AND  (name LIKE '%' || ? || '%' OR city LIKE '%' || ? || '%' OR country LIKE '%' || ? || '%' OR favorite_sport LIKE '%' || ? || '%')`,
      'john', 'john', 'john', 'john', 'usa', 'usa', 'usa', 'usa'
    );
    
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ data: users } as TDataResponse<TUser[]>);
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should return pass error to global error handler', async () => {    
    const req = createRequest<Request>({
      method: 'GET',
      url: '/users',
    });
    const res = createResponse<Response>();
    const next = vi.fn();

    const dbAllMock = db.all as ReturnType<typeof vi.fn>;
    dbAllMock.mockRejectedValue('some error');

    await getUsers(req, res, next);

    expect(dbAllMock).toHaveBeenLastCalledWith('SELECT * FROM users');    
    expect(next).toHaveBeenCalledWith('some error');
  });

});
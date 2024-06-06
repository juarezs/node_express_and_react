import express, { NextFunction, Request, Response } from 'express';
import TApiResponse from '../../models/api-response.js';
import TUser from '../../models/user.js';
import db from '../../lib/db.js';
import TDataResponse from '../../models/data-response.js';

export const router = express.Router();

export const getUsers = async (req: Request, res: Response<TApiResponse | TDataResponse<TUser[]>>, next: NextFunction) => {
  try {
    // it expects a "q" query string parameter for filtering.
    // it can be either a single param or multiple params with same name, for filtering by multiple keywords

    const query: string = req.query.q as string ?? '';
    const filters: string[] = query ? (Array.isArray(query) ? [...query] : [query]) : [];
    const params: string[] = [];

    let sql: string = 'SELECT * FROM users';
    let where: string = '';
    for (let filter of filters) {
      if (where) {
        where = `${where} AND `;
      }
      where = `${where} (name LIKE '%' || ? || '%' OR city LIKE '%' || ? || '%' OR country LIKE '%' || ? || '%' OR favorite_sport LIKE '%' || ? || '%')`
      // adds the same filter for each placeholder from line above
      params.push(filter);
      params.push(filter);
      params.push(filter);
      params.push(filter);
    }
    if (where) {
      sql = `${sql} WHERE ${where}`;
    }
    
    const users = await db.all<TUser[]>(sql, ...params);
    
    res.status(200).json({ data: users });

  } catch (err) {
    // let global error handler to handle unexpected errors
    next(err);
  }
}

router.get('/', getUsers);

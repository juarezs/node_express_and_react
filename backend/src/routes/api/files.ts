import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { parse } from 'csv-parse';
import TApiResponse from '../../models/api-response.js';
import multer from 'multer';
import TUser from '../../models/user.js';
import path from 'path';
import db from '../../lib/db.js';
import { logWarn } from '../../lib/logger.js';

// to read info from .env file
dotenv.config();

// determine the temporary folder to save uploaded files
const dest = process.env.UPLOAD_DIR ?? '/tmp/upload/';

const upload = multer({dest});

export const router = express.Router();

export const postFiles = async (req: Request, res: Response<TApiResponse>, next: NextFunction) => {
  try {
    const users: TUser[] = [];

    if (!req.file) {
      return res.status(400).json({ message: 'File is missing.'});
    }

    // setup the csv parser
    const filePath = path.join(req.file.path);
    const parser = fs.createReadStream(filePath).pipe(parse({
      delimiter: ',',
      columns: true,
      trim: true,
      skipEmptyLines: true,
    }));


    parser.on('data', (user) => {
      users.push(user);
    });

    parser.on('end', async () => {
      // once it finishes reading the file, clear users table and inserts the new users.
      // I'm assuming previous uploaded users should not be preserved, according to this requirement:
      //   "build a web application that allows users to load a CSV file with preformatted data
      //    and display THAT data as cards on the website being able to filter the data."
      try {
        await db.exec('DELETE FROM users');

        const stmt = await db.prepare('INSERT INTO users (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)');
        users.forEach(async user => {
          await stmt.run(user.name, user.city, user.country, user.favorite_sport);
        });
        await stmt.finalize();

        // Delete the temporary file
        fs.unlink(filePath, (e) => {
          if (e) {
            logWarn('Error when trying to delete the temporary file: ', filePath, e);
          }
        });

        res.status(200).json({ message: 'The file was uploaded successfully.' });
      }
      catch (e) {
        next(e);
      }
    });

    parser.on('error', (error) => {
      // let global error handler to handle unexpected errors
      next(error);
    });

  } catch (err) {
    // let global error handler to handle unexpected errors
    next(err);
  }
}

router.post('/', upload.single('file'), postFiles);

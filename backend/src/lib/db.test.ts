import { describe, it, expect, beforeEach } from 'vitest';
import db from './db.js'
import TUser from '../models/user.js';

describe('SQLite db', () => {
  beforeEach(async () => {
    await db.exec('DELETE FROM users');
  });

  it('should insert and select records', async () => {
    const input: TUser[] = [
      {name: 'user1', city: 'city1', country: 'country1', favorite_sport: 'sport1'},
      {name: 'user2', city: 'city2', country: 'country2', favorite_sport: 'sport2'}
    ];

    const stmt = await db.prepare('INSERT INTO users (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)');
    input.forEach(async user => {
      await stmt.run(user.name, user.city, user.country, user.favorite_sport);
    });
    await stmt.finalize();

    const users = await db.all<TUser[]>('SELECT * FROM users');
    expect(users).toStrictEqual(input);
  });

});

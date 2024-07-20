import { describe, expect, it } from 'vitest';
import winston from 'winston';

describe('logger util', () => {
  it.only('should initialize properly', async () => {
    expect(winston.transports.Console).not.toBeNull;
  });

});

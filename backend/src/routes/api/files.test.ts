import { describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import fs from 'fs';
import db from '../../lib/db.js';
import path from 'path';
import TApiResponse from '../../models/api-response.js';
import { Request, Response } from 'express';
import { postFiles } from './files.js';
import { Readable } from 'stream';

vi.spyOn(db, 'exec');
vi.spyOn(db, 'prepare');
vi.mock('../../lib/db.js', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('../../lib/db.js')>(),
    exec: vi.fn(),
    prepare: vi.fn()
  }
});

vi.mock('fs');

describe('POST /files', () => {

  it('should upload the csv file successfully', async () => {

    const csvFileContent = `name,city,country,favorite_sport
      John Doe,New York,USA,Basketball
      Jane Smith,London,UK,Football
      Mike Johnson,Paris,France,Tennis
      Karen Lee,Tokyo,Japan,Swimming
      Tom Brown,Sydney,Australia,Running
      Emma Wilson,Berlin,Germany,Basketball


    `;
    
    const csvFileName = 'test1.csv';
    const csvFilePath = path.join(__dirname, 'tmp');
    const csvFileFullPath = path.join(csvFilePath, csvFileName);

    const mockStream = Readable.from(csvFileContent);
    const mockReadStream = fs.createReadStream as ReturnType<typeof vi.fn>;
    mockReadStream.mockReturnValue(mockStream);

    const req = createRequest<Request>({
      method: 'POST',
      url: '/files',
      headers: {
        'content-type': 'multipart/form-data',
      },
      file: {
        fieldname: 'file',
        originalname: csvFileName,
        encoding: '7bit',
        mimetype: 'text/csv',
        destination: 'tmp/',
        filename: csvFileName,
        path: csvFileFullPath,
        size: 234,
        buffer: Buffer.from(csvFileContent),
      },
    });

    const res = createResponse<Response>({
      eventEmitter: require('events').EventEmitter
    });
    const next = vi.fn();

    const dbExecMock = db.exec as ReturnType<typeof vi.fn>;
    dbExecMock.mockResolvedValue({});

    const stmtFinalizeMock = vi.fn();
    const stmtRunMock = vi.fn();
    const stmt = {
      finalize: stmtFinalizeMock,
      run: stmtRunMock,
    };

    const dbPrepareMock = db.prepare as ReturnType<typeof vi.fn>;
    dbPrepareMock.mockResolvedValue(stmt);

    postFiles(req, res, next);

    await new Promise((resolve) => res.on('end', resolve));

    expect(dbExecMock).toHaveBeenCalledWith('DELETE FROM users');

    expect(dbPrepareMock).toHaveBeenCalledWith('INSERT INTO users (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)');

    expect(stmtRunMock).toHaveBeenCalledWith('John Doe', 'New York', 'USA', 'Basketball');
    expect(stmtRunMock).toHaveBeenCalledWith('Jane Smith', 'London', 'UK', 'Football');
    expect(stmtRunMock).toHaveBeenCalledWith('Mike Johnson', 'Paris', 'France', 'Tennis');
    expect(stmtRunMock).toHaveBeenCalledWith('Karen Lee', 'Tokyo', 'Japan', 'Swimming');
    expect(stmtRunMock).toHaveBeenCalledWith('Tom Brown', 'Sydney', 'Australia', 'Running');
    expect(stmtRunMock).toHaveBeenCalledWith('Emma Wilson', 'Berlin', 'Germany', 'Basketball');

    expect(stmtFinalizeMock).toHaveBeenCalled();
    
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ message: 'The file was uploaded successfully.' } as TApiResponse);
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should handle invalid csv format error', async () => {

    const csvFileContent = `name,city,country,favorite_sport
      John Doe
      Jane Smith,UK,Football
      Mike Johnson,Paris,France,Tennis


    `;
    
    const csvFileName = 'test1.csv';
    const csvFilePath = path.join(__dirname, 'tmp');
    const csvFileFullPath = path.join(csvFilePath, csvFileName);

    const mockStream = Readable.from(csvFileContent);
    mockStream.addListener('data', () => {
      mockStream.emit('error', new Error('Invalid Record Length: columns length is 4, got 2 on line 2'));
    });

    const mockReadStream = fs.createReadStream as ReturnType<typeof vi.fn>;
    mockReadStream.mockReturnValue(mockStream);

    const req = createRequest<Request>({
      method: 'POST',
      url: '/files',
      headers: {
        'content-type': 'multipart/form-data',
      },
      file: {
        fieldname: 'file',
        originalname: csvFileName,
        encoding: '7bit',
        mimetype: 'text/csv',
        destination: 'tmp/',
        filename: csvFileName,
        path: csvFileFullPath,
        size: 234,
        buffer: Buffer.from(csvFileContent),
      },
    });

    const res = createResponse<Response>({
      eventEmitter: require('events').EventEmitter
    });
    const next = vi.fn();

    const dbExecMock = db.exec as ReturnType<typeof vi.fn>;
    dbExecMock.mockResolvedValue({});

    const stmtFinalizeMock = vi.fn();
    const stmtRunMock = vi.fn();
    const stmt = {
      finalize: stmtFinalizeMock,
      run: stmtRunMock,
    };

    const dbPrepareMock = db.prepare as ReturnType<typeof vi.fn>;
    dbPrepareMock.mockResolvedValue(stmt);

    postFiles(req, res, next);

    await new Promise((resolve) => mockStream.on('error', resolve));

    expect(next).toHaveBeenCalled();
    
    expect(res.statusCode).toBe(200);
  });

  it('should handle an unexpected error', async () => {

    const csvFileContent = `name,city,country,favorite_sport
      John Doe,New York,USA,Basketball
      Jane Smith,London,UK,Football
      Mike Johnson,Paris,France,Tennis
      Karen Lee,Tokyo,Japan,Swimming
      Tom Brown,Sydney,Australia,Running
      Emma Wilson,Berlin,Germany,Basketball


    `;
    
    const csvFileName = 'test1.csv';
    const csvFilePath = path.join(__dirname, 'tmp');
    const csvFileFullPath = path.join(csvFilePath, csvFileName);

    const mockStream = Readable.from(csvFileContent);

    const mockReadStream = fs.createReadStream as ReturnType<typeof vi.fn>;
    mockReadStream.mockReturnValue(mockStream);

    const req = createRequest<Request>({
      method: 'POST',
      url: '/files',
      headers: {
        'content-type': 'multipart/form-data',
      },
      file: {
        fieldname: 'file',
        originalname: csvFileName,
        encoding: '7bit',
        mimetype: 'text/csv',
        destination: 'tmp/',
        filename: csvFileName,
        path: csvFileFullPath,
        size: 234,
        buffer: Buffer.from(csvFileContent),
      },
    });

    const res = createResponse<Response>({
      eventEmitter: require('events').EventEmitter
    });
    const next = vi.fn();

    const dbExecMock = db.exec as ReturnType<typeof vi.fn>;
    dbExecMock.mockRejectedValue('some error');

    const stmtFinalizeMock = vi.fn();
    const stmtRunMock = vi.fn();
    const stmt = {
      finalize: stmtFinalizeMock,
      run: stmtRunMock,
    };

    const dbPrepareMock = db.prepare as ReturnType<typeof vi.fn>;
    dbPrepareMock.mockResolvedValue(stmt);

    postFiles(req, res, next);

    await vi.waitFor(
      () => {
        expect(next).toHaveBeenCalled();
        
      }
    );

  });

  it('should fail if no file is provided', async () => {

    const req = createRequest<Request>({
      method: 'POST',
      url: '/files',
      headers: {
        'content-type': 'multipart/form-data',
      },
    });

    const res = createResponse<Response>({
      eventEmitter: require('events').EventEmitter
    });
    const next = vi.fn();
    
    postFiles(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({ message: 'File is missing.'} as TApiResponse);
  });

});
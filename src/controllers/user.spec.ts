import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { login } from './user';
import { AppError } from '../middleware/error';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/user');

const mockUserData = {
  _id: 'user123',
  email: 'test@example.com',
  password: 'hashedPassword123',
  name: 'Test User',
};

describe('user controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('login', () => {
    it("should reject request if user doesn't exist", async () => {
      mockRequest.body = {
        ...mockUserData,
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      await login(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it("should reject request if password doesn't match", async () => {
      mockRequest.body = {
        ...mockUserData,
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUserData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await login(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should reject request if exception occurs', async () => {
      mockRequest.body = {
        ...mockUserData,
      };
      const dbError = new Error('Database connection failed');
      (User.findOne as jest.Mock).mockRejectedValue(dbError);

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should return 200 when login successfully', async () => {
      mockRequest.body = {
        ...mockUserData,
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUserData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockResolvedValue('this_is_my_token');
      await login(mockRequest as Request, mockResponse as Response, mockNext);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockRequest.body.password,
        mockUserData.password
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('register', () => {
    // later, write test cases
  });
  describe('logout', () => {
    // later, write test cases
  });
});

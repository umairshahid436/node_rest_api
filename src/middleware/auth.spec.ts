import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BlacklistedToken } from '../models/token';
import { isAuthenticated } from './auth';
import { AppError } from './error';
import { SECRET } from '../utils/constants';

// Mock the jwt module
jest.mock('jsonwebtoken');

// Mock the BlacklistedToken model
jest.mock('../models/token');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authentication middleware', () => {
    it('should reject requests without authentication token', async () => {
      await isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should reject requests with blacklisted tokens', async () => {
      const token = 'valid.token.here';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      (BlacklistedToken.findOne as jest.Mock).mockResolvedValue({ token });

      await isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should reject requests with invalid tokens', async () => {
      const token = 'invalid.token.here';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      (BlacklistedToken.findOne as jest.Mock).mockResolvedValue(null);
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should allow authenticated requests with valid tokens', async () => {
      const token = 'valid.token.here';
      const mockUser = { id: '123', email: 'test@example.com' };
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      (BlacklistedToken.findOne as jest.Mock).mockResolvedValue(null);
      (jwt.verify as jest.Mock).mockReturnValue(mockUser);

      await isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.user).toEqual(mockUser);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should reject requests with malformed authorization headers', async () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat',
      };

      await isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      const error = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });
  });
});

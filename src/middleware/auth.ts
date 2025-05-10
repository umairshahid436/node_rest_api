import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BlacklistedToken } from '../models/token';
import { AppError } from './error';
import { SECRET } from '../utils/constants';
import { User } from '../types/user';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('Not authenticated', 401);
    }

    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      throw new AppError('Not authenticated', 401);
    }

    const decoded = jwt.verify(token, SECRET) as User;
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

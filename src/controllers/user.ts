import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { BlacklistedToken } from '../models/token';
import { LoginRequestBody, RegisterRequestBody } from '../types/user';
import { AppError } from '../middleware/error';
import { SECRET } from '../utils/constants';

type RequestWithBody<T> = Request<{}, {}, T>;

export const login = async (
  req: RequestWithBody<LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }
    const { email, _id } = user;
    const token = jwt.sign({ userId: _id, email }, SECRET, {
      expiresIn: '24h',
    });
    res.status(200).json({
      data: {
        token,
        email,
        userId: _id,
        name: user?.name,
      },
      message: 'Login successfully',
    });
  } catch (err: unknown) {
    next(err);
  }
};

export const register = async (
  req: RequestWithBody<RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw new AppError('User already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      data: {
        email,
        name: name,
      },
      message: 'Register successfully',
    });
  } catch (err: unknown) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401);
    }
    await BlacklistedToken.create({ token });

    res.status(200).json({
      data: null,
      message: 'Logged out successfully',
    });
  } catch (err: unknown) {
    next(err);
  }
};

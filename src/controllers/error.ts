import { Request, Response, NextFunction } from 'express';

export const pageNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({ data: null, message: 'Not found' });
};

import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long')
    .trim(),
];

export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long')
    .trim(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ data: null, errors: errors.array() });
  } else next();
};

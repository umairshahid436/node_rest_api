import { Router } from 'express';
import { login, logout, register } from '../controllers/user';
import {
  validateLogin,
  validateRegister,
  validateRequest,
} from '../middleware/validators';

const router = Router();

router.post('/login', validateLogin, validateRequest, login);
router.post('/register', validateRegister, validateRequest, register);
router.post('/logout', logout);

export { router as userRoutes };

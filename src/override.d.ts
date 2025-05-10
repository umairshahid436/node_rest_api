import 'express-session';
import { JwtPayload } from 'jsonwebtoken';

import { User } from './types/user';

declare module 'express-session' {
  interface Session {
    isLoggedIn: boolean;
    user: Omit<User, 'password'>;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

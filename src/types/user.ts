import { ObjectId } from 'mongodb';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface User {
  id: string | ObjectId;
  name: string;
  email: string;
  password: string;
}

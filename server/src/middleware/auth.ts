import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User, IUser } from '../models/User.js';
import { AppError } from './errorHandler.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
  role: string;
}

export async function protect(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new AppError('Not authorized. Please log in.', 401));
    }

    const decoded = jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
    const user = await User.findById(decoded.id).select('+password');

    if (!user || !user.isActive) {
      return next(new AppError('User no longer exists or is deactivated.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Not authorized. Please log in.', 401));
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token =
    req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : req.cookies?.accessToken;

  if (!token) return next();

  jwt.verify(token, env.jwtAccessSecret, async (err, decoded) => {
    if (!err && decoded) {
      const payload = decoded as JwtPayload;
      const user = await User.findById(payload.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  });
}

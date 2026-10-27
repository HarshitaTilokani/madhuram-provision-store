import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function generateAccessToken(id: string, role: string): string {
  return jwt.sign({ id, role }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn as any,
  });
}

export function generateRefreshToken(id: string, role: string): string {
  return jwt.sign({ id, role }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as any,
  });
}

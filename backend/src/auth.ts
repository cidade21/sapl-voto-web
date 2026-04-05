import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { findUserById, sanitizeUser } from './store.js';
import { PublicUser, UserRecord } from './types.js';

const secret: Secret = process.env.JWT_SECRET || 'sapl-votacao-dev-secret';
const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

interface AuthTokenPayload {
  sub: string;
}

export const createToken = (user: UserRecord) =>
  jwt.sign({ sub: String(user.id) }, secret, { expiresIn });

export const verifyToken = (token: string): PublicUser | null => {
  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    const userId = typeof payload.sub === 'string' ? Number(payload.sub) : NaN;
    const user = Number.isFinite(userId) ? findUserById(userId) : null;
    return user ? sanitizeUser(user) : null;
  } catch {
    return null;
  }
};

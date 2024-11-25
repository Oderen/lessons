import { sign } from 'jsonwebtoken';

export const generateRefreshToken = (userId: string) => {
  return sign({ id: userId }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
  });
};

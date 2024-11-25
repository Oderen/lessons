import { sign } from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
  return sign({ id: userId }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
  });
};

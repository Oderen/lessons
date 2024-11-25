import { generateAccessToken } from './generate-access-token';
import { generateRefreshToken } from './generate-refresh-token';

export const generateJwt = (
  userId: string,
): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return { accessToken, refreshToken };
};

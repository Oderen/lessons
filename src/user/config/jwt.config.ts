import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
  ACCESS_JWT_EXPIRES: process.env.ACCESS_JWT_EXPIRES,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  REFRESH_JWT_EXPIRES_IN: process.env.REFRESH_JWT_EXPIRES_IN,
}));

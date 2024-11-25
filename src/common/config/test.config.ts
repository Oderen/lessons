import { registerAs } from '@nestjs/config';

export default registerAs('test', () => ({
  APP_ACCESS_SECRET: process.env.APP_ACCESS_SECRET,
  APP_JWT_EXPIRES_IN: process.env.APP_JWT_EXPIRES_IN,
}));

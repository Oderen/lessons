import { config } from 'dotenv';
import { resolve } from 'path';
import { generateJwt } from './generate-jwt';

describe('generateJwt', () => {
  beforeEach(() => {
    const testEnvPath = resolve(process.cwd(), '.env.test');
    config({ path: testEnvPath });
  });

  it('should return access and refresh tokens', () => {
    const userId = '1';

    const { accessToken, refreshToken } = generateJwt(userId);
    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
  });
});

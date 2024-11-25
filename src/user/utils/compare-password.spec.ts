import { compareHashPassword } from './compare-password';

describe('compare-hash-password', () => {
  it('should return true when the password and salt is the same as hashPassowrd', () => {
    const password = 'test';
    const salt = BigInt(123);

    // you can generate more test case using the
    // https://emn178.github.io/online-tools/sha256.html
    const result = compareHashPassword({
      password,
      salt,
      currentHashPassword:
        'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae',
    });

    expect(result).toEqual(true);
  });
  it('should return false when the password and salt is the same as hashPassowrd', () => {
    const password = 'test1';
    const salt = BigInt(123);

    const result = compareHashPassword({
      password,
      salt,
      currentHashPassword:
        'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae',
    });

    expect(result).toEqual(false);
  });
});

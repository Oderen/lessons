import { hashPassword } from './hash-password';

describe('hash-password', () => {
  it('should return correct hash', () => {
    const password = 'test';
    const salt = BigInt(123);

    const hash = hashPassword({ password, salt });

    expect(hash).toEqual(
      'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae',
    );
  });
});

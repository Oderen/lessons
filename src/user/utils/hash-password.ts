import { createHash } from 'node:crypto';

// the funcion do only 1 thing, and has simple input
export const hashPassword = ({
  password,
  salt,
}: {
  password: string;
  salt: bigint;
}): string => {
  const hash = createHash('sha256');
  hash.update(password + salt);

  return hash.digest('hex');
};

import { hashPassword } from './hash-password';

export const compareHashPassword = ({
  password,
  salt,
  currentHashPassword,
}: {
  password: string;
  salt: bigint;
  currentHashPassword: string;
}): boolean => {
  const hash = hashPassword({ password, salt });

  return hash === currentHashPassword;
};

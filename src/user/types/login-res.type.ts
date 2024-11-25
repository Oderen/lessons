import { ErrorResponse } from './unexpected-error-res.type';

type UserNotFoundRes = {
  outcome: 'USER_NOT_FOUND';
};

type PasswordIncorrectRes = {
  outcome: 'PASSWORD_INCORRENT';
};

type SuccessResponse = {
  outcome: 'SUCCESS';
  payload: { userId: string; accessToken: string; refreshToken: string };
};

type TokenAlreadyExistResponse = {
  outcome: 'TOKEN_ALREADY_EXSISTS';
  payload: { userId: string; accessToken: string; refreshToken: string };
};

export type LoginRes =
  | TokenAlreadyExistResponse
  | ErrorResponse
  | UserNotFoundRes
  | PasswordIncorrectRes
  | SuccessResponse;

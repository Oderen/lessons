import { ErrorResponse } from './unexpected-error-res.type';

export type GetUserNotFoundError = {
  outcome: 'USER_NOT_FOUND';
};

type GetUserSuccessResponse = {
  outcome: 'SUCCESS';
  payload: { id: string; balance: string; username: string };
};

export type GetUserProfileRes =
  | GetUserNotFoundError
  | GetUserSuccessResponse
  | ErrorResponse;

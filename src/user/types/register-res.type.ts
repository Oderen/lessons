import { ErrorResponse } from './unexpected-error-res.type';

type UserIsTakenErrorRes = {
  outcome: 'USERNAME_IS_TAKEN';
};

export type SuccessResponse = {
  outcome: 'SUCCESS';
  payload: { userId: string };
};

export type RegisterRes = UserIsTakenErrorRes | ErrorResponse | SuccessResponse;

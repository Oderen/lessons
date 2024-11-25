export class LoginResDto {
  status: 'SUCCESS' | 'TOKEN_ALREADY_EXSISTS';
  payload: { userId: string; accessToken: string; refreshToken: string };
}

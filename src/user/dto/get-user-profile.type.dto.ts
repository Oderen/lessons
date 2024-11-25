import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserProfileDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}

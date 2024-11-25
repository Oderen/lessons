import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Bob' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: '200' })
  @IsNotEmpty()
  @IsString()
  initinal_deposit: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}

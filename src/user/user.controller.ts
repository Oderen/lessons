import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserResDto } from './dto/response/register-response.dto';
import { LoginResDto } from './dto/response/login-res.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GetUserResDto } from './dto/response/get-user-res.dto';
import { ValidUser } from 'src/common/guards/auth.guard';
import { GetUserProfileApi } from './swagger/swagger-apis';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @GetUserProfileApi()
  @Get('me/:id')
  @UseGuards(ValidUser)
  async getUserProfile(@Param('id') userId: string): Promise<GetUserResDto> {
    const response: any = await this.userService.getUserProfile(userId);

    switch (response.outcome) {
      case 'SUCCESS':
        return { status: response.outcome, payload: response.payload };
      case 'USER_NOT_FOUND':
        throw new NotFoundException(response.outcome);
      case 'UNEXPECTED_ERROR':
        throw new InternalServerErrorException(response.outcome);
    }
  }

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<RegisterUserResDto> {
    const registerRes = await this.userService.register(registerUserDto);

    switch (registerRes.outcome) {
      case 'SUCCESS':
        return { status: registerRes.outcome, payload: registerRes.payload };
      case 'USERNAME_IS_TAKEN':
        throw new UnprocessableEntityException(registerRes.outcome);
      case 'UNEXPECTED_ERROR':
        throw new InternalServerErrorException(registerRes.outcome);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'The user login successfully',
    type: LoginResDto,
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResDto> {
    const loginRes = await this.userService.login(loginUserDto);

    switch (loginRes.outcome) {
      case 'SUCCESS':
      case 'TOKEN_ALREADY_EXSISTS':
        return {
          status: loginRes.outcome,
          payload: loginRes.payload,
        };
      case 'USER_NOT_FOUND':
        throw new NotFoundException(loginRes.outcome);
      case 'UNEXPECTED_ERROR':
        throw new InternalServerErrorException(loginRes.outcome);
    }
  }
}

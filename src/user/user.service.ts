import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { hashPassword } from './utils/hash-password';
import { compareHashPassword } from './utils/compare-password';
import { RegisterRes } from './types/register-res.type';
import { LoginRes } from './types/login-res.type';
import { generateJwt } from './utils/jwt/generate-jwt';
import { UserTokenEntity } from 'src/database/entities/user-token.entity';
import { ConfigType } from '@nestjs/config';
import jwtConfiguration from './config/jwt.config';
import { generateAccessToken } from './utils/jwt/generate-access-token';
import { GetUserProfileRes } from './types/get-user-res.type';

@Injectable()
export class UserService {
  constructor(
    @Inject(jwtConfiguration.KEY)
    private jwtConfig: ConfigType<typeof jwtConfiguration>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserTokenEntity)
    private userTokenRepository: Repository<UserTokenEntity>,
  ) {}

  async getUserProfile(userId: string): Promise<GetUserProfileRes> {
    try {
      const userByUserId = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'balance', 'username'],
      });

      if (!userByUserId) {
        return { outcome: 'USER_NOT_FOUND' };
      }

      const { id, balance, username } = userByUserId;
      return { outcome: 'SUCCESS', payload: { id, balance, username } };
    } catch (e) {
      console.log('[getUserProfile] Error: ', e.message);
      return { outcome: 'UNEXPECTED_ERROR', errorMessage: e.message };
    }
  }

  async register(createUserDto: RegisterUserDto): Promise<RegisterRes> {
    try {
      const userByUsername = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (userByUsername) {
        return {
          outcome: 'USERNAME_IS_TAKEN',
        };
      }

      const currentTime = new Date().getTime();
      const newUser = new UserEntity();
      newUser.salt = BigInt(currentTime);
      newUser.password = hashPassword({
        password: createUserDto.password,
        salt: newUser.salt,
      });
      newUser.balance = createUserDto.initinal_deposit;
      newUser.username = createUserDto.username;
      newUser.id = currentTime.toString() + '_' + newUser.username[2];
      await this.userRepository.save(newUser);

      return {
        outcome: 'SUCCESS',
        payload: { userId: newUser.id },
      };
    } catch (e) {
      console.log('Error: ', e.message);
      return {
        outcome: 'UNEXPECTED_ERROR',
        errorMessage: e.message,
      };
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginRes> {
    try {
      const userByUsername = await this.userRepository.findOne({
        where: { username: loginUserDto.username },
        select: ['id', 'username', 'password', 'salt'],
      });

      if (!userByUsername) {
        return { outcome: 'USER_NOT_FOUND' };
      }

      const isPasswordCorrent = compareHashPassword({
        password: loginUserDto.password,
        salt: userByUsername.salt,
        currentHashPassword: userByUsername.password,
      });

      if (!isPasswordCorrent) {
        return { outcome: 'PASSWORD_INCORRENT' };
      }

      const { accessToken, refreshToken } = generateJwt(userByUsername.id);
      const userTokenById = await this.userTokenRepository.findOne({
        where: { id: userByUsername.id },
        select: ['id', 'refreshToken'],
      });

      if (userTokenById) {
        return {
          outcome: 'TOKEN_ALREADY_EXSISTS',
          payload: {
            userId: userTokenById.id,
            accessToken,
            refreshToken: userTokenById.refreshToken,
          },
        };
      }

      const newUserToken = new UserTokenEntity();
      newUserToken.userId = userByUsername.id;
      newUserToken.refreshToken = refreshToken;

      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setDate(
        currentDate.getDate() + Number(this.jwtConfig.REFRESH_JWT_EXPIRES_IN),
      );

      newUserToken.expiresIn = expiryDate;
      newUserToken.id =
        currentDate.getTime().toString() +
        this.jwtConfig.REFRESH_JWT_EXPIRES_IN +
        '_' +
        userByUsername.id;

      this.userTokenRepository.save(newUserToken);

      return {
        outcome: 'SUCCESS',
        payload: { userId: userByUsername.id, accessToken, refreshToken },
      };
    } catch (e) {
      console.log('Error: ', e.message);
      return {
        outcome: 'UNEXPECTED_ERROR',
        errorMessage: e.message,
      };
    }
  }

  async generateRefreshToken(refreshToken: string) {
    try {
      const userTokenByRefreshtoken = await this.userTokenRepository.findOne({
        where: { refreshToken },
        select: ['userId'],
      });

      if (!userTokenByRefreshtoken) {
        return {
          outcome: 'TOKEN_EXPIRED',
        };
      }

      const accessToken = generateAccessToken(userTokenByRefreshtoken.userId);

      return {
        outcome: 'SUCCESS',
        payload: { accessToken },
      };
    } catch (error) {
      return {
        outcome: 'UNEXPECTED_ERROR',
        error: error.message,
      };
    }
  }
}

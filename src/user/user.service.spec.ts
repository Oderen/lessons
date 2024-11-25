import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { hashPassword } from './utils/hash-password';
import { ConfigModule } from '@nestjs/config';
import testConfig from '../common/config/test.config';
import { validateEnv } from 'src/common/utils/validate-env';
import { UserTokenEntity } from 'src/database/entities/user-token.entity';
import jwtConfig from './config/jwt.config';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Partial<Record<keyof Repository<UserEntity>, jest.Mock>>;
  let userTokenRepository: Partial<
    Record<keyof Repository<UserTokenEntity>, jest.Mock>
  >;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    userTokenRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.test'],
          load: [testConfig],
          validate: validateEnv('test'),
        }),
        ConfigModule.forFeature(jwtConfig),
      ],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(UserTokenEntity),
          useValue: userTokenRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('register', () => {
    it('should return USERNAME_IS_TAKEN if user exsists', async () => {
      const createRegisterDto: RegisterUserDto = {
        username: 'testuser',
        initinal_deposit: '200',
        password: '1234',
      };

      userRepository.findOne.mockResolvedValueOnce(new UserEntity());

      const result = await userService.register(createRegisterDto);

      expect(result.outcome).toEqual('USERNAME_IS_TAKEN');
    });

    it('should return userId and SUCCESS if user is created', async () => {
      const createRegisterDto: RegisterUserDto = {
        username: 'newUser',
        initinal_deposit: '200',
        password: '1234',
      };

      userRepository.findOne.mockResolvedValueOnce(null);
      userRepository.save.mockResolvedValueOnce(new UserEntity());

      const result: any = await userService.register(createRegisterDto);

      expect(result.outcome).toEqual('SUCCESS');
      expect(result.payload).toHaveProperty('userId');
    });

    it('should return UNEXPECTED_ERROR if an error occurs', async () => {
      const createUserDto: RegisterUserDto = {
        username: 'erroruser',
        password: 'pass',
        initinal_deposit: '50',
      };

      userRepository.findOne.mockResolvedValueOnce(null);
      userRepository.save.mockRejectedValueOnce(
        new Error('Database save error'),
      );

      const result = await userService.register(createUserDto);

      expect(result).toEqual({
        outcome: 'UNEXPECTED_ERROR',
        errorMessage: 'Database save error',
      });
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should return USER_NOT_FOUND when user does not exsist', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'non-exsisting-user',
        password: '1234',
      };

      userRepository.findOne.mockResolvedValueOnce(null);
      const loginResult = await userService.login(loginUserDto);

      expect(loginResult.outcome).toBe('USER_NOT_FOUND');
    });

    it('should return PASSWORD_INCORRENT when password is different', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testUser',
        password: '1234',
      };

      userRepository.findOne.mockResolvedValueOnce({
        username: 'testUser',
        salt: 1,
        password: '12345',
      });
      const loginResult = await userService.login(loginUserDto);

      expect(loginResult.outcome).toBe('PASSWORD_INCORRENT');
    });

    it(`should return TOKEN_ALREADY_EXISTS status and access, 
      refresh tokens if token with user id is already exists`, async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testUser',
        password: '1234',
      };

      userRepository.findOne.mockResolvedValueOnce({
        username: 'testUser',
        salt: BigInt(1),
        password: hashPassword({
          password: '1234',
          salt: BigInt(1),
        }),
      });
      userTokenRepository.findOne.mockResolvedValueOnce({
        id: '1',
        refreshToken: 'existing resfesh token',
      });
      userTokenRepository.save.mockResolvedValueOnce({
        id: '1',
        refreshToken: 'new refresh token',
      });
      const loginResult: any = await userService.login(loginUserDto);

      expect(loginResult.outcome).toBe('TOKEN_ALREADY_EXSISTS');
      expect(loginResult.payload).toHaveProperty('userId');
      expect(loginResult.payload).toHaveProperty('accessToken');
      expect(loginResult.payload).toHaveProperty('refreshToken');
    });

    it('should return SUCCESS status and access, refresh tokens', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testUser',
        password: '1234',
      };

      userRepository.findOne.mockResolvedValueOnce({
        username: 'testUser',
        salt: BigInt(1),
        password: hashPassword({
          password: '1234',
          salt: BigInt(1),
        }),
      });
      const loginResult: any = await userService.login(loginUserDto);

      expect(loginResult.outcome).toBe('SUCCESS');
      expect(loginResult.payload).toHaveProperty('userId');
      expect(loginResult.payload).toHaveProperty('accessToken');
      expect(loginResult.payload).toHaveProperty('refreshToken');
    });
  });

  describe('generateRefreshToken', () => {
    it('should return TOKEN_EXPIRED when refresh token was not found in DB', async () => {
      const refreshToken = 'Unexisting refresh token';

      userTokenRepository.findOne.mockResolvedValueOnce(null);
      const result = await userService.generateRefreshToken(refreshToken);

      expect(result.outcome).toBe('TOKEN_EXPIRED');
    });

    it('should return SUCCESS and access token', async () => {
      const refreshToken = 'existing token';

      userTokenRepository.findOne.mockResolvedValueOnce({
        userId: '1',
      });
      const result: any = await userService.generateRefreshToken(refreshToken);

      expect(result.outcome).toBe('SUCCESS');
      expect(result.payload).toHaveProperty('accessToken');
    });
  });
});

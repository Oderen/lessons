import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { UserTokenEntity } from 'src/database/entities/user-token.entity';

describe('UserController', () => {
  let userController: UserController;
  let userRepository: Partial<Record<keyof Repository<UserEntity>, jest.Mock>>;
  let userTokenRepository: Partial<
    Record<keyof Repository<UserTokenEntity>, jest.Mock>
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(jwtConfig)],
      controllers: [UserController],
      providers: [
        UserService,
        { provide: getRepositoryToken(UserEntity), useValue: userRepository },
        {
          provide: getRepositoryToken(UserTokenEntity),
          useValue: userTokenRepository,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});

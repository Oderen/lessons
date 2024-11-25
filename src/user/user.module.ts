import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { ValidJwtAuth } from 'src/common/middlewares/valid-jwt.middleware';
import { UserTokenEntity } from 'src/database/entities/user-token.entity';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([UserEntity, UserTokenEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidJwtAuth).forRoutes({
      path: '/users/me/:id',
      method: RequestMethod.GET,
    });
  }
}

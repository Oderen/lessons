import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpressRequestWithUser } from '../types/express-req-with-user.type';
import { NextFunction, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { verify } from 'jsonwebtoken';

@Injectable()
export class ValidJwtAuth implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async use(req: ExpressRequestWithUser, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }

    const [bearer, token] = req.headers.authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    try {
      const decodedPayload = verify(token, process.env.ACCESS_JWT_SECRET) as {
        id: string;
      };
      const user = await this.userRepository.findOne({
        where: { id: decodedPayload.id },
      });

      if (!user) {
        throw new UnauthorizedException('USER_NOT_FOUND');
      }

      req.user = user;
      next();
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        console.log('Token is expired');
        throw new UnauthorizedException('EXPIRED_TOKEN');
      } else {
        console.log('Token is invalid:', e.message);
        throw new UnauthorizedException('UNEXPECTED_JWT_ERROR');
      }
    }
  }
}

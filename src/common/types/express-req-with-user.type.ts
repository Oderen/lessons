import { Request } from 'express';
import { UserEntity } from 'src/database/entities/user.entity';

export interface ExpressRequestWithUser extends Request {
  user: UserEntity;
}

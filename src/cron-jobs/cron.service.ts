import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTokenEntity } from 'src/database/entities/user-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(UserTokenEntity)
    private userTokenRepository: Repository<UserTokenEntity>,
  ) {}

  @Cron('0 0 * * *')
  async removeExpiresTokens() {
    const now = new Date();

    await this.userTokenRepository
      .createQueryBuilder()
      .delete()
      .from('user-tokens')
      .where('expiresIn < :now', { now })
      .execute();
  }
}

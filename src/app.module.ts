import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import ormconfig from './orm-config';
import localConfig from './common/config/development.config';
import { validateEnv } from './common/utils/validate-env';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron-jobs/cron.service';
import { UserTokenEntity } from './database/entities/user-token.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([UserTokenEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [localConfig],
      validate: validateEnv('dev'),
    }),
    UserModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {}

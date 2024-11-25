import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'user-tokens',
})
export class UserTokenEntity {
  @PrimaryColumn({ primaryKeyConstraintName: 'pk_user-token_id' })
  id: string;

  @Index('idx_user_tokens_userId')
  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.refreshTokens, {
    cascade: true,
  })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'fk_user_tokens_user_id',
  })
  user: UserEntity;

  @Index('idx_user_tokens_refresh_tokens', { unique: true })
  @Column()
  refreshToken: string;

  @Column()
  expiresIn: Date;
}

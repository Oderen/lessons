import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { UserTokenEntity } from './user-token.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryColumn({ primaryKeyConstraintName: 'pk_user_id' })
  id: string;

  @Column()
  @Index('uq_user_username', { unique: true })
  username: string;

  @OneToMany(
    () => UserTokenEntity,
    (userToken: UserTokenEntity) => userToken.user,
    {
      nullable: true,
    },
  )
  refreshTokens: UserTokenEntity[] | null;

  @Column()
  balance: string;

  @Column()
  password: string;

  @Column({ type: 'bigint' })
  salt: bigint;
}

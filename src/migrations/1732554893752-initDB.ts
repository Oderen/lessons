import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDB1732554893752 implements MigrationInterface {
    name = 'InitDB1732554893752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-tokens" ("id" character varying NOT NULL, "userId" character varying NOT NULL, "refreshToken" character varying NOT NULL, "expiresIn" TIMESTAMP NOT NULL, CONSTRAINT "pk_user-token_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_tokens_userId" ON "user-tokens" ("userId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_user_tokens_refresh_tokens" ON "user-tokens" ("refreshToken") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "username" character varying NOT NULL, "balance" character varying NOT NULL, "password" character varying NOT NULL, "salt" bigint NOT NULL, CONSTRAINT "pk_user_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_user_username" ON "users" ("username") `);
        await queryRunner.query(`ALTER TABLE "user-tokens" ADD CONSTRAINT "fk_user_tokens_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-tokens" DROP CONSTRAINT "fk_user_tokens_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."uq_user_username"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_tokens_refresh_tokens"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_tokens_userId"`);
        await queryRunner.query(`DROP TABLE "user-tokens"`);
    }

}

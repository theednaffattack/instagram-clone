import {MigrationInterface, QueryRunner} from "typeorm";

export class addPrivateRoutes1626743572551 implements MigrationInterface {
    name = 'addPrivateRoutes1626743572551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_followers_user" DROP CONSTRAINT "FK_26312a1e34901011fc6f63545e2"`);
        await queryRunner.query(`ALTER TABLE "user_thread_invitations_thread" DROP CONSTRAINT "FK_7642a95915ec98698382b77b3bd"`);
        await queryRunner.query(`ALTER TABLE "user_thread_invitations_thread" DROP CONSTRAINT "FK_2107c51cd7db9efac1a4ddb7b4d"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "tokenVersion" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user_followers_user" ADD CONSTRAINT "FK_26312a1e34901011fc6f63545e2" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_thread_invitations_thread" ADD CONSTRAINT "FK_7642a95915ec98698382b77b3bd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_thread_invitations_thread" ADD CONSTRAINT "FK_2107c51cd7db9efac1a4ddb7b4d" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_thread_invitations_thread" DROP CONSTRAINT "FK_2107c51cd7db9efac1a4ddb7b4d"`);
        await queryRunner.query(`ALTER TABLE "user_thread_invitations_thread" DROP CONSTRAINT "FK_7642a95915ec98698382b77b3bd"`);
        await queryRunner.query(`ALTER TABLE "user_followers_user" DROP CONSTRAINT "FK_26312a1e34901011fc6f63545e2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokenVersion"`);
        await queryRunner.query(`ALTER TABLE "user_thread_invitations_thread" ADD CONSTRAINT "FK_2107c51cd7db9efac1a4ddb7b4d" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_thread_invitations_thread" ADD CONSTRAINT "FK_7642a95915ec98698382b77b3bd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_followers_user" ADD CONSTRAINT "FK_26312a1e34901011fc6f63545e2" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

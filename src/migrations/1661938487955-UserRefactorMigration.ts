import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserRefactorMigration1661938487955 implements MigrationInterface {
    name = 'UserRefactorMigration1661938487955'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_f42ec8f1159e33141b84da1d922"
        `)
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "chat_id"
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "chat_id" numeric NOT NULL
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_f42ec8f1159e33141b84da1d922" UNIQUE ("chat_id")
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_f42ec8f1159e33141b84da1d922"
        `)
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "chat_id"
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "chat_id" integer NOT NULL
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_f42ec8f1159e33141b84da1d922" UNIQUE ("chat_id")
        `)
    }
}

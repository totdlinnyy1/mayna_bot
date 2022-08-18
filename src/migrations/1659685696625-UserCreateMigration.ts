import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserCreateMigration1659685696625 implements MigrationInterface {
    name = 'UserCreateMigration1659685696625'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "bio"
            SET DEFAULT ''
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "bio" DROP DEFAULT
        `)
    }
}

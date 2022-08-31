import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBanColumnToUserMigration1661671731161
    implements MigrationInterface
{
    name = 'AddBanColumnToUserMigration1661671731161'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "isBanned" boolean NOT NULL DEFAULT false
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "banReason" text
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "banned_at" TIMESTAMP WITH TIME ZONE
        `)
        await queryRunner.query(`
            ALTER TYPE "public"."users_role_enum"
            RENAME TO "users_role_enum_old"
        `)
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('superadmin', 'admin', 'user')
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" DROP DEFAULT
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role"
            SET DEFAULT 'user'
        `)
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum_old"
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum_old" AS ENUM('superadmin', 'ADMIN', 'user')
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" DROP DEFAULT
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role"
            SET DEFAULT 'user'
        `)
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `)
        await queryRunner.query(`
            ALTER TYPE "public"."users_role_enum_old"
            RENAME TO "users_role_enum"
        `)
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "banned_at"
        `)
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "banReason"
        `)
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "isBanned"
        `)
    }
}

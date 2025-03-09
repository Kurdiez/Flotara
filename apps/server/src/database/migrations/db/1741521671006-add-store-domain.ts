import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreDomain1741521671006 implements MigrationInterface {
    name = 'AddStoreDomain1741521671006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" ADD "shopifyStoreDomain" character varying NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_282d1d18aac3b0abb39e53deee" ON "store" ("shopifyStoreDomain") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_282d1d18aac3b0abb39e53deee"`);
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "shopifyStoreDomain"`);
    }

}

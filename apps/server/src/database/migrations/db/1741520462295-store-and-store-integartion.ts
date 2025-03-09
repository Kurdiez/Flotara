import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreAndStoreIntegartion1741520462295 implements MigrationInterface {
    name = 'StoreAndStoreIntegartion1741520462295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shopifyStoreId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_51b521b4814d230066b0b240ff" ON "store" ("shopifyStoreId") `);
        await queryRunner.query(`CREATE TABLE "store_integration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "storeId" uuid NOT NULL, "session" json NOT NULL, CONSTRAINT "REL_89bf357bef97578d8ddc0cdcc2" UNIQUE ("storeId"), CONSTRAINT "PK_53b1502a8914fcbba9a2b3b9460" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_89bf357bef97578d8ddc0cdcc2" ON "store_integration" ("storeId") `);
        await queryRunner.query(`ALTER TABLE "store_integration" ADD CONSTRAINT "FK_89bf357bef97578d8ddc0cdcc28" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_integration" DROP CONSTRAINT "FK_89bf357bef97578d8ddc0cdcc28"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89bf357bef97578d8ddc0cdcc2"`);
        await queryRunner.query(`DROP TABLE "store_integration"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b521b4814d230066b0b240ff"`);
        await queryRunner.query(`DROP TABLE "store"`);
    }

}

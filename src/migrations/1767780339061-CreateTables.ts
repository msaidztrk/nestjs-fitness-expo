import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1767780339061 implements MigrationInterface {
    name = 'CreateTables1767780339061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`device_id\` varchar(255) NULL, \`email\` varchar(255) NULL, \`password_hash\` varchar(255) NULL, \`first_name\` varchar(100) NULL, \`last_name\` varchar(100) NULL, \`date_of_birth\` date NULL, \`gender\` enum ('male', 'female', 'other') NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_device_id\` (\`device_id\`), UNIQUE INDEX \`IDX_email\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`metrics\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`weight\` decimal(5,2) NOT NULL COMMENT 'Weight in kg', \`height\` decimal(5,2) NOT NULL COMMENT 'Height in cm', \`bmi\` decimal(4,2) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`metrics\` ADD CONSTRAINT \`FK_metrics_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`metrics\` DROP FOREIGN KEY \`FK_metrics_user\``);
        await queryRunner.query(`DROP TABLE \`metrics\``);
        await queryRunner.query(`DROP INDEX \`IDX_email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_device_id\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}

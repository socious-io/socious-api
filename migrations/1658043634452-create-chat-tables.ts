import { MigrationInterface, QueryRunner } from "typeorm";

export class createChatTables1658043634452 implements MigrationInterface {
    name = 'createChatTables1658043634452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_chats\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`userId\` bigint UNSIGNED NOT NULL, \`muted\` tinyint NOT NULL DEFAULT false, \`deleted\` tinyint NOT NULL DEFAULT false, \`lastReadId\` int NULL, \`lastReadDT\` datetime NULL, \`allRead\` tinyint NOT NULL DEFAULT false, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`chatId\` bigint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chats\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`participantsHash\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_messages\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`userId\` bigint UNSIGNED NULL, \`text\` mediumtext NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`media\` varchar(255) NULL, \`mediaType\` varchar(255) NULL, \`chatId\` bigint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_chats\` ADD CONSTRAINT \`FK_1f914ac3c69c9fe57bc3fb7f9dc\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_messages\` ADD CONSTRAINT \`FK_e82334881c89c2aef308789c8be\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat_messages\` DROP FOREIGN KEY \`FK_e82334881c89c2aef308789c8be\``);
        await queryRunner.query(`ALTER TABLE \`user_chats\` DROP FOREIGN KEY \`FK_1f914ac3c69c9fe57bc3fb7f9dc\``);
        await queryRunner.query(`DROP TABLE \`chat_messages\``);
        await queryRunner.query(`DROP TABLE \`chats\``);
        await queryRunner.query(`DROP TABLE \`user_chats\``);
    }

}

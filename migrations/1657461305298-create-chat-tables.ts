import { MigrationInterface, QueryRunner } from "typeorm";

export class createChatTables1657461305298 implements MigrationInterface {
  name = "createChatTables1657461305298";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chat_messages\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`userId\` bigint UNSIGNED NOT NULL, \`pageId\` bigint UNSIGNED NOT NULL, \`text\` mediumtext NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`media\` varchar(255) NOT NULL, \`mediaType\` varchar(255) NOT NULL, \`chatId\` bigint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`page_chats\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`chatId\` bigint NOT NULL, \`muted\` tinyint NOT NULL DEFAULT false, \`deleted\` tinyint NOT NULL, \`lastReadId\` int NOT NULL, \`lastReadDT\` datetime NOT NULL, \`allRead\` tinyint NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`pageId\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_chats\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`chatId\` bigint NOT NULL, \`muted\` tinyint NOT NULL DEFAULT false, \`deleted\` tinyint NOT NULL, \`lastReadId\` int NOT NULL, \`lastReadDT\` datetime NOT NULL, \`allRead\` tinyint NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chats\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` ADD CONSTRAINT \`FK_e82334881c89c2aef308789c8be\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`page_chats\` ADD CONSTRAINT \`FK_0086ec841d7d429d16ac058a07d\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_chats\` ADD CONSTRAINT \`FK_1f914ac3c69c9fe57bc3fb7f9dc\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_chats\` DROP FOREIGN KEY \`FK_1f914ac3c69c9fe57bc3fb7f9dc\``);
    await queryRunner.query(`ALTER TABLE \`page_chats\` DROP FOREIGN KEY \`FK_0086ec841d7d429d16ac058a07d\``);
    await queryRunner.query(`ALTER TABLE \`chat_messages\` DROP FOREIGN KEY \`FK_e82334881c89c2aef308789c8be\``);
    await queryRunner.query(`DROP TABLE \`chats\``);
    await queryRunner.query(`DROP TABLE \`user_chats\``);
    await queryRunner.query(`DROP TABLE \`page_chats\``);
    await queryRunner.query(`DROP TABLE \`chat_messages\``);
  }
}

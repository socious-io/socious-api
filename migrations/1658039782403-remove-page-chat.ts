import { MigrationInterface, QueryRunner } from "typeorm";

export class removePageChat1658039782403 implements MigrationInterface {
  name = "removePageChat1658039782403";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`chat_messages\` DROP COLUMN \`pageId\``);
    await queryRunner.query(`ALTER TABLE \`user_chats\` CHANGE \`muted\` \`muted\` tinyint NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE \`user_chats\` CHANGE \`deleted\` \`deleted\` tinyint NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE \`user_chats\` CHANGE \`allRead\` \`allRead\` tinyint NOT NULL DEFAULT false`);
    await queryRunner.query(`DROP TABLE \`page_chats\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_chats\` CHANGE \`allRead\` \`allRead\` tinyint NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE \`user_chats\` CHANGE \`deleted\` \`deleted\` tinyint NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE \`user_chats\` CHANGE \`muted\` \`muted\` tinyint NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE \`chat_messages\` ADD \`pageId\` bigint UNSIGNED NULL`);
    await queryRunner.query(
      `CREATE TABLE \`page_chats\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`chatId\` bigint NOT NULL, \`muted\` tinyint NOT NULL DEFAULT false, \`deleted\` tinyint NOT NULL DEFAULT false, \`lastReadId\` int, \`lastReadDT\` datetime, \`allRead\` tinyint NOT NULL DEFAULT false, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`pageId\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`page_chats\` ADD CONSTRAINT \`FK_0086ec841d7d429d16ac058a07d\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

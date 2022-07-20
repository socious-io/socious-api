import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ChatModule } from "./Chat";
import { config } from "./Config";
import { IdentityModule } from "./Identity";
import { SkillModule } from "./Skill";
/*
 |--------------------------------------------------------------------------------
 | Root Module
 |--------------------------------------------------------------------------------
 */

@Module({
  imports: [
    SkillModule,
    ChatModule,
    IdentityModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      autoLoadEntities: true,
      ...config.mysql
    })
  ]
})
export class AppModule {}

/*
 |--------------------------------------------------------------------------------
 | Bootstrap
 |--------------------------------------------------------------------------------
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
}

bootstrap();

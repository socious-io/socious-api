import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ChatModule } from "./Chat/ChatModule";
import { User } from "./User/Models/User";
import { UserModule } from "./User/Module";

/*
 |--------------------------------------------------------------------------------
 | Configuration
 |--------------------------------------------------------------------------------
 */

const PORT = process.env.PORT ?? 8370;

/*
 |--------------------------------------------------------------------------------
 | Root Module
 |--------------------------------------------------------------------------------
 */

@Module({
  imports: [
    ChatModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 33060,
      username: "admin",
      password: "secret",
      database: "socious",
      entities: [User]
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
  await app.listen(PORT);
}

bootstrap();

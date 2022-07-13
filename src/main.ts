import { AuthModule } from "@app/auth";
import { ChatModule } from "@app/chat";
import { UsersModule } from "@app/users";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ChatController } from "./chat/chat.controller";
import { AuthController } from "./Controllers/AuthController";
import { UsersController } from "./Controllers/UsersController";

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
    AuthModule,
    UsersModule,
    ChatModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 33060),
      username: "admin",
      password: "secret",
      database: "socious",
      autoLoadEntities: true,
    }),
  ],
  controllers: [AuthController, UsersController, ChatController],
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

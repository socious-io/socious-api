import { AuthModule } from "@app/auth";
import { ChatModule } from "@app/chat";
import { SearchModule } from "@app/search";
import { UsersModule } from "@app/users";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ChatController } from "./chat/chat.controller";
import { AuthController } from "./Controllers/AuthController";
import { SearchController } from "./Controllers/Search.controller";
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
    SearchModule,
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
  controllers: [AuthController, UsersController, ChatController, SearchController],
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
  const server = app.getHttpServer();
  const router = server._events.request._router;

  const availableRoutes: [] = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter((item) => item !== undefined);
  console.log(availableRoutes);
}

bootstrap();

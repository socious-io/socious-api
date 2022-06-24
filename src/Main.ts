import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ChatModule } from './Chat/ChatModule';

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
  imports: [ChatModule],
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

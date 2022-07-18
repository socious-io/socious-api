import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IdentityModule } from "../Identity";
import { ChatController } from "./Controllers/ChatController";
import { Chat } from "./Models/Chat";
import { Message } from "./Models/Message";
import { UserChat } from "./Models/UserChat";
import { ChatService } from "./Services/ChatService";

@Module({
  imports: [IdentityModule, TypeOrmModule.forFeature([Chat, Message, UserChat])],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule {}

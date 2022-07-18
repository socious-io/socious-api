import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IdentityModule } from "../Identity";
import { ChatController } from "./Controllers/ChatController";
import { Chat } from "./Models/Chat";
import { ChatMessage } from "./Models/ChatMessage";
import { UserChat } from "./Models/UserChat";
import { ChatMessageService } from "./Services/ChatMessageService";
import { ChatService } from "./Services/ChatService";
import { UserChatService } from "./Services/UserChatService";

@Module({
  imports: [IdentityModule, TypeOrmModule.forFeature([Chat, ChatMessage, UserChat])],
  providers: [ChatService, UserChatService, ChatMessageService],
  controllers: [ChatController]
})
export class ChatModule {}

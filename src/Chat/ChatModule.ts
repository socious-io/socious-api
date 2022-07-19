import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IdentityModule } from "../Identity";
import { ChatController } from "./Controllers/ChatController";
import { Chat } from "./Models/Chat";
import { ChatMessage } from "./Models/ChatMessage";
import { ChatParticipant } from "./Models/ChatParticipant";
import { ChatMessageService } from "./Services/ChatMessageService";
import { ChatParticipantService } from "./Services/ChatParticipantService";
import { ChatService } from "./Services/ChatService";

@Module({
  imports: [IdentityModule, TypeOrmModule.forFeature([Chat, ChatMessage, ChatParticipant])],
  providers: [ChatService, ChatParticipantService, ChatMessageService],
  controllers: [ChatController]
})
export class ChatModule {}

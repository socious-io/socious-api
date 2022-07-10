import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ChatClient, ChatService } from "./chat.service";
import { Chat } from "./models/chat.model";
import { Message } from "./models/message.model";
import { PageChat } from "./models/page-chat.model";
import { UserChat } from "./models/user-chat.model";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, PageChat, UserChat])],
  providers: [ChatService, ChatClient],
  exports: [ChatService, ChatClient],
})
export class ChatModule {}

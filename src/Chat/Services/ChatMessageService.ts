import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Chat } from "../Models/Chat";
import { ChatMessage } from "../Models/ChatMessage";

const MESSAGE_BATCH_SIZE = 20;

@Injectable()
export class ChatMessageService {
  constructor(@InjectRepository(ChatMessage) readonly messages: Repository<ChatMessage>) {}

  /**
   * Create a new chat message.
   *
   * @param userId - Creator of the message.
   * @param chat   - Chat the message belongs to.
   * @param text   - Content of the message.
   */
  public async create(userId: number, chat: Chat, text: string): Promise<ChatMessage> {
    const message = new ChatMessage();

    message.userId = userId;
    message.chat = chat;
    message.text = text;

    return this.messages.save(message);
  }

  /**
   * Find message by primary id.
   *
   * @param id - ChatMessage primary id.
   */
  public async findById(id: number): Promise<ChatMessage | null> {
    return this.messages.findOneBy({ id });
  }

  /**
   * Get a batch of messages, starting from the latest.
   */
  public async findRecent(chatId: number, skip: number): Promise<ChatMessage[]> {
    return this.messages.find({
      where: {
        chat: {
          id: chatId
        }
      },
      order: {
        createdAt: "DESC"
      },
      skip,
      take: MESSAGE_BATCH_SIZE
    });
  }
}

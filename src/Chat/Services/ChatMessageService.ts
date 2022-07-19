import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Chat } from "../Models/Chat";
import { ChatMessage } from "../Models/ChatMessage";

const MESSAGE_BATCH_SIZE = 20;

@Injectable()
export class ChatMessageService {
  constructor(@InjectRepository(ChatMessage) readonly repository: Repository<ChatMessage>) {}

  /*
   |--------------------------------------------------------------------------------
   | Writes
   |--------------------------------------------------------------------------------
   */

  /**
   * Create a new chat message.
   *
   * @param userId - User primary id.
   * @param chat   - Chat the message belongs to.
   * @param text   - Content of the message.
   */
  public async create(userId: number, chat: Chat, text: string): Promise<ChatMessage> {
    return this.repository.save(this.generate(userId, chat, text));
  }

  /**
   * Generate a new message instance.
   *
   * @remarks The generated message instance does not automatically save to the
   * database. Returned instance will need to be saved manually and simply
   * ensures that the generated message is valid and ready to submit.
   *
   * @example
   *
   * ```ts
   * class Foo {
   *   constructor(readonly messages: ChatMessageService) {}
   *
   *   public async create(...args): Promise<Order> {
   *     const message = this.messages.generate(...args);
   *     return this.messages.repository.save(message);
   *   }
   * }
   * ```
   *
   * @param userId - User primary id.
   * @param chat   - Chat the message belongs to.
   * @param text   - Content of the message.
   */
  public generate(userId: number, chat: Chat, text: string): ChatMessage {
    const message = new ChatMessage();

    message.userId = userId;
    message.chat = chat;
    message.text = text;

    return message;
  }

  /*
   |--------------------------------------------------------------------------------
   | Reads
   |--------------------------------------------------------------------------------
   */

  /**
   * Find message by primary id.
   *
   * @param id - ChatMessage primary id.
   */
  public async findById(id: number): Promise<ChatMessage | null> {
    return this.repository.findOneBy({ id });
  }

  /**
   * Get a batch of messages, starting from the latest.
   */
  public async findRecent(chatId: number, skip: number): Promise<ChatMessage[]> {
    return this.repository.find({
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

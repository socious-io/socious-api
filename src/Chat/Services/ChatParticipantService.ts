import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Chat } from "../Models/Chat";
import { ChatParticipant } from "../Models/ChatParticipant";

@Injectable()
export class ChatParticipantService {
  constructor(@InjectRepository(ChatParticipant) readonly repository: Repository<ChatParticipant>) {}

  /*
   |--------------------------------------------------------------------------------
   | Writes
   |--------------------------------------------------------------------------------
   */

  /**
   * Generate a new user chat instance.
   *
   * @remarks The generated user chat instance does not automatically save to the
   * database. Returned instance will need to be saved manually and simply
   * ensures that the generated user chat is valid and ready to submit.
   *
   * @example
   *
   * ```ts
   * class Foo {
   *   constructor(readonly userChats: UserChatService) {}
   *
   *   public async create(...args): Promise<Order> {
   *     const participant = this.userChats.generate(...args);
   *     return this.userChats.repository.save(participant);
   *   }
   * }
   * ```
   *
   * @param userId - User primary id.
   * @param chat   - Chat the message belongs to.
   */
  public generate(userId: number, chat: Chat): ChatParticipant {
    const participant = new ChatParticipant();

    participant.userId = userId;
    participant.chat = chat;

    return participant;
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  /**
   * Set whether the user wants notifications for this chat.
   *
   * @param id    - ChatParticipant primary id.
   * @param muted - Mute value.
   */
  public async setMuted(id: number, muted: boolean): Promise<void> {
    await this.repository.update({ id }, { muted });
  }

  /**
   * Set all read value of a user chat instance to the provided value.
   *
   * @param id      - ChatParticipant primary id.
   * @param allRead - All read status.
   */
  public async setAllRead(id: number, allRead: boolean): Promise<void> {
    await this.repository.update({ id }, { allRead });
  }

  /**
   * Update read status for all chat participants.
   */
  public async setReadStatus(
    chatId: number,
    messageId: number,
    messageCreatedAt: Date,
    chatUpdatedAt: Date
  ): Promise<void> {
    await this.repository.update(
      {
        chat: {
          id: chatId
        }
      },
      {
        lastReadId: messageId,
        lastReadDT: messageCreatedAt,
        allRead: messageCreatedAt.valueOf() === chatUpdatedAt.valueOf(),
        updatedAt: new Date()
      }
    );
  }

  /*
   |--------------------------------------------------------------------------------
   | Reads
   |--------------------------------------------------------------------------------
   */

  /**
   * Get the user or page's participant data (last read, notification settings, etc).
   *
   * @param chatId - Chat primary id.
   * @param userId - User primary id.
   */
  public async findByChatAndUser(chatId: number, userId: number): Promise<ChatParticipant | null> {
    return this.repository.findOneBy({
      chat: {
        id: chatId
      },
      userId
    });
  }

  /**
   * Get all users or pages' participant data (last read, notification settings, etc).
   * Note most of this data should not be exposed to the front-end, but some of it (like read status) is.
   *
   * @param chatId - Chat primary id.
   */
  public async findByChat(chatId: number): Promise<ChatParticipant[]> {
    return this.repository.findBy({
      chat: {
        id: chatId
      },
      deleted: false
    });
  }

  /**
   * Get all non-deleted chats for this user or page. Messages are of course not loaded, but
   * participants are loaded.
   *
   * @param userId - User primary id.
   */
  public async findByUser(userId: number): Promise<ChatParticipant[]> {
    return this.repository.find({
      where: {
        userId
      },
      relations: {
        chat: {
          users: true
        }
      }
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Destructors
   |--------------------------------------------------------------------------------
   */

  /**
   * Delete chat for all chat participants.
   *
   * @param chatId - Chat primary id.
   */
  public async delete(chatId: number): Promise<void> {
    await this.repository.update(
      {
        chat: {
          id: chatId
        }
      },
      {
        deleted: true
      }
    );
  }
}

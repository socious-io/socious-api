import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserChat } from "../Models/UserChat";

@Injectable()
export class UserChatService {
  constructor(@InjectRepository(UserChat) readonly userChats: Repository<UserChat>) {}

  /**
   * Set whether the user wants notifications for this chat.
   *
   * @param id    - UserChat primary id.
   * @param muted - Mute value.
   */
  public async setMuted(id: number, muted: boolean): Promise<void> {
    await this.userChats.update({ id }, { muted });
  }

  /**
   * Set all read value of a user chat instance to the provided value.
   *
   * @param id      - UserChat primary id.
   * @param allRead - All read status.
   */
  public async setAllRead(id: number, allRead: boolean): Promise<void> {
    await this.userChats.update({ id }, { allRead });
  }

  /**
   * Get all users or pages' participant data (last read, notification settings, etc).
   * Note most of this data should not be exposed to the front-end, but some of it (like read status) is.
   *
   * @param chatId - Chat primary id.
   */
  public async findByChat(chatId: number): Promise<UserChat[]> {
    return this.userChats.findBy({
      chat: {
        id: chatId
      },
      deleted: false
    });
  }

  /**
   * Get the user or page's participant data (last read, notification settings, etc).
   *
   * @param chatId - Chat primary id.
   * @param userId - User primary id.
   */
  public async findByChatParticipant(chatId: number, userId: number): Promise<UserChat | null> {
    return this.userChats.findOneBy({
      chat: {
        id: chatId
      },
      userId
    });
  }

  /**
   * Get all non-deleted chats for this user or page. Messages are of course not loaded, but
   * participants are loaded.
   *
   * @param userId - User primary id.
   */
  public async findByParticipant(userId: number): Promise<UserChat[]> {
    return this.userChats.find({
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

  /**
   * Update read status for all chat participants.
   */
  public async setReadStatus(
    chatId: number,
    messageId: number,
    messageCreatedAt: Date,
    chatUpdatedAt: Date
  ): Promise<void> {
    await this.userChats.update(
      { chat: { id: chatId } },
      {
        lastReadId: messageId,
        lastReadDT: messageCreatedAt,
        allRead: messageCreatedAt.valueOf() === chatUpdatedAt.valueOf(),
        updatedAt: new Date()
      }
    );
  }

  /**
   * Delete chat for all chat participants.
   *
   * @param chatId - Chat primary id.
   */
  public async delete(chatId: number): Promise<void> {
    await this.userChats.update({ chat: { id: chatId } }, { deleted: true });
  }
}

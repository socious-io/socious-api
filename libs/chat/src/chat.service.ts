import { User } from "@app/users";
import { ForbiddenException, Injectable, NotFoundException, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash } from "node:crypto";
import { DataSource, Repository } from "typeorm";

import { Chat } from "./models/chat.model";
import { Message } from "./models/message.model";
import { PageChat } from "./models/page-chat.model";
import { UserChat } from "./models/user-chat.model";
// TODO: in design stage
/* eslint-disable @typescript-eslint/no-unused-vars */

const MESSAGE_BATCH_SIZE = 20;

@Injectable()
export class ChatService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Chat) readonly chats: Repository<Chat>,
    @InjectRepository(Message) readonly messages: Repository<Message>,
    @InjectRepository(UserChat) readonly userChats: Repository<UserChat>,
    @InjectRepository(PageChat) readonly pageChats: Repository<PageChat>,
  ) {}

  public hashParticipants(users: number[], pages: number[]): string {
    const hash = createHash("sha256");
    users = users.slice();
    users.sort();
    pages = pages.slice();
    pages.sort();

    hash.update(JSON.stringify({ users, pages }));
    return hash.digest("hex");
  }

  /** If a chat exists with this set of participants, return it. Otherwise, create and return. */
  public async getChat(principal: User, asPage: number | null, users: number[], pages: number[]): Promise<Chat> {
    if (asPage && !pages.includes(asPage)) {
      pages = pages.slice();
      pages.push(asPage);
    } else if (asPage === null && !users.includes(Number(principal.id))) {
      users = users.slice();
      users.push(Number(principal.id));
    }

    // TODO: validate ids
    const hash = this.hashParticipants(users, pages);

    const existing = await this.chats.findOneBy({ participantsHash: hash });
    if (existing) return existing;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let chat = new Chat();
      chat.participantsHash = hash;
      chat = await queryRunner.manager.save(chat);

      for (const user of users) await queryRunner.manager.insert(UserChat, { userId: user, chat });
      for (const page of pages) await queryRunner.manager.insert(PageChat, { pageId: page, chat });

      await queryRunner.commitTransaction();
      return chat;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /** Send a message in a chat. TODO: media */
  public async sendMessage(principal: User, asPage: number | null, chatId: number, text: string): Promise<Message> {
    if (asPage !== null) throw new NotImplementedException();

    const chat = await this.chats.findOneBy({ id: chatId });
    if (!chat) throw new NotFoundException();
    const participant = await this.getOwnParticipant(principal, asPage, chatId);
    if (!participant) throw new ForbiddenException();

    let message = new Message();
    message.userId = principal.id;
    message.chat = chat;
    message.text = text;
    message = await this.messages.save(message);
    chat.updatedAt = message.createdAt;
    this.chats.save(chat);
    this.userChats.update({ chat: { id: chatId } }, { allRead: false });
    this.pageChats.update({ chat: { id: chatId } }, { allRead: false });

    return message;
  }

  /** Update read status for a participant. */
  public async setReadStatus(principal: User, asPage: number | null, chatId: number, messageId: number): Promise<void> {
    if (asPage !== null) throw new NotImplementedException();

    const chat = await this.chats.findOneBy({ id: chatId });
    if (!chat) throw new NotFoundException();
    const participant = await this.getOwnParticipant(principal, asPage, chatId);
    if (!participant) throw new NotFoundException();
    const message = await this.messages.findOneBy({ id: messageId, chat: { id: chatId } });
    if (!message) throw new NotFoundException();

    participant.lastReadId = messageId;
    participant.lastReadDT = message.createdAt;
    participant.allRead = message.createdAt.valueOf() === chat.updatedAt.valueOf();
    participant.updatedAt = new Date();

    this.userChats.save(participant);
  }

  /** Set whether the user wants notifications for this chat. */
  public async setMuted(principal: User, asPage: number | null, chatId: number, muted: boolean): Promise<void> {
    if (asPage !== null) throw new NotImplementedException();

    const participant = await this.getOwnParticipant(principal, asPage, chatId);
    if (!participant) throw new NotFoundException();

    participant.muted = muted;
    this.userChats.save(participant);
  }

  /** Get the user or page's participant data (last read, notification settings, etc). */
  public async getOwnParticipant(principal: User, asPage: number | null, chatId: number): Promise<UserChat | PageChat> {
    if (asPage) return this.pageChats.findOneBy({ chat: { id: chatId }, pageId: asPage });
    return this.userChats.findOneBy({ chat: { id: chatId }, userId: principal.id });
  }

  /** Get all users or pages' participant data (last read, notification settings, etc).
   * Note most of this data should not be exposed to the front-end, but some of it (like read status) is.
   */
  public async getParticipants(
    principal: User,
    asPage: number | null,
    chatId: number,
  ): Promise<Array<UserChat | PageChat>> {
    // TODO: validate that the user is supposed to see this
    const users: Array<UserChat | PageChat> = await this.userChats.findBy({ chat: { id: chatId }, deleted: false });
    const pages = await this.pageChats.findBy({ chat: { id: chatId } });
    return users.concat(pages);
  }

  /** Delete a chat from this user or page's list of chats. */
  public async deleteChat(principal: User, asPage: number | null, chatId: number): Promise<void> {
    if (asPage !== null) throw new NotImplementedException();

    const participant = await this.getOwnParticipant(principal, asPage, chatId);
    if (!participant) throw new NotFoundException();

    participant.deleted = true;
    this.userChats.save(participant);
  }

  /** Get a batch of messages, starting from the latest. */
  public async getRecentMessages(
    principal: User,
    asPage: number | null,
    chatId: number,
    skip: number,
  ): Promise<Message[]> {
    if (asPage !== null) throw new NotImplementedException();

    if (!(await this.getOwnParticipant(principal, asPage, chatId))) throw new ForbiddenException();

    return this.messages.find({
      where: { chat: { id: chatId } },
      order: { createdAt: "DESC" },
      skip,
      take: MESSAGE_BATCH_SIZE,
    });
  }

  /** Get all non-deleted chats for this user or page. Messages are of course not loaded, but
   * participants are loaded. */
  public async getMyChats(principal: User, asPage: number | null): Promise<Chat[]> {
    const infos = asPage
      ? await this.pageChats.find({
          where: { pageId: asPage },
          relations: { chat: { users: true, pages: true } },
        })
      : await this.userChats.find({
          where: { userId: Number(principal.id) },
          relations: { chat: { users: true, pages: true } },
        });
    return infos.map((info) => info.chat);
  }
}

export class ChatClient extends ChatService {}

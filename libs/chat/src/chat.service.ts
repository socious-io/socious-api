import { User } from "@app/users";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Chat } from "./models/chat.model";
import { Message } from "./models/message.model";
import { PageChat } from "./models/page-chat.model";
import { UserChat } from "./models/user-chat.model";

// TODO: in design stage
/* eslint-disable @typescript-eslint/no-unused-vars */

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) readonly chats: Repository<Chat>,
    @InjectRepository(Message) readonly messages: Repository<Message>,
    @InjectRepository(UserChat) readonly userChats: Repository<UserChat>,
    @InjectRepository(PageChat) readonly pageChats: Repository<PageChat>,
  ) {}

  /** If a chat exists with this set of participants, return it. Otherwise, create and return. */
  public async getChat(principal: User, asPage: number | null, users: number[], pages: number[]): Promise<Chat> {
    throw new NotImplementedException();
  }

  /** Send a message in a chat. TODO: media */
  public async sendMessage(principal: User, asPage: number | null, chatId: number, text: string): Promise<Message> {
    throw new NotImplementedException();
  }

  /** Update read status for a participant. */
  public async setReadStatus(principal: User, asPage: number | null, chatId: number, messageId: number): Promise<void> {
    throw new NotImplementedException();
  }

  /** Set whether the user wants notifications for this chat. */
  public async setMuted(principal: User, asPage: number | null, chatId: number, muted: boolean): Promise<void> {
    throw new NotImplementedException();
  }

  /** Get the user or page's participant data (last read, notification settings, etc). */
  public async getOwnParticipant(principal: User, asPage: number | null, chatId: number): Promise<UserChat | PageChat> {
    throw new NotImplementedException();
  }

  /** Get all users or pages' participant data (last read, notification settings, etc).
   * Note most of this data should not be exposed to the front-end, but some of it (like read status) is.
   */
  public async getParticipants(
    principal: User,
    asPage: number | null,
    chatId: number,
  ): Promise<Array<UserChat | PageChat>> {
    throw new NotImplementedException();
  }

  /** Delete a chat from this user or page's list of chats. */
  public async deleteChat(principal: User, asPage: number | null, chatId: number): Promise<void> {
    throw new NotImplementedException();
  }

  /** Get a batch of messages, starting from the latest. */
  public async getRecentMessages(
    principal: User,
    asPage: number | null,
    chatId: number,
    skip: number,
  ): Promise<Message[]> {
    throw new NotImplementedException();
  }

  /** Get all non-deleted chats for this user or page. Messages are of course not loaded, but
   * participants are loaded. */
  public async getMyChats(principal: User, asPage: number | null): Promise<Chat[]> {
    throw new NotImplementedException();
  }
}

export class ChatClient extends ChatService {}

import {
  Body,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { Controller } from "@nestjs/common";

import { Auditor, AuthService, JwtAuthGuard, User, UsersService } from "../../Identity";
import { ChatWithDto } from "../Dto/ChatWith";
import { SendMessageDto } from "../Dto/SendMessage";
import { Chat } from "../Models/Chat";
import { ChatParticipant } from "../Models/ChatParticipant";
import { ChatMessageService } from "../Services/ChatMessageService";
import { ChatService } from "../Services/ChatService";
import { ChatParticipantService } from "../Services/UserChatService";

@Controller("chat")
export class ChatController {
  constructor(
    readonly auth: AuthService,
    readonly chats: ChatService,
    readonly participants: ChatParticipantService,
    readonly messages: ChatMessageService,
    readonly users: UsersService
  ) {}

  /**
   * If a chat exists with this set of participants, return it. Otherwise, create and return.
   */
  @UseGuards(JwtAuthGuard)
  @Post("with")
  public async getChat(@Body() { users }: ChatWithDto, @Auditor() principal: User): Promise<Chat> {
    const chat = await this.chats.findOrCreate(mergeUsers(users, principal));
    return chat.publicView();
  }

  /**
   * Send a message in a chat. TODO: media
   */
  @UseGuards(JwtAuthGuard)
  @Post(":id/message")
  public async sendMessage(
    @Param("id", ParseIntPipe) chatId: number,
    @Body() content: SendMessageDto,
    @Auditor() principal: User
  ): Promise<{ id: number; createdAt: Date }> {
    const chat = await this.chats.findById(chatId);
    if (chat === undefined) {
      throw new NotFoundException();
    }
    const participant = await this.participants.findByChatAndUser(chatId, principal.id);
    if (participant === undefined) {
      throw new ForbiddenException();
    }
    const message = await this.messages.create(principal.id, chat, content.text);

    // ### Meta
    // Update meta information side effected by new message.

    this.chats.setUpdatedAt(chat.id, message.createdAt);
    this.participants.setAllRead(chat.id, false);

    // ### Emit
    // Send message to all active participants.

    // TODO: socket.emit ...

    return {
      id: message.id,
      createdAt: message.createdAt
    };
  }

  /**
   * Update read status for a participant.
   */
  @UseGuards(JwtAuthGuard)
  @Post(":id/read/:messageId")
  public async setReadStatus(
    @Param("id", ParseIntPipe) chatId: number,
    @Param("messageId", ParseIntPipe) messageId: number,
    @Auditor() principal: User
  ): Promise<any> {
    const chat = await this.chats.findById(chatId);
    if (chat === undefined) {
      throw new NotFoundException();
    }
    const participant = await this.participants.findByChatAndUser(chatId, principal.id);
    if (participant === undefined) {
      throw new NotFoundException();
    }
    const message = await this.messages.findById(messageId);
    if (message === undefined) {
      throw new NotFoundException();
    }
    await this.participants.setReadStatus(chatId, messageId, message.createdAt, chat.updatedAt);
    return { status: "ok" };
  }

  /**
   * Disable notifications for this chat.
   */
  @UseGuards(JwtAuthGuard)
  @Post(":id/mute")
  public async setMuted(@Param("id", ParseIntPipe) chatId: number, @Auditor() principal: User): Promise<any> {
    const participant = await this.participants.findByChatAndUser(chatId, principal.id);
    if (participant === undefined) {
      throw new NotFoundException();
    }
    this.participants.setMuted(participant.id, true);
    return { status: "ok" };
  }

  /**
   * Disable notifications for this chat.
   */
  @UseGuards(JwtAuthGuard)
  @Post(":id/unmute")
  public async unsetMuted(@Param("id", ParseIntPipe) chatId: number, @Auditor() principal: User): Promise<any> {
    const participant = await this.participants.findByChatAndUser(chatId, principal.id);
    if (participant === undefined) {
      throw new NotFoundException();
    }
    this.participants.setMuted(participant.id, false);
    return { status: "ok" };
  }

  /**
   * Get all users or pages' participant data (last read, notification settings, etc).
   * Note most of this data should not be exposed to the front-end, but some of it (like read status) is.
   */
  @UseGuards(JwtAuthGuard)
  @Get(":id/participants")
  public async getParticipants(@Param("id", ParseIntPipe) chatId: number): Promise<any[]> {
    const chats = await this.participants.findByChat(chatId);
    return chats.map((participant) => participant.publicView());
  }

  /**
   * Delete a chat from this user or page's list of chats.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  public async deleteChat(@Param("id", ParseIntPipe) chatId: number, @Auditor() principal: User): Promise<any> {
    const participant = await this.participants.findByChatAndUser(chatId, principal.id);
    if (participant === null) {
      throw new NotFoundException();
    }
    await this.participants.delete(chatId);
    return { status: "ok" };
  }

  /**
   * Get a batch of messages, starting from the latest.
   */
  @UseGuards(JwtAuthGuard)
  @Get(":id/messages")
  public async getRecentMessages(
    @Param("id", ParseIntPipe) chatId: number,
    @Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Auditor() principal: User
  ): Promise<any[]> {
    const participant = await this.participants.findByChatAndUser(chatId, principal.id);
    if (participant === undefined) {
      throw new ForbiddenException();
    }
    return this.messages.findRecent(chatId, skip);
  }

  /**
   * Get all non-deleted chats for this user or page. Messages are of course not loaded, but
   * participants are loaded.
   */
  @UseGuards(JwtAuthGuard)
  @Get("list")
  public async getMyChats(
    @Query("includeDeleted", new DefaultValuePipe(false), ParseBoolPipe) includeDeleted: boolean,
    @Auditor() principal: User
  ): Promise<any[]> {
    let chats = await this.chats.findByPrincipal(principal.id);
    if (includeDeleted === false) {
      chats = chats.filter((chat) => {
        for (const participant of chat.users) {
          if (participant.id == (principal.id as any)) return !participant.deleted;
        }
      });
    }
    return chats.map((chat) => chat.publicView(principal.id));
  }

  /**
   * Get the user or page's participant data (last read, notification settings, etc).
   */
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  public async getOwnParticipant(
    @Param("id", ParseIntPipe) chatId: number,
    @Auditor() principal: User
  ): Promise<ChatParticipant> {
    const participant = await this.participants.findByChatAndUser(chatId, principal.id);
    if (participant === null) {
      throw new NotFoundException();
    }
    return participant;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function mergeUsers(users: number[], principal: User) {
  if (users.includes(principal.id) === false) {
    return [...users, principal.id];
  }
  return users;
}

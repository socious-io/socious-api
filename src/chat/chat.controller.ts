import { AuthenticatedUser, AuthService, JwtAuthGuard } from "@app/auth";
import { ChatService } from "@app/chat";
import { User, UsersService } from "@app/users";
import {
  Body,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Controller } from "@nestjs/common";

import { ChatWithDTO } from "./chat-with.dto";
import { SendMessageDTO } from "./send-message.dto";

@Controller("chat")
export class ChatController {
  constructor(readonly auth: AuthService, readonly chat: ChatService, readonly users: UsersService) {}

  /** If a chat exists with this set of participants, return it. Otherwise, create and return. */
  @UseGuards(JwtAuthGuard)
  @Post("chatWith")
  public async getChat(@AuthenticatedUser() principal: User, @Body() participants: ChatWithDTO): Promise<any> {
    return (await this.chat.getChat(principal, participants.users)).publicView();
  }

  /** Send a message in a chat. TODO: media */
  @UseGuards(JwtAuthGuard)
  @Post(":id/message")
  public async sendMessage(
    @AuthenticatedUser() principal: User,
    @Param("id", ParseIntPipe) chatId: number,
    @Body() content: SendMessageDTO,
  ): Promise<any> {
    const message = await this.chat.sendMessage(principal, chatId, content.text);
    return {
      id: message.id,
      createdAt: message.createdAt,
    };
  }

  /** Update read status for a participant. */
  @UseGuards(JwtAuthGuard)
  @Post(":id/read/:messageId")
  public async setReadStatus(
    @AuthenticatedUser() principal: User,
    @Param("id", ParseIntPipe) chatId: number,
    @Param("messageId", ParseIntPipe) messageId: number,
  ): Promise<any> {
    this.chat.setReadStatus(principal, chatId, messageId);
    return { status: "ok" };
  }

  /** Disable notifications for this chat. */
  @UseGuards(JwtAuthGuard)
  @Post(":id/mute")
  public async setMuted(@AuthenticatedUser() principal: User, @Param("id", ParseIntPipe) chatId: number): Promise<any> {
    this.chat.setMuted(principal, chatId, true);
    return { status: "ok" };
  }

  /** Disable notifications for this chat. */
  @UseGuards(JwtAuthGuard)
  @Post(":id/unmute")
  public async unsetMuted(
    @AuthenticatedUser() principal: User,
    @Param("id", ParseIntPipe) chatId: number,
  ): Promise<any> {
    this.chat.setMuted(principal, chatId, false);
    return { status: "ok" };
  }

  /** Get all users or pages' participant data (last read, notification settings, etc).
   * Note most of this data should not be exposed to the front-end, but some of it (like read status) is.
   */
  @UseGuards(JwtAuthGuard)
  @Get(":id/participants")
  public async getParticipants(
    @AuthenticatedUser() principal: User,
    @Param("id", ParseIntPipe) chatId: number,
  ): Promise<any[]> {
    return (await this.chat.getParticipants(principal, chatId)).map((participant) => participant.publicView());
  }

  /** Delete a chat from this user or page's list of chats. */
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  public async deleteChat(
    @AuthenticatedUser() principal: User,
    @Param("id", ParseIntPipe) chatId: number,
  ): Promise<any> {
    this.chat.deleteChat(principal, chatId);
    return { status: "ok" };
  }

  /** Get a batch of messages, starting from the latest. */
  @UseGuards(JwtAuthGuard)
  @Get(":id/messages")
  public async getRecentMessages(
    @AuthenticatedUser() principal: User,
    @Param("id", ParseIntPipe) chatId: number,
    @Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ): Promise<any[]> {
    return this.chat.getRecentMessages(principal, chatId, skip);
  }

  /** Get all non-deleted chats for this user or page. Messages are of course not loaded, but
   * participants are loaded. */
  @UseGuards(JwtAuthGuard)
  @Get("list")
  public async getMyChats(
    @AuthenticatedUser() principal: User,
    @Query("includeDeleted", new DefaultValuePipe(false), ParseBoolPipe) includeDeleted: boolean,
  ): Promise<any[]> {
    let chats = await this.chat.getMyChats(principal);
    if (!includeDeleted)
      chats = chats.filter((chat) => {
        for (const participant of chat.users) {
          if (participant.id == (principal.id as any)) return !participant.deleted;
        }
      });
    return chats.map((chat) => chat.publicView(principal.id));
  }

  /** Get the user or page's participant data (last read, notification settings, etc). */
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  public async getOwnParticipant(
    @AuthenticatedUser() principal: User,
    @Param("id", ParseIntPipe) chatId: number,
  ): Promise<any> {
    const info = await this.chat.getOwnParticipant(principal, chatId);
    if (info) return info;
    else throw new NotFoundException();
  }
}

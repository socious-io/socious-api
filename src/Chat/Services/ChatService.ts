import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash } from "node:crypto";
import { DataSource, Repository } from "typeorm";

import { transaction } from "../../Transactions";
import { Chat } from "../Models/Chat";
import { UserChat } from "../Models/UserChat";
import { ChatMessageService } from "./ChatMessageService";
import { UserChatService } from "./UserChatService";

@Injectable()
export class ChatService {
  constructor(
    readonly dataSource: DataSource,
    readonly userChats: UserChatService,
    readonly messages: ChatMessageService,
    @InjectRepository(Chat) readonly chats: Repository<Chat>
  ) {}

  /**
   * Get or create a new chat guaranteeing a chat instance.
   *
   * @param users - Users participating in the chat.
   */
  public async findOrCreate(users: number[]): Promise<Chat> {
    const chat = await this.findByUsers(users);
    if (chat === null) {
      return this.create(users);
    }
    return chat;
  }

  /**
   * Create a new chat instance.
   *
   * @param users - Users participating in the chat.
   */
  public async create(users: number[]): Promise<Chat> {
    return transaction<Chat>(this.dataSource, async (queryRunner) => {
      let chat = new Chat();
      chat.participantsHash = this.hashParticipants(users);
      chat = await queryRunner.manager.save(chat);
      await Promise.all(users.map((user) => queryRunner.manager.insert(UserChat, { userId: user, chat })));
      return chat;
    });
  }

  /**
   * Set updated timestamp for given chat.
   *
   * @param id        - Chat primary id.
   * @param updatedAt - Updated at timestamp.
   */
  public async setUpdatedAt(id: number, updatedAt: Date): Promise<void> {
    await this.chats.update({ id }, { updatedAt });
  }

  /**
   * Get a chat instance.
   *
   * @param users - Users participating in the chat.
   */
  public async findByUsers(users: number[]): Promise<Chat | null> {
    // TODO: validate ids, handle blocks
    return this.chats.findOneBy({ participantsHash: this.hashParticipants(users) });
  }

  /**
   * Find chat by primary id.
   *
   * @param id - Chat primary id.
   */
  public async findById(id: number): Promise<Chat | null> {
    return this.chats.findOneBy({ id });
  }

  /**
   * Get all non-deleted chats for this user or page. Messages are of course not loaded, but
   * participants are loaded.
   *
   * @param userId - User primary id.
   */
  public async findByPrincipal(userId: number): Promise<Chat[]> {
    const infos = await this.userChats.findByParticipant(userId);
    return infos.map((info) => info.chat);
  }

  /**
   * Create a hash from a list of users.
   *
   * @param users - List of users to hash.
   */
  public hashParticipants(users: number[]): string {
    const hash = createHash("sha256");
    hash.update(JSON.stringify(users.sort()));
    return hash.digest("hex");
  }
}

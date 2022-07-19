import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash } from "node:crypto";
import { DataSource, Repository } from "typeorm";

import { transaction } from "../../Transactions";
import { Chat } from "../Models/Chat";
import { ChatMessageService } from "./ChatMessageService";
import { ChatParticipantService } from "./UserChatService";

@Injectable()
export class ChatService {
  constructor(
    readonly dataSource: DataSource,
    readonly participants: ChatParticipantService,
    readonly messages: ChatMessageService,
    @InjectRepository(Chat) readonly repository: Repository<Chat>
  ) {}

  /*
   |--------------------------------------------------------------------------------
   | Writes
   |--------------------------------------------------------------------------------
   */

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
      const chat = await queryRunner.manager.save(this.generate(users));
      await Promise.all(
        users.map((userId) => {
          return queryRunner.manager.save(this.participants.generate(userId, chat));
        })
      );
      return chat;
    });
  }

  /**
   * Generate a new chat instance.
   *
   * @remarks The generated chat instance does not automatically save to the
   * database. Returned instance will need to be saved manually and simply
   * ensures that the generated chat is valid and ready to submit.
   *
   * @example
   *
   * ```ts
   * class Foo {
   *   constructor(readonly chats: ChatService) {}
   *
   *   public async create(...args): Promise<Order> {
   *     const chat = this.userChats.generate(...args);
   *     return this.chats.repository.save(chat);
   *   }
   * }
   * ```
   *
   * @param users - Users participating in the chat.
   */
  public generate(users: number[]): Chat {
    const chat = new Chat();

    chat.participantsHash = this.hashParticipants(users);

    return chat;
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  /**
   * Set updated timestamp for given chat.
   *
   * @param id        - Chat primary id.
   * @param updatedAt - Updated at timestamp.
   */
  public async setUpdatedAt(id: number, updatedAt: Date): Promise<void> {
    await this.repository.update({ id }, { updatedAt });
  }

  /*
   |--------------------------------------------------------------------------------
   | Reads
   |--------------------------------------------------------------------------------
   */

  /**
   * Get a chat instance.
   *
   * @param users - Users participating in the chat.
   */
  public async findByUsers(users: number[]): Promise<Chat | null> {
    // TODO: validate ids, handle blocks
    return this.repository.findOneBy({ participantsHash: this.hashParticipants(users) });
  }

  /**
   * Find chat by primary id.
   *
   * @param id - Chat primary id.
   */
  public async findById(id: number): Promise<Chat | null> {
    return this.repository.findOneBy({ id });
  }

  /**
   * Get all non-deleted chats for this user or page. Messages are of course not loaded, but
   * participants are loaded.
   *
   * @param userId - User primary id.
   */
  public async findByPrincipal(userId: number): Promise<Chat[]> {
    const infos = await this.participants.findByUser(userId);
    return infos.map((info) => info.chat);
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

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

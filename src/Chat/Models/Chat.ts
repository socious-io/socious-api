import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ChatMessage } from "./ChatMessage";
import { ChatParticipant } from "./ChatParticipant";

@Entity("chats", { schema: "socious" })
export class Chat {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column()
  participantsHash: string;

  @OneToMany(() => ChatParticipant, (participant) => participant.chat)
  users: ChatParticipant[];

  @OneToMany(() => ChatMessage, (message) => message.chat)
  messages: ChatMessage[];

  @Column("timestamp", { default: () => "NOW()" })
  createdAt: Date;

  @Column("timestamp", { default: () => "NOW()" })
  updatedAt: Date;

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Filtered view of the chat data for sending to front-end.
   */
  public publicView(user?: number): any {
    const obj = { ...this };
    delete obj.participantsHash;
    if (this.users) {
      obj.users = this.users.map((participant) =>
        participant.userId == user ? participant : participant.publicView()
      );
    }
    return obj;
  }
}

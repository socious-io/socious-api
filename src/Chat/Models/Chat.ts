import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ChatMessage } from "./ChatMessage";
import { UserChat } from "./UserChat";

@Entity("chats", { schema: "socious" })
export class Chat {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column()
  participantsHash: string;

  @Column("timestamp", { default: () => "NOW()" })
  createdAt: Date;

  @Column("timestamp", { default: () => "NOW()" })
  updatedAt: Date;

  @OneToMany(() => UserChat, (participant) => participant.chat)
  users: UserChat[];

  @OneToMany(() => ChatMessage, (message) => message.chat)
  messages: ChatMessage[];

  /** Filtered view of the chat data for sending to front-end. */
  public publicView(user?: number): any {
    const obj = { ...this };
    delete obj.participantsHash;
    if (this.users) {
      obj.users = this.users.map((userChat) => (userChat.userId == user ? userChat : userChat.publicView()));
    }
    return obj;
  }
}

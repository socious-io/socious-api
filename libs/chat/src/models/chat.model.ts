import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Message } from "./message.model";
import { PageChat } from "./page-chat.model";
import { UserChat } from "./user-chat.model";

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

  @OneToMany(() => PageChat, (participant) => participant.chat)
  pages: PageChat[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  /** Filtered view of the chat data for sending to front-end. */
  public publicView(user?: number, page?: number): any {
    const obj = { ...this };
    delete obj.participantsHash;
    obj.users = this.users.map((userChat) => (userChat.userId == user ? userChat : userChat.publicView()));
    obj.pages = this.pages.map((pageChat) => (pageChat.pageId == page ? pageChat : pageChat.publicView()));
    return obj;
  }
}

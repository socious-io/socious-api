import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Message } from "./message.model";
import { PageChat } from "./page-chat.model";
import { UserChat } from "./user-chat.model";

@Entity("chats", { schema: "socious" })
export class Chat {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column()
  uuid?: string;

  @Column("timestamp", { default: () => "NOW()" })
  createdAt?: Date;

  @Column("timestamp", { default: () => "NOW()" })
  updatedAt?: Date;

  @OneToMany(() => UserChat, (participant) => participant.chat)
  users: UserChat[];

  @OneToMany(() => PageChat, (participant) => participant.chat)
  pages: PageChat[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}

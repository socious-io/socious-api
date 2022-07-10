import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Chat } from "./chat.model";

@Entity("chat_messages", { schema: "socious" })
export class Message {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column({ type: "bigint", unsigned: true })
  userId?: number;

  @Column({ type: "bigint", unsigned: true })
  pageId?: number;

  @Column("mediumtext")
  text?: string;

  @Column("timestamp", { default: () => "NOW()" })
  createdAt: Date;

  @Column("timestamp", { default: () => "NOW()" })
  updatedAt: Date;

  @Column()
  media?: string;

  @Column()
  mediaType?: string;
}

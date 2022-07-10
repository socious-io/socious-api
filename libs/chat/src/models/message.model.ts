import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Chat } from "./chat.model";

@Entity("chat_messages", { schema: "socious" })
export class Message {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column({ type: "bigint", unsigned: true, nullable: true })
  userId?: number;

  @Column({ type: "bigint", unsigned: true, nullable: true })
  pageId?: number;

  @Column("mediumtext", { nullable: true })
  text?: string;

  @Column("timestamp", { default: () => "NOW()" })
  createdAt: Date;

  @Column("timestamp", { default: () => "NOW()" })
  updatedAt: Date;

  @Column({ nullable: true })
  media?: string;

  @Column({ nullable: true })
  mediaType?: string;
}

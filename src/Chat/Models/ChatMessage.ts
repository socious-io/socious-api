import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Chat } from "./Chat";

@Entity("chat_messages", { schema: "socious" })
export class ChatMessage {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column({ type: "bigint", unsigned: true, nullable: true })
  userId?: number;

  @Column("mediumtext", { nullable: true })
  text?: string;

  @Column({ nullable: true })
  media?: string;

  @Column({ nullable: true })
  mediaType?: string;

  @Column("timestamp", { default: () => "NOW()" })
  createdAt: Date;

  @Column("timestamp", { default: () => "NOW()" })
  updatedAt: Date;

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  public toJSON(): any {
    const obj = { ...this };
    if (obj.userId === null) delete obj.userId;
    if (obj.media === null) delete obj.media;
    if (obj.mediaType === null) delete obj.mediaType;
    if (obj.updatedAt.valueOf() === obj.createdAt.valueOf()) delete obj.updatedAt;
    return obj;
  }
}

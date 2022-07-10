import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chats } from "./Chats";

@Entity("chat_messages")
export class ChatMessages {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("bigint", { name: "userId", unsigned: true })
  userId?: string;

  @Column("bigint", { name: "pageId", unsigned: true })
  pageId?: string;

  @Column("mediumtext", { name: "text" })
  text?: string;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt?: Date;

  @Column("timestamp", {
    name: "updatedAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt?: Date;

  @Column("varchar", { name: "media", length: 255 })
  media?: string;

  @Column("varchar", { name: "mediaType", length: 255 })
  mediaType?: string;

  @ManyToOne(() => Chats, (chats) => chats.chatMessages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "chatId", referencedColumnName: "id" }])
  chat?: Chats;
}

import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Chat } from "./chat.model";

export abstract class ChatParticipant {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @ManyToOne(() => Chat)
  chat: Chat;

  @Column()
  chatId: number;

  @Column({ default: () => "false" })
  muted: boolean;

  @Column()
  deleted: boolean;

  @Column()
  lastReadId?: number;

  @Column()
  lastReadDT?: Date;

  @Column()
  allRead: boolean;

  @Column("timestamp", { default: () => "NOW()" })
  createdAt?: Date;

  @Column("timestamp", { default: () => "NOW()" })
  updatedAt?: Date;
}

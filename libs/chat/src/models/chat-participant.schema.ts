import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Chat } from "./chat.model";

export abstract class ChatParticipant {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @ManyToOne(() => Chat)
  chat: Chat;

  @Column({ default: () => "false" })
  muted: boolean;

  @Column({ default: () => "false" })
  deleted: boolean;

  @Column({ nullable: true })
  lastReadId?: number;

  @Column({ nullable: true })
  lastReadDT?: Date;

  @Column({ default: () => "false" })
  allRead: boolean;

  @Column("timestamp", { default: () => "NOW()" })
  createdAt: Date;

  @Column("timestamp", { default: () => "NOW()" })
  updatedAt: Date;

  /** Filtered view of the participant data for sending to other participants. */
  public publicView(): any {
    return {
      lastReadId: this.lastReadId,
      lastReadDT: this.lastReadDT,
    };
  }
}

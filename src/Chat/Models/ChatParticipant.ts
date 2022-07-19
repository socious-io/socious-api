import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Chat } from "./Chat";

@Entity("user_chats", { schema: "socious" })
export class ChatParticipant {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column({ type: "bigint", unsigned: true })
  userId: number;

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

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Filtered view of the participant data for sending to other participants.
   */
  public publicView(): any {
    return {
      userId: this.userId,
      lastReadId: this.lastReadId,
      lastReadDT: this.lastReadDT
    };
  }

  public toJSON(): Omit<this, "id"> {
    return {
      ...this,
      id: undefined
    };
  }
}

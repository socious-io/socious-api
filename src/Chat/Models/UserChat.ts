import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Chat } from "./Chat";

@Entity("user_chats", { schema: "socious" })
export class UserChat {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

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

  /** Filtered view of the participant data for sending to other participants. */
  public publicView(): any {
    return {
      userId: this.userId,
      lastReadId: this.lastReadId,
      lastReadDT: this.lastReadDT
    };
  }

  toJSON(): any {
    const obj = { ...this };
    delete obj.id;
    return obj;
  }
}

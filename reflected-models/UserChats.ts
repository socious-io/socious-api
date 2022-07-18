import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_chats")
export class UserChats {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("bigint", { name: "chatId" })
  chatId?: string;

  @Column("tinyint", { name: "muted", default: () => "'0'" })
  muted?: number;

  @Column("tinyint", { name: "deleted" })
  deleted?: number;

  @Column("int", { name: "lastReadId" })
  lastReadId?: number;

  @Column("datetime", { name: "lastReadDT" })
  lastReadDt?: Date;

  @Column("tinyint", { name: "allRead" })
  allRead?: number;

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

  @Column("bigint", { name: "userId", unsigned: true })
  userId?: string;
}

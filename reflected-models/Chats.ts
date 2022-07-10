import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatMessages } from "./ChatMessages";

@Entity("chats")
export class Chats {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("varchar", { name: "uuid", length: 255 })
  uuid?: string;

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

  @OneToMany(() => ChatMessages, (chatMessages) => chatMessages.chat)
  chatMessages?: ChatMessages[];
}

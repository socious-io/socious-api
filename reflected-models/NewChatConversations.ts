import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("new_chat_conversations")
export class NewChatConversations {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "conversation_id", nullable: true })
  conversationId?: number | null;

  @Column("varchar", { name: "userable_type", nullable: true, length: 255 })
  userableType?: string | null;

  @Column("int", { name: "userable_id", nullable: true })
  userableId?: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

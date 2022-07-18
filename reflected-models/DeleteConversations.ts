import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("delete_conversations")
export class DeleteConversations {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("int", { name: "conversation_id" })
  conversationId?: number;

  @Column("varchar", { name: "userable_type", nullable: true, length: 255 })
  userableType?: string | null;

  @Column("int", { name: "userable_id", nullable: true })
  userableId?: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

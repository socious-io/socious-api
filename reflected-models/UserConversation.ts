import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_conversation")
export class UserConversation {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("int", { name: "conversation_id" })
  conversationId?: number;

  @Column("varchar", { name: "userable_type", nullable: true, length: 255 })
  userableType?: string | null;

  @Column("int", { name: "userable_id", nullable: true })
  userableId?: number | null;

  @Column("tinyint", { name: "notification", width: 1, default: () => "'1'" })
  notification?: boolean;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

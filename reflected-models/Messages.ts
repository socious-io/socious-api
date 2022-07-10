import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("messages")
export class Messages {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("int", { name: "conversation_id", nullable: true })
  conversationId?: number | null;

  @Column("varchar", { name: "userable_type", nullable: true, length: 255 })
  userableType?: string | null;

  @Column("int", { name: "userable_id", nullable: true })
  userableId?: number | null;

  @Column("mediumtext", { name: "text", nullable: true })
  text?: string | null;

  @Column("int", { name: "type", default: () => "'0'" })
  type?: number;

  @Column("datetime", { name: "read_at", nullable: true })
  readAt?: Date | null;

  @Column("int", { name: "is_seen", default: () => "'0'" })
  isSeen?: number;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @Column("text", { name: "media", nullable: true })
  media?: string | null;

  @Column("text", { name: "media_type", nullable: true })
  mediaType?: string | null;
}

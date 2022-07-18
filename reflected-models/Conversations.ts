import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("conversations")
export class Conversations {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("text", { name: "name", nullable: true })
  name?: string | null;

  @Column("text", { name: "uuid", nullable: true })
  uuid?: string | null;

  @Column("text", { name: "avatar", nullable: true })
  avatar?: string | null;

  @Column("int", { name: "status", nullable: true })
  status?: number | null;

  @Column("int", { name: "blocker_id", nullable: true })
  blockerId?: number | null;

  @Column("tinyint", { name: "is_replied", nullable: true, width: 1 })
  isReplied?: boolean | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

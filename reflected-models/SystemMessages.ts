import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("system_messages")
export class SystemMessages {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("int", { name: "user_id" })
  userId?: number;

  @Column("varchar", { name: "type", nullable: true, length: 255 })
  type?: string | null;

  @Column("text", { name: "data", nullable: true })
  data?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("notification_settings")
export class NotificationSettings {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "user_id" })
  userId?: number;

  @Column("tinyint", { name: "like", nullable: true, width: 1 })
  like?: boolean | null;

  @Column("tinyint", { name: "comment", nullable: true, width: 1 })
  comment?: boolean | null;

  @Column("tinyint", { name: "follow", nullable: true, width: 1 })
  follow?: boolean | null;

  @Column("tinyint", { name: "share", nullable: true, width: 1 })
  share?: boolean | null;

  @Column("tinyint", { name: "message", nullable: true, width: 1 })
  message?: boolean | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

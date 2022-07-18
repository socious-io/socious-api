import { Column, Entity, Index } from "typeorm";

@Index(
  "notifications_userable_type_userable_id_index",
  ["userableType", "userableId"],
  {}
)
@Index(
  "notifications_notifiable_type_notifiable_id_index",
  ["notifiableType", "notifiableId"],
  {}
)
@Entity("notifications")
export class Notifications {
  @Column("char", { primary: true, name: "id", length: 36 })
  id?: string;

  @Column("varchar", { name: "type", length: 255 })
  type?: string;

  @Column("int", { name: "type_id", nullable: true })
  typeId?: number | null;

  @Column("varchar", { name: "userable_type", length: 255 })
  userableType?: string;

  @Column("bigint", { name: "userable_id", unsigned: true })
  userableId?: string;

  @Column("varchar", { name: "notifiable_type", length: 255 })
  notifiableType?: string;

  @Column("bigint", { name: "notifiable_id", unsigned: true })
  notifiableId?: string;

  @Column("mediumtext", { name: "data", nullable: true })
  data?: string | null;

  @Column("varchar", { name: "key_translate", nullable: true, length: 255 })
  keyTranslate?: string | null;

  @Column("timestamp", { name: "read_at", nullable: true })
  readAt?: Date | null;

  @Column("timestamp", { name: "view_at", nullable: true })
  viewAt?: Date | null;

  @Column("int", { name: "delete", default: () => "'0'" })
  delete?: number;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

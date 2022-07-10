import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("activity_logs")
export class ActivityLogs {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "user_id" })
  userId?: number;

  @Column("int", { name: "user_action" })
  userAction?: number;

  @Column("int", { name: "activity_type" })
  activityType?: number;

  @Column("int", { name: "post_action", nullable: true })
  postAction?: number | null;

  @Column("int", { name: "status", nullable: true, default: () => "'0'" })
  status?: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

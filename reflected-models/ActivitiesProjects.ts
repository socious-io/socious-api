import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("activities_projects")
export class ActivitiesProjects {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("bigint", { name: "activity_id", unsigned: true })
  activityId?: string;

  @Column("bigint", { name: "project_id", unsigned: true })
  projectId?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

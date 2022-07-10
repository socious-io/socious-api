import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "project_applicant_project_id_applicant_id_unique",
  ["projectId", "applicantId"],
  { unique: true }
)
@Entity("project_applicant")
export class ProjectApplicant {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("bigint", { name: "project_id", unsigned: true })
  projectId?: string;

  @Column("bigint", { name: "applicant_id", unsigned: true })
  applicantId?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("job_users")
export class JobUsers {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "page_id", nullable: true })
  pageId?: number | null;

  @Column("int", { name: "type_job_id", nullable: true })
  typeJobId?: number | null;

  @Column("datetime", { name: "due_date", nullable: true })
  dueDate?: Date | null;

  @Column("text", { name: "body", nullable: true })
  body?: string | null;

  @Column("text", { name: "description", nullable: true })
  description?: string | null;

  @Column("varchar", { name: "title", nullable: true, length: 200 })
  title?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

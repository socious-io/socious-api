import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Projects } from "./Projects";

@Index("applicants_project_id_foreign", ["projectId"], {})
@Entity("applicants")
export class Applicants {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId?: string;

  @Column("bigint", { name: "page_id", unsigned: true })
  pageId?: string;

  @Column("bigint", { name: "project_id", unsigned: true })
  projectId?: string;

  @Column("text", { name: "cover_letter", nullable: true })
  coverLetter?: string | null;

  @Column("varchar", { name: "attachment_name", nullable: true, length: 255 })
  attachmentName?: string | null;

  @Column("varchar", { name: "attachment_link", nullable: true, length: 255 })
  attachmentLink?: string | null;

  @Column("int", { name: "application_status", nullable: true })
  applicationStatus?: number | null;

  @Column("int", { name: "payment_type", nullable: true })
  paymentType?: number | null;

  @Column("int", { name: "payment_rate", nullable: true })
  paymentRate?: number | null;

  @Column("varchar", { name: "offer_rate", nullable: true, length: 255 })
  offerRate?: string | null;

  @Column("varchar", { name: "offer_message", nullable: true, length: 255 })
  offerMessage?: string | null;

  @Column("datetime", { name: "due_date", nullable: true })
  dueDate?: Date | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @Column("text", { name: "page_feedback", nullable: true })
  pageFeedback?: string | null;

  @Column("text", { name: "applicant_feedback", nullable: true })
  applicantFeedback?: string | null;

  @ManyToOne(() => Projects, (projects) => projects.applicants, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "project_id", referencedColumnName: "id" }])
  project?: Projects;
}

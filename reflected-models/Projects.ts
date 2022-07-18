import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Applicants } from "./Applicants";
import { ProjectQuestionnaires } from "./ProjectQuestionnaires";

@Index("projects_other_party_id_index", ["otherPartyId"], {})
@Entity("projects")
export class Projects {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("bigint", { name: "page_id" })
  pageId?: string;

  @Column("bigint", { name: "group_id", nullable: true, unsigned: true })
  groupId?: string | null;

  @Column("varchar", { name: "title", length: 255 })
  title?: string;

  @Column("text", { name: "description" })
  description?: string;

  @Column("int", { name: "project_type", nullable: true })
  projectType?: number | null;

  @Column("int", { name: "project_length", nullable: true })
  projectLength?: number | null;

  @Column("int", { name: "country_id", nullable: true })
  countryId?: number | null;

  @Column("int", { name: "payment_type" })
  paymentType?: number;

  @Column("int", { name: "payment_scheme" })
  paymentScheme?: number;

  @Column("varchar", { name: "payment_currency", nullable: true, length: 255 })
  paymentCurrency?: string | null;

  @Column("varchar", {
    name: "payment_range_lower",
    nullable: true,
    length: 255,
  })
  paymentRangeLower?: string | null;

  @Column("varchar", {
    name: "payment_range_higher",
    nullable: true,
    length: 255,
  })
  paymentRangeHigher?: string | null;

  @Column("int", { name: "experience_level" })
  experienceLevel?: number;

  @Column("int", { name: "project_status" })
  projectStatus?: number;

  @Column("json", { name: "payload", nullable: true })
  payload?: object | null;

  @Column("varchar", {
    name: "other_party_id",
    nullable: true,
    comment:
      "ID of the project that comes from other applications (i.e. Idealist)",
    length: 60,
  })
  otherPartyId?: string | null;

  @Column("varchar", {
    name: "other_party_title",
    nullable: true,
    comment: "job, internship, volop...",
    length: 100,
  })
  otherPartyTitle?: string | null;

  @Column("varchar", {
    name: "other_party_updated",
    nullable: true,
    length: 30,
  })
  otherPartyUpdated?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @OneToMany(() => Applicants, (applicants) => applicants.project)
  applicants?: Applicants[];

  @OneToMany(
    () => ProjectQuestionnaires,
    (projectQuestionnaires) => projectQuestionnaires.project
  )
  projectQuestionnaires?: ProjectQuestionnaires[];
}

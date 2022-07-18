import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Projects } from "./Projects";

@Index("project_questionnaires_project_id_foreign", ["projectId"], {})
@Entity("project_questionnaires")
export class ProjectQuestionnaires {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("bigint", { name: "project_id", unsigned: true })
  projectId?: string;

  @Column("int", { name: "question_type_id" })
  questionTypeId?: number;

  @Column("varchar", { name: "question", length: 255 })
  question?: string;

  @Column("tinyint", { name: "is_required", width: 1, default: () => "'0'" })
  isRequired?: boolean;

  @Column("varchar", { name: "option_1", nullable: true, length: 255 })
  option_1?: string | null;

  @Column("varchar", { name: "option_2", nullable: true, length: 255 })
  option_2?: string | null;

  @Column("varchar", { name: "option_3", nullable: true, length: 255 })
  option_3?: string | null;

  @Column("varchar", { name: "option_4", nullable: true, length: 255 })
  option_4?: string | null;

  @Column("varchar", { name: "option_5", nullable: true, length: 255 })
  option_5?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @ManyToOne(() => Projects, (projects) => projects.projectQuestionnaires, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "project_id", referencedColumnName: "id" }])
  project?: Projects;
}

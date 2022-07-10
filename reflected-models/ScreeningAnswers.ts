import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("screening_answers")
export class ScreeningAnswers {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("bigint", { name: "applicant_id", unsigned: true })
  applicantId?: string;

  @Column("bigint", { name: "project_id", unsigned: true })
  projectId?: string;

  @Column("bigint", { name: "question_id", unsigned: true })
  questionId?: string;

  @Column("bigint", { name: "question_type_id", unsigned: true })
  questionTypeId?: string;

  @Column("varchar", { name: "option_selected_1", nullable: true, length: 255 })
  optionSelected_1?: string | null;

  @Column("varchar", { name: "option_selected_2", nullable: true, length: 255 })
  optionSelected_2?: string | null;

  @Column("varchar", { name: "option_selected_3", nullable: true, length: 255 })
  optionSelected_3?: string | null;

  @Column("varchar", { name: "option_selected_4", nullable: true, length: 255 })
  optionSelected_4?: string | null;

  @Column("varchar", { name: "option_selected_5", nullable: true, length: 255 })
  optionSelected_5?: string | null;

  @Column("varchar", { name: "answer_text", nullable: true, length: 255 })
  answerText?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

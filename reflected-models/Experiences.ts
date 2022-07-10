import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("experiences")
export class Experiences {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "title", nullable: true, length: 50 })
  title?: string | null;

  @Column("int", { name: "employment_type_id", nullable: true })
  employmentTypeId?: number | null;

  @Column("int", { name: "user_id", nullable: true })
  userId?: number | null;

  @Column("varchar", { name: "company_name", nullable: true, length: 200 })
  companyName?: string | null;

  @Column("timestamp", {
    name: "started_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  startedAt?: Date;

  @Column("timestamp", {
    name: "closed_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  closedAt?: Date;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

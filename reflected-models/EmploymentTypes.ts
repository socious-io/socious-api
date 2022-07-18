import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("employment_types")
export class EmploymentTypes {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "name", nullable: true, length: 50 })
  name?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

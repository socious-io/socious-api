import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("employees")
export class Employees {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "page_id", nullable: true })
  pageId?: number | null;

  @Column("int", { name: "user_id", nullable: true })
  userId?: number | null;

  @Column("tinyint", { name: "accept", nullable: true })
  accept?: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

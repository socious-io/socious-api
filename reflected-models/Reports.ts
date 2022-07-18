import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "reports_userable_type_userable_id_index",
  ["userableType", "userableId"],
  {}
)
@Index(
  "reports_reportable_type_reportable_id_index",
  ["reportableType", "reportableId"],
  {}
)
@Index(
  "reports_receivertable_type_receivertable_id_index",
  ["receivertableType", "receivertableId"],
  {}
)
@Entity("reports")
export class Reports {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "userable_type", length: 255 })
  userableType?: string;

  @Column("bigint", { name: "userable_id", unsigned: true })
  userableId?: string;

  @Column("varchar", { name: "reportable_type", length: 255 })
  reportableType?: string;

  @Column("bigint", { name: "reportable_id", unsigned: true })
  reportableId?: string;

  @Column("text", { name: "reason_id", nullable: true })
  reasonId?: string | null;

  @Column("varchar", { name: "receivertable_type", length: 255 })
  receivertableType?: string;

  @Column("bigint", { name: "receivertable_id", unsigned: true })
  receivertableId?: string;

  @Column("tinyint", { name: "status", nullable: true })
  status?: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt?: Date | null;
}

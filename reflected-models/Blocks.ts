import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "blocks_userable_type_userable_id_index",
  ["userableType", "userableId"],
  {}
)
@Index(
  "blocks_blocktable_type_blocktable_id_index",
  ["blocktableType", "blocktableId"],
  {}
)
@Entity("blocks")
export class Blocks {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "userable_type", length: 255 })
  userableType?: string;

  @Column("bigint", { name: "userable_id", unsigned: true })
  userableId?: string;

  @Column("varchar", { name: "blocktable_type", length: 255 })
  blocktableType?: string;

  @Column("bigint", { name: "blocktable_id", unsigned: true })
  blocktableId?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt?: Date | null;
}

import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "passion_taxonomies_passionable_type_passionable_id_index",
  ["passionableType", "passionableId"],
  {}
)
@Entity("passion_taxonomies")
export class PassionTaxonomies {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "passion_id", nullable: true })
  passionId?: number | null;

  @Column("varchar", { name: "passionable_type", length: 255 })
  passionableType?: string;

  @Column("bigint", { name: "passionable_id", unsigned: true })
  passionableId?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

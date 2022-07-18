import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "follows_followable_type_followable_id_index",
  ["followableType", "followableId"],
  {}
)
@Index(
  "follows_userable_type_userable_id_index",
  ["userableType", "userableId"],
  {}
)
@Entity("follows")
export class Follows {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "followable_type", length: 255 })
  followableType?: string;

  @Column("bigint", { name: "followable_id", unsigned: true })
  followableId?: string;

  @Column("varchar", { name: "userable_type", length: 255 })
  userableType?: string;

  @Column("bigint", { name: "userable_id", unsigned: true })
  userableId?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

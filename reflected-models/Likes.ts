import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "likes_likeable_type_likeable_id_index",
  ["likeableType", "likeableId"],
  {}
)
@Index(
  "likes_userable_type_userable_id_index",
  ["userableType", "userableId"],
  {}
)
@Entity("likes")
export class Likes {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "likeable_type", length: 255 })
  likeableType?: string;

  @Column("bigint", { name: "likeable_id", unsigned: true })
  likeableId?: string;

  @Column("varchar", { name: "userable_type", length: 255 })
  userableType?: string;

  @Column("bigint", { name: "userable_id", unsigned: true })
  userableId?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

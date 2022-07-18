import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "posts_postable_type_postable_id_index",
  ["postableType", "postableId"],
  {}
)
@Entity("posts")
export class Posts {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "passion_id", nullable: true })
  passionId?: number | null;

  @Column("mediumtext", { name: "content", nullable: true })
  content?: string | null;

  @Column("tinyint", { name: "delete", nullable: true })
  delete?: number | null;

  @Column("varchar", { name: "shareable_type", nullable: true, length: 255 })
  shareableType?: string | null;

  @Column("int", { name: "shareable_id", nullable: true })
  shareableId?: number | null;

  @Column("varchar", { name: "postable_type", length: 255 })
  postableType?: string;

  @Column("bigint", { name: "postable_id", unsigned: true })
  postableId?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

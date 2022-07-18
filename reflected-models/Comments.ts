import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "comments_commentable_type_commentable_id_index",
  ["commentableType", "commentableId"],
  {}
)
@Index(
  "comments_userable_type_userable_id_index",
  ["userableType", "userableId"],
  {}
)
@Entity("comments")
export class Comments {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "commentable_type", length: 255 })
  commentableType?: string;

  @Column("bigint", { name: "commentable_id", unsigned: true })
  commentableId?: string;

  @Column("text", { name: "content", nullable: true })
  content?: string | null;

  @Column("varchar", { name: "userable_type", length: 255 })
  userableType?: string;

  @Column("bigint", { name: "userable_id", unsigned: true })
  userableId?: string;

  @Column("int", { name: "delete", nullable: true, default: () => "'0'" })
  delete?: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

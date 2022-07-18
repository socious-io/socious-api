import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "images_imageable_type_imageable_id_index",
  ["imageableType", "imageableId"],
  {}
)
@Entity("images")
export class Images {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "imageable_type", length: 255 })
  imageableType?: string;

  @Column("bigint", { name: "imageable_id", unsigned: true })
  imageableId?: string;

  @Column("text", { name: "image_path", nullable: true })
  imagePath?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

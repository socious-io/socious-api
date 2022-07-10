import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("recommendations")
export class Recommendations {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "recommendation_id", nullable: true })
  recommendationId?: number | null;

  @Column("int", { name: "author_id", nullable: true })
  authorId?: number | null;

  @Column("int", { name: "endorsee_id", nullable: true })
  endorseeId?: number | null;

  @Column("varchar", { name: "content", nullable: true, length: 255 })
  content?: string | null;

  @Column("tinyint", { name: "approved", nullable: true, width: 1 })
  approved?: boolean | null;

  @Column("tinyint", { name: "dismissed", nullable: true, width: 1 })
  dismissed?: boolean | null;

  @Column("datetime", { name: "created_at" })
  createdAt?: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt?: Date;
}

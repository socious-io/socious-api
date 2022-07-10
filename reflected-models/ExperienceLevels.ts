import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("experience_levels")
export class ExperienceLevels {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "en_US", length: 255 })
  enUs?: string;

  @Column("varchar", { name: "ja_JP", length: 255 })
  jaJp?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

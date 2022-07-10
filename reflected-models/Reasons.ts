import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("reasons")
export class Reasons {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "en_US", nullable: true, length: 255 })
  enUs?: string | null;

  @Column("varchar", { name: "ja_JP", nullable: true, length: 255 })
  jaJp?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

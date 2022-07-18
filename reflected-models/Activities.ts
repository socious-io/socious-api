import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("activities_name_unique", ["name"], { unique: true })
@Entity("activities")
export class Activities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("migrations")
export class Migrations {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "migration", length: 255 })
  migration?: string;

  @Column("int", { name: "batch" })
  batch?: number;
}

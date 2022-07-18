import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("countries")
export class Countries {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "country_code", nullable: true, length: 255 })
  countryCode?: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name?: string | null;

  @Column("varchar", { name: "name_ja", nullable: true, length: 255 })
  nameJa?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

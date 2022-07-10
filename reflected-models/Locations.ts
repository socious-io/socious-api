import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("locations")
export class Locations {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "street", nullable: true, length: 255 })
  street?: string | null;

  @Column("int", { name: "city_id", nullable: true })
  cityId?: number | null;

  @Column("varchar", { name: "zip", nullable: true, length: 255 })
  zip?: string | null;

  @Column("int", { name: "country_id", nullable: true })
  countryId?: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

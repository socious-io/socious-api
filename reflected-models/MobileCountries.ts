import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mobile_countries")
export class MobileCountries {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "country", length: 255 })
  country?: string;

  @Column("varchar", { name: "country_ja", nullable: true, length: 255 })
  countryJa?: string | null;

  @Column("varchar", { name: "calling_code", length: 255 })
  callingCode?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

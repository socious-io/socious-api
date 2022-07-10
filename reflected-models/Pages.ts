import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("pages")
export class Pages {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "company_name", nullable: true, length: 255 })
  companyName?: string | null;

  @Column("mediumtext", { name: "bio", nullable: true })
  bio?: string | null;

  @Column("mediumtext", { name: "city", nullable: true })
  city?: string | null;

  @Column("mediumtext", { name: "city_ja", nullable: true })
  cityJa?: string | null;

  @Column("mediumtext", { name: "description_search", nullable: true })
  descriptionSearch?: string | null;

  @Column("mediumtext", { name: "description_search_ja", nullable: true })
  descriptionSearchJa?: string | null;

  @Column("varchar", { name: "country_id", nullable: true, length: 255 })
  countryId?: string | null;

  @Column("varchar", { name: "country_id_ja", nullable: true, length: 255 })
  countryIdJa?: string | null;

  @Column("text", { name: "address_detail", nullable: true })
  addressDetail?: string | null;

  @Column("text", { name: "mission", nullable: true })
  mission?: string | null;

  @Column("text", { name: "culture", nullable: true })
  culture?: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email?: string | null;

  @Column("text", { name: "image", nullable: true })
  image?: string | null;

  @Column("text", { name: "cover", nullable: true })
  cover?: string | null;

  @Column("int", { name: "mobile_countries_id", nullable: true })
  mobileCountriesId?: number | null;

  @Column("varchar", { name: "phone", nullable: true, length: 255 })
  phone?: string | null;

  @Column("varchar", { name: "wallet_address", nullable: true, length: 255 })
  walletAddress?: string | null;

  @Column("double", {
    name: "impact_score",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  impactScore?: number;

  @Column("varchar", { name: "summary", nullable: true, length: 255 })
  summary?: string | null;

  @Column("varchar", { name: "website", nullable: true, length: 200 })
  website?: string | null;

  @Column("int", {
    name: "organisation_type_id",
    nullable: true,
    unsigned: true,
  })
  organisationTypeId?: number | null;

  @Column("varchar", {
    name: "organisation_type_other",
    nullable: true,
    length: 255,
  })
  organisationTypeOther?: string | null;

  @Column("tinyint", { name: "verified", width: 1, default: () => "'0'" })
  verified?: boolean;

  @Column("varchar", { name: "profile_id", nullable: true, length: 255 })
  profileId?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @Column("int", { name: "created_by" })
  createdBy?: number;
}

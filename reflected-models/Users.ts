import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("users_email_unique", ["email"], { unique: true })
@Entity("users")
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("varchar", { name: "first_name", nullable: true, length: 70 })
  firstName?: string | null;

  @Column("varchar", { name: "username", length: 200 })
  username?: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name?: string | null;

  @Column("varchar", { name: "email", unique: true, length: 200 })
  email?: string;

  @Column("varchar", { name: "email_text", nullable: true, length: 255 })
  emailText?: string | null;

  @Column("timestamp", { name: "email_verified_at", nullable: true })
  emailVerifiedAt?: Date | null;

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

  @Column("varchar", { name: "password", length: 140 })
  password?: string;

  @Column("varchar", { name: "remember_token", nullable: true, length: 100 })
  rememberToken?: string | null;

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

  @Column("text", { name: "avatar", nullable: true })
  avatar?: string | null;

  @Column("text", { name: "cover_image", nullable: true })
  coverImage?: string | null;

  @Column("datetime", { name: "expiry_date", nullable: true })
  expiryDate?: Date | null;

  @Column("tinyint", { name: "active", width: 1, default: () => "'0'" })
  active?: boolean;

  @Column("varchar", { name: "activation_token", nullable: true, length: 255 })
  activationToken?: string | null;

  @Column("text", { name: "mission", nullable: true })
  mission?: string | null;

  @Column("mediumtext", { name: "bio", nullable: true })
  bio?: string | null;

  @Column("varchar", { name: "profile_id", nullable: true, length: 200 })
  profileId?: string | null;

  @Column("int", { name: "view_as", nullable: true })
  viewAs?: number | null;

  @Column("varchar", { name: "language", nullable: true, length: 255 })
  language?: string | null;

  @Column("timestamp", { name: "lock_otp", nullable: true })
  lockOtp?: Date | null;

  @Column("varchar", { name: "my_conversation", nullable: true, length: 255 })
  myConversation?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt?: Date | null;
}

import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", name: "first_name", length: 70, nullable: true })
  firstName?: string;

  @Column({ type: "varchar", length: 200 })
  username: string;

  @Column({ type: "varchar", nullable: true })
  name?: string;

  @Column({ type: "varchar", unique: true, length: 200 })
  email: string;

  @Column({ type: "varchar", name: "email_text", nullable: true })
  emailText?: string;

  @Column({ type: "datetime", name: "email_verified_at", nullable: true })
  emailVerifiedAt?: Date;

  @Column({ type: "int", name: "mobile_countries_id", nullable: true })
  mobileCountriesId?: number;

  @Column({ type: "varchar", nullable: true })
  phone?: string;

  @Column({ type: "varchar", name: "wallet_address", nullable: true })
  walletAddress?: string;

  @Column({ type: "float", name: "impact_score", default: "0.00" })
  impactScore: number;

  @Column({ type: "varchar", length: 140 })
  password: string;

  @Column({ type: "varchar", name: "remember_token", length: 100, nullable: true })
  rememberToken?: string;

  @Column({ type: "mediumtext", nullable: true })
  city?: string;

  @Column({ type: "mediumtext", name: "city_ja", nullable: true })
  cityJA?: string;

  @Column({ type: "mediumtext", name: "description_search", nullable: true })
  descriptionSearch?: string;

  @Column({ type: "mediumtext", name: "description_search_ja", nullable: true })
  descriptionSearchJA?: string;

  @Column({ type: "text", name: "address_detail", nullable: true })
  addressDetail?: string;

  @Column({ type: "text", nullable: true })
  avatar?: string;

  @Column({ type: "text", name: "cover_image", nullable: true })
  coverImage?: string;

  @Column({ type: "datetime", name: "expiry_date", nullable: true })
  expiryDate?: Date;

  @Column({ type: "boolean", default: false })
  active: boolean;

  @Column({ type: "varchar", name: "activation_token", nullable: true })
  activationToken?: string;

  @Column({ type: "text", nullable: true })
  mission?: string;

  @Column({ type: "mediumtext", nullable: true })
  bio?: string;

  @Column({ type: "varchar", name: "profile_id", length: 200, nullable: true })
  profileId?: string;

  @Column({ type: "int", name: "view_as", nullable: true })
  viewAs?: number;

  @Column({ type: "varchar", nullable: true })
  language?: string;

  @Column({ type: "datetime", name: "lock_otp", nullable: true })
  lockOtp?: Date;

  @Column({ type: "varchar", name: "my_conversation", nullable: true })
  myConversation?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  toJSON() {
    return {
      ...this,
      password: undefined
    };
  }
}

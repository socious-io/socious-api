import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users", { schema: "socious" })
export class PeopleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name!: string;

  @Column()
  username!: string;

  @Column()
  name!: string;

  @Column()
  email!: String;

  @Column()
  email_verified_at!: boolean;

  @Column()
  mobile_countries_id!: number;

  @Column()
  phone!: String;

  @Column()
  wallet_address!: String;

  @Column()
  impact_score!: number;

  @Column()
  city!: String;

  @Column()
  city_ja!: String;

  @Column()
  description_search!: String;

  @Column()
  description_search_ja!: String;

  @Column()
  country_id!: number;

  @Column()
  country_id_ja!: String;

  @Column()
  address_detail!: String;

  @Column()
  avatar!: String;

  @Column()
  cover_image!: String;

  @Column()
  expiry_date!: Date;

  @Column()
  active!: boolean;

  @Column()
  mission!: String;

  @Column()
  bio!: String;

  @Column()
  profile_id!: number;

  @Column()
  language!: String;

  @Column()
  my_conversation!: String;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  deleted_at!: Date;
}

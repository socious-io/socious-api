import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("pages", { schema: "socious" })
export class OrganizationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  company_name!: String;
  @Column()
  bio!: String;
  @Column()
  city!: String;
  @Column()
  city_ja!: String;
  @Column()
  description_search!: String;
  @Column()
  description_search_ja!: String;
  @Column()
  country_id!: String;
  @Column()
  country_id_ja!: String;
  @Column()
  address_detail!: String;
  @Column()
  mission!: String;
  @Column()
  culture!: String;
  @Column()
  email!: String;
  @Column()
  image!: String;
  @Column()
  cover!: String;
  @Column()
  mobile_countries_id!: String;
  @Column()
  phone!: String;
  @Column()
  wallet_address!: String;
  @Column()
  impact_score!: number;
  @Column()
  summary!: String;
  @Column()
  website!: String;
  @Column()
  organisation_type_id!: number;
  @Column()
  organisation_type_other!: number;
  @Column()
  verified!: boolean;
  @Column()
  profile_id!: number;
  @Column()
  created_at!: Date;
  @Column()
  updated_at!: Date;
  @Column()
  created_by!: number;
}

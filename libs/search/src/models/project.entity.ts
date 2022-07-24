import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("projects", { schema: "socious" })
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  page_id!: number;

  @Column()
  group_id!: number;

  @Column()
  title!: string;

  @Column("text")
  description!: String;

  @Column()
  project_type!: number;

  @Column()
  project_length!: number;

  @Column()
  country_id!: number;

  @Column()
  payment_type!: number;

  @Column()
  payment_scheme!: number;

  @Column()
  payment_currency!: string;

  @Column()
  payment_range_lower!: string;

  @Column()
  payment_range_higher!: string;

  @Column()
  experience_level!: number;

  @Column()
  project_status!: number;

  @Column()
  other_party_id!: string;

  @Column("text")
  other_party_url!: String;

  @Column()
  other_party_title!: String;

  @Column()
  other_party_updated!: String;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

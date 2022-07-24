import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
//Todo: apply FK
@Entity("posts", { schema: "socious" })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  passion_id!: number;

  @Column()
  content!: string;

  @Column()
  delete!: boolean;

  @Column("text")
  shareable_type!: number;

  @Column()
  shareable_id!: number;

  @Column()
  postable_type!: number;

  @Column()
  postable_id!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

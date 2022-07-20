import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { SkillUser } from "./SkillUser";

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "en_US", nullable: true, length: 255 })
  enUs?: string | null;

  @Column("varchar", { name: "ja_JP", nullable: true, length: 255 })
  jaJp?: string | null;

  @Column("timestamp", { default: () => "NOW()" })
  createdAt?: Date;

  @Column("timestamp", { default: () => "NOW()" })
  updatedAt?: Date;

  @OneToMany(() => SkillUser, (userSkills) => userSkills.user)
  skillUsers: SkillUser[];
}

import { User } from "src/Identity/Models/User";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Skill } from "./Skill";

@Entity("skill_users")
export class SkillUser {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt?: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt?: Date;

  @ManyToOne(() => Skill, (skill) => skill.skillUsers)
  @JoinColumn({ name: "skill_id" })
  public skill: Skill;

  @ManyToOne(() => User, (user) => user.skillUsers)
  @JoinColumn({ name: "user_id" })
  public user: User;
}

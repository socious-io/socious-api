import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../Identity/Models/User";
import { Skill } from "./Skill";

@Entity("skill_users")
export class UserSkill {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @ManyToOne(() => Skill, (skill) => skill.users)
  @JoinColumn({ name: "skill_id" })
  public skill: Skill;

  @ManyToOne(() => User, (user) => user.skills)
  @JoinColumn({ name: "user_id" })
  public user: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt?: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt?: Date;
}

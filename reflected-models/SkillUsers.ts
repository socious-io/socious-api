import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("skill_users")
export class SkillUsers {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "user_id", nullable: true })
  userId?: number | null;

  @Column("int", { name: "skill_id", nullable: true })
  skillId?: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}

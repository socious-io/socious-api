import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/Identity/Models/User";
import { DataSource, In, Repository } from "typeorm";

import { transaction } from "../../Transactions";
import { Skill } from "../Models/Skill";
import { SkillUser } from "../Models/SkillUser";

@Injectable()
export class SkillService {
  constructor(readonly dataSource: DataSource, @InjectRepository(Skill) readonly skills: Repository<Skill>) {}

  /**
   * Get all skills.
   */
  public async update(user: User, skills: Skill[]): Promise<SkillUser[]> {
    return transaction<SkillUser[]>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.delete(SkillUser, { user });
      const usersSkills = await Promise.all(
        skills.map((skill) => {
          return queryRunner.manager.save(SkillUser, { user, skill });
        })
      );
      return usersSkills;
    });
    /* await this.skillUsers.delete({ userId });
    const usersSkills = await Promise.all(
      skillIds.map((skillId) => {
        return this.skillUsers.save({ userId, skillId });
      })
    );
    return usersSkills.map((usersSkill) => usersSkill.skill); */
  }

  /**
   * Get all skills.
   */
  public async list(): Promise<Skill[]> {
    // TODO: order by language
    return this.skills.find();
  }

  /**
   * Get all skills.
   */
  public async findbyIds(ids: number[]): Promise<Skill[]> {
    // TODO: order by language
    return this.skills.find({ where: { id: In(ids) } });
  }
}

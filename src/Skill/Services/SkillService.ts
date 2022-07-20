import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/Identity/Models/User";
import { DataSource, In, Repository } from "typeorm";

import { transaction } from "../../Transactions";
import { Skill } from "../Models/Skill";
import { UserSkill } from "../Models/UserSkill";

@Injectable()
export class SkillService {
  constructor(readonly dataSource: DataSource, @InjectRepository(Skill) readonly skills: Repository<Skill>) {}

  /*
   |--------------------------------------------------------------------------------
   | Writes
   |--------------------------------------------------------------------------------
   */

  /**
   * Generate a new user skill instance.
   *
   * @remarks The generated user skill instance does not automatically save to the
   * database. Returned instance will need to be saved manually and simply
   * ensures that the generated user skill is valid and ready to submit.
   *
   * @example
   *
   * ```ts
   * class Foo {
   *   constructor(readonly skills: SkillService) {}
   *
   *   public async create(...args): Promise<UserSkill> {
   *     const userSkill = this.skills.generate(...args);
   *     return this.skills.repository.save(userSkill);
   *   }
   * }
   * ```
   */
  public generate(user: User, skill: Skill): UserSkill {
    const userSkill = new UserSkill();

    userSkill.user = user;
    userSkill.skill = skill;

    return userSkill;
  }

  /**
   * Update many to many users skills.
   */
  public async update(user: User, skills: Skill[]): Promise<UserSkill[]> {
    return transaction<UserSkill[]>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.delete(UserSkill, { user });
      const userSkills = await Promise.all(
        skills.map((skill) => {
          return queryRunner.manager.save(this.generate(user, skill));
        })
      );
      return userSkills;
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Reads
   |--------------------------------------------------------------------------------
   */

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
  public async findByIds(ids: number[]): Promise<Skill[]> {
    // TODO: order by language
    return this.skills.find({ where: { id: In(ids) } });
  }
}

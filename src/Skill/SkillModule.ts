import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IdentityModule } from "../Identity";
import { SkillController } from "./Controllers/SkillController";
import { SkillSeedController } from "./Controllers/SkillSeedController";
import { Skill } from "./Models/Skill";
import { UserSkill } from "./Models/UserSkill";
import { SkillSeeder } from "./Seeds/Skills";
import { SkillService } from "./Services/SkillService";

@Module({
  imports: [IdentityModule, TypeOrmModule.forFeature([Skill, UserSkill])],
  providers: [SkillService, SkillSeeder],
  controllers: [SkillController, SkillSeedController]
})
export class SkillModule {}

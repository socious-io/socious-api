import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IdentityModule } from "../Identity";
import { SkillController } from "./Controllers/SkillController";
import { Skill } from "./Models/Skill";
import { SkillUser } from "./Models/SkillUser";
import { SkillService } from "./Services/SkillService";

@Module({
  imports: [IdentityModule, TypeOrmModule.forFeature([Skill, SkillUser])],
  providers: [SkillService],
  controllers: [SkillController]
})
export class SkillModule {}

import { Get } from "@nestjs/common";
import { Controller } from "@nestjs/common";

import { SkillSeeder } from "../Seeds/Skills";

@Controller("dev")
export class SkillSeedController {
  constructor(readonly seeder: SkillSeeder) {}

  @Get("seed-skills")
  public async seed(): Promise<void> {
    return this.seeder.seed();
  }
}

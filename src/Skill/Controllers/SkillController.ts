import { Body, Get, Post, UseGuards } from "@nestjs/common";
import { Controller } from "@nestjs/common";

import { Auditor, AuthService, JwtAuthGuard, User, UsersService } from "../../Identity";
import { SkillUserDto } from "../Dto/SkillUserUpdate";
import { SkillService } from "../Services/SkillService";

@Controller("api")
export class SkillController {
  constructor(readonly auth: AuthService, readonly skillsService: SkillService, readonly usersService: UsersService) {}

  /**
   * Get all non-deleted chats for this user or page. Messages are of course not loaded, but
   * participants are loaded.
   */
  @UseGuards(JwtAuthGuard)
  @Get("list-skills")
  public async list(): Promise<any[]> {
    return this.skillsService.list();
  }

  @UseGuards(JwtAuthGuard)
  @Post("update-skills-user")
  public async update(@Body() body: SkillUserDto, @Auditor() user: User): Promise<any[]> {
    const skills = await this.skillsService.findbyIds(body.skills.slice(0, 5));
    const userSkills = await this.skillsService.update(user, skills);
    return userSkills.map((userSkill) => userSkill.skill);
  }
}

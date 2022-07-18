import { Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Auditor } from "../Decorators/Auditor";
import { JwtAuthGuard } from "../Guards/JwtAuthGuard";
import { LocalAuthGuard } from "../Guards/LocalAuthGuard";
import { AuthService } from "../Services/AuthService";

@Controller("auth")
export class AuthController {
  constructor(readonly auth: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  public async login(@Auditor() user) {
    return this.auth.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  public async getProfile(@Auditor() user) {
    return this.auth.profile(user.id);
  }
}

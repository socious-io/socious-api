import { Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Auditor } from "../Decorators/Auditor";
import { JwtAuthGuard } from "../Guards/JwtAuthGuard";
import { LocalAuthGuard } from "../Guards/LocalAuthGuard";
import { AccessToken, AuthService } from "../Services/AuthService";
import { UserProfile } from "../Services/UsersService";

@Controller("auth")
export class AuthController {
  constructor(readonly auth: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  public async login(@Auditor() user): Promise<AccessToken> {
    return this.auth.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  public async getProfile(@Auditor() user): Promise<UserProfile> {
    return this.auth.profile(user.id);
  }
}

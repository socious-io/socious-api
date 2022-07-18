import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../Guards/JwtAuthGuard";
import { LocalAuthGuard } from "../Guards/LocalAuthGuard";
import { AuthService } from "../Services/AuthService";

@Controller("auth")
export class AuthController {
  constructor(readonly auth: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  public async login(@Request() req: any) {
    return this.auth.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  public async getProfile(@Request() req: any) {
    return this.auth.profile(req.user.id);
  }
}

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { AuthService } from "../Services/AuthService";
import { UserProfile } from "../Services/UsersService";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(readonly auth: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  async validate(email: string, password: string): Promise<UserProfile> {
    const user = await this.auth.validate(email, password);
    if (user === undefined) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

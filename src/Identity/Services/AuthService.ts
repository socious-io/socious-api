import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "../Models/User";
import { PasswordService } from "./PasswordService";
import { UserProfile, UsersService } from "./UsersService";

@Injectable()
export class AuthService {
  constructor(readonly users: UsersService, readonly jwt: JwtService, readonly password: PasswordService) {}

  /**
   * Perform login operations for the given user and return a JWT
   * access token.
   *
   * @param user - User to login.
   */
  public async login(user: User): Promise<{ access_token: string }> {
    return {
      access_token: this.jwt.sign({
        id: user.id,
      }),
    };
  }

  /**
   * Retrieve user profile.
   *
   * @param id - User id.
   */
  public async profile(id: number): Promise<UserProfile | undefined> {
    return this.users.findById(id);
  }

  /**
   * Validate user credentials.
   *
   * @param email    - User email.
   * @param password - User password.
   */
  public async validate(email: string, password: string): Promise<UserProfile | undefined> {
    const user = await this.users.findByEmail(email);
    if (user === undefined) {
      return undefined;
    }
    const hasValidPassword = await this.password.compare(password, user.password);
    if (hasValidPassword === false) {
      return undefined;
    }
    return user;
  }
}

import { User } from "@app/users";
import { UserProfile, UsersService } from "@app/users";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(readonly users: UsersService, readonly jwt: JwtService) {}

  /**
   * Perform login operations for the given user and return a JWT
   * access token.
   *
   * @param user - User to login.
   */
  public async login(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id };
    return {
      access_token: this.jwt.sign(payload)
    };
  }

  /**
   * Retrieve user profile.
   *
   * @param id - User id.
   */
  public async profile(id: number): Promise<UserProfile | undefined> {
    const user = await this.users.findById(id);
    if (user === undefined) {
      return undefined;
    }
    return this.users.filter(user);
  }

  /*
   |--------------------------------------------------------------------------------
   | Validation Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Validate user credentials.
   *
   * @param email    - User email.
   * @param password - User password.
   */
  public async validateUser(email: string, password: string): Promise<UserProfile | undefined> {
    const user = await this.users.findByEmail(email);
    if (user === undefined) {
      return undefined;
    }
    const hasValidPassword = await this.compare(password, user.password);
    if (hasValidPassword === false) {
      return undefined;
    }
    return this.users.filter(user);
  }

  /*
   |--------------------------------------------------------------------------------
   | Password Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Compare a plain text password against a string hashed using bcrypt
   * algorithm either from Laravel or JavaScript.
   *
   * @note that we are replacing instances of $2y$ bcrypt prefix with
   * $2b$ as the former is not compatible with the javascript bcrypt
   * library.
   *
   * Fortunately we can simply replace the prefix with the supported one
   * and it should work for Laravel generated bcrypt hashes.
   *
   * @see https://github.com/kelektiv/node.bcrypt.js#compatibility-note
   *
   * @param password - Plain text password used to compare.
   * @param secret   - Hashed password to compare against.
   *
   * @returns Comparison result
   */
  public async compare(password: string, secret: string): Promise<boolean> {
    return bcrypt.compare(password, secret.replace("$2y$", "$2b$"));
  }
}

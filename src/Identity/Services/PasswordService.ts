import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class PasswordService {
  /**
   * Hash password using bcrypt algorithm.
   *
   * @param password - Password to hash.
   */
  public async hash(password: string) {
    return bcrypt.hash(password, 12);
  }

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

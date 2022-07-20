import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../Models/User";
import { PasswordService } from "./PasswordService";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) readonly repository: Repository<User>, readonly password: PasswordService) {}

  /*
   |--------------------------------------------------------------------------------
   | Writes
   |--------------------------------------------------------------------------------
   */

  /**
   * Create a new user.
   *
   * @param username - A human readable alias.
   * @param email    - Primary email address used for user lookup.
   * @param password - Plain text password to hash.
   */
  public async create(username: string, email: string, password: string): Promise<void> {
    await this.repository.save(await this.generate(username, email, password));
  }

  /**
   * Generate a new user instance.
   *
   * @remarks The generated user instance does not automatically save to the
   * database. Returned instance will need to be saved manually and simply
   * ensures that the generated user is valid and ready to submit.
   *
   * @example
   *
   * ```ts
   * class Foo {
   *   constructor(readonly users: UsersService) {}
   *
   *   public async create(...args): Promise<Order> {
   *     const user = this.messages.generate(...args);
   *     return this.messages.repository.save(user);
   *   }
   * }
   * ```
   */
  public async generate(username: string, email: string, password: string): Promise<User> {
    const user = new User();

    user.username = username;
    user.email = email;
    user.password = await this.password.hash(password);

    return user;
  }

  /*
   |--------------------------------------------------------------------------------
   | Reads
   |--------------------------------------------------------------------------------
   */

  public async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  public async findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  /*
   |--------------------------------------------------------------------------------
   | Destructors
   |--------------------------------------------------------------------------------
   */

  public async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

export type UserProfile = Omit<User, "password">;

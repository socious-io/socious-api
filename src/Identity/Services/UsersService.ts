import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { User } from "../Models/User";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) readonly users: Repository<User>) {}

  /*
   |--------------------------------------------------------------------------------
   | Write
   |--------------------------------------------------------------------------------
   */

  public async create(username: string, email: string, password: string): Promise<void> {
    await this.users
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        email,
        password: await bcrypt.hash(password, 12),
      })
      .execute();
  }

  /*
   |--------------------------------------------------------------------------------
   | Read
   |--------------------------------------------------------------------------------
   */

  public async findAll(): Promise<User[]> {
    return this.users.find();
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.findOneBy({ email });
  }

  public async findById(id: number): Promise<User | undefined> {
    return this.users.findOneBy({ id });
  }

  public async delete(id: number): Promise<void> {
    await this.users.delete(id);
  }
}

export type UserProfile = Omit<User, "password">;

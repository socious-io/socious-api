import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { User } from "../Models/User";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) readonly users: Repository<User>) {}

  public async create(username: string, email: string, password: string): Promise<void> {
    await this.users
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        email,
        password: await bcrypt.hash(password, 12)
      })
      .execute();
  }

  public async findAll(): Promise<User[]> {
    return this.users.find();
  }

  public async findOne(id: number): Promise<User> {
    return this.users.findOneBy({ id });
  }

  public async remove(id: number): Promise<void> {
    await this.users.delete(id);
  }
}

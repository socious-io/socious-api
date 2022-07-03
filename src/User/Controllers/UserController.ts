import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { UserService } from "../Services/UserService";

@Controller("users")
export class UserController {
  constructor(readonly users: UserService) {}

  @Post()
  public async create(
    @Body("username") username: string,
    @Body("email") email: string,
    @Body("password") password: string
  ) {
    await this.users.create(username, email, password);
  }

  @Get("test")
  public async test(): Promise<void> {
    const user = await this.users.findOne(1);
    console.log(user, await bcrypt.compare("admin", user.password));
  }

  @Get(":id")
  public async get(@Param("id", ParseIntPipe) id: number) {
    const user = await this.users.findOne(id);
    if (user) {
      return {
        ...user,
        password: undefined
      };
    }
  }
}

import { Body, Controller, Post } from "@nestjs/common";

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
}

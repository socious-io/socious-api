import { AuthService, JwtAuthGuard } from "@app/auth";
import { UserProfile, UsersService } from "@app/users";
import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor(readonly auth: AuthService, readonly users: UsersService) {}

  @Post()
  public async create(
    @Body("username") username: string,
    @Body("email") email: string,
    @Body("password") password: string
  ) {
    await this.users.create(username, email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  public async get(@Param("id", ParseIntPipe) id: number): Promise<UserProfile> {
    const user = await this.users.findById(id);
    if (user === undefined) {
      throw new NotFoundException();
    }
    return this.users.filter(user);
  }
}

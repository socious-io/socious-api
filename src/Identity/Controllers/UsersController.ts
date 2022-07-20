import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards
} from "@nestjs/common";

import { JwtAuthGuard } from "../Guards/JwtAuthGuard";
import { AuthService } from "../Services/AuthService";
import { UserProfile, UsersService } from "../Services/UsersService";

@Controller("users")
export class UsersController {
  constructor(readonly auth: AuthService, readonly users: UsersService) {}

  @Post()
  public async create(
    @Body("username") username: string,
    @Body("email") email: string,
    @Body("password") password: string
  ) {
    try {
      await this.users.create(username, email, password);
    } catch (err) {
      if (err.message.includes("Duplicate entry")) {
        throw new ConflictException(`User with email '${email}' already exists`);
      }
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  public async get(@Param("id", ParseIntPipe) id: number): Promise<UserProfile> {
    const user = await this.users.findById(id);
    if (user === null) {
      throw new NotFoundException();
    }
    return user;
  }
}

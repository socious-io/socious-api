import { AuthModule } from "@app/auth";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserController } from "./Controllers/UserController";
import { User } from "./Models/User";
import { UserService } from "./Services/UserService";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { config } from "../Config";
import { AuthController } from "./Controllers/AuthController";
import { UsersController } from "./Controllers/UsersController";
import { User } from "./Models/User";
import { AuthService } from "./Services/AuthService";
import { PasswordService } from "./Services/PasswordService";
import { UsersService } from "./Services/UsersService";
import { JwtStrategy } from "./Strategies/JwtStrategy";
import { LocalStrategy } from "./Strategies/LocalStrategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: config.auth.secret,
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  providers: [AuthService, PasswordService, UsersService, LocalStrategy, JwtStrategy],
  controllers: [AuthController, UsersController],
  exports: [AuthService, UsersService],
})
export class IdentityModule {}

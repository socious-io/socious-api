import { UsersModule } from "@app/users";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { config } from "./AuthConfig";
import { AuthService } from "./Services/AuthService";
import { JwtStrategy } from "./Strategies/JwtStrategy";
import { LocalStrategy } from "./Strategies/LocalStrategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: config.secret,
      signOptions: {
        expiresIn: "24h"
      }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}

import { Module } from "@nestjs/common";

import { AuthService } from "./Services/AuthService";

@Module({
  providers: [AuthService],
  controllers: [],
  exports: [AuthService]
})
export class AuthModule {}

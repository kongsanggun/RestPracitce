import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmailModule } from "../email/email.module";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserEntity } from "./entities/user.entity";

@Module({
  imports: [EmailModule, AuthModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

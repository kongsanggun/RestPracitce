import {
  Body,
  Controller,
  Get,
  Head,
  Param,
  Post,
  Query,
  Headers,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { UserLoginDto } from "./dto/user-login.dto";

import { UserInfo } from "./UserInfo";
import { AuthGuard } from "../../authGuard.controller";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.userService.createUser(name, email, password);
  } // 회원가입

  @Post("/email-verify")
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.userService.verifyEmail(signupVerifyToken);
  } // 이메일 확인

  @Post("/login")
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.userService.login(email, password);
  } // 로그인

  @UseGuards(AuthGuard) // 가드를 이용한 인가처리
  @Get("/:id")
  async getUserInfo(@Param("id") userId: string): Promise<UserInfo> {
    return await this.userService.getUserInfo(userId);
  } // 유저 확인
}

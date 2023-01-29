import { Controller, Get, Post, Headers, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { CreateTextDto } from './dto/create-text-dto';
import { TextService } from './text.service';

import { AuthGuard } from "../../authGuard.controller";
import { TextInfo } from './TextInfo';

@Controller('/text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get()
  getHello(): string {
    return '훙와';
  }

  @UseGuards(AuthGuard) // 가드를 이용한 인가처리
  @Post("/create")
  async createText(@Headers() headers: any, @Body() dto: CreateTextDto): Promise<string> {
    const { name, context } = dto;
    const jwtString = headers.authorization.split('Bearer ')[1];

    return await this.textService.createText(name, context, jwtString);
  } // 게시판 만들기

  @Get("/:id")
  async getText(@Param("id") textId: string): Promise<TextInfo> {
    return await this.textService.getTextInfo(textId);
  } // 게시판 조회

  @UseGuards(AuthGuard) // 가드를 이용한 인가처리
  @Delete("/:id/delete")
  async deleteText(@Param("id") textId: string, @Headers() headers: any): Promise<string> {
    const jwtString = headers.authorization.split('Bearer ')[1];
    return await this.textService.deleteText(textId, jwtString);
  } // 게시판 삭제

}
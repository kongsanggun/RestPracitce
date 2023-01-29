import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ulid } from 'ulid';

import { TextEntity } from './entities/text.entity';
import { Repository } from 'typeorm';

import * as jwt from "jsonwebtoken";
import { TextInfo } from './TextInfo';

@Injectable()
export class TextService {

  constructor(
    @InjectRepository(TextEntity)
    private textRepository: Repository<TextEntity>
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createText(name: string, context: string, jwtString: string) { 
    const decoded = jwt.decode(jwtString);
    //console.log(decoded);

    const createName = decoded["id"];
    //console.log(createName);

    await this.saveText(name, context, createName);
    return "done";
  }

  async getTextInfo(textId: string): Promise<TextInfo> {
    const text = await this.textRepository.findOne({
      where: { textId: textId }
    });

    if (!text) {
      throw new NotFoundException("해당 게시물이 존재하지 않습니다!");
    }

    return {
      name: text.name,
      context: text.context,
    };
  }

  async deleteText(textId: string, jwtString: string): Promise<string> {
    const decoded = jwt.decode(jwtString);
    const name = decoded["id"];

    const text = await this.textRepository.findOne({
      where: { textId: textId }
    });

    if (!text) {
      throw new NotFoundException("해당 게시물이 존재하지 않습니다!");
    }

    if (text.createName !== name) {
      throw new BadRequestException("등록자와 삭제하는 아이디가 달라 삭제할 수 없습니다.");
    }

    await this.removeText(textId);
    return "done";
  }

  private async saveText(
    name: string,
    context: string,
    createName: string
  ) {
    const text = new TextEntity();
    text.textId = ulid();
    text.name = name;
    text.context = context;
    text.createName = createName;
    await this.textRepository.save(text);
  }

  private async removeText(textId: string) {
    await this.textRepository.delete(textId);
  }

}

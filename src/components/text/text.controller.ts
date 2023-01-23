import { Controller, Get } from '@nestjs/common';
import { TextService } from './text.service';

@Controller('/text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get()
  getHello(): string {
    return '훙와';
  }
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TextEntity } from './entities/text.entity';
import { TextController } from './text.controller';
import { TextService } from './text.service';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([TextEntity])],
    controllers: [TextController],
    providers: [TextService],
})
export class TextModule {}

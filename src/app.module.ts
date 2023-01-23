import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './components/users/user.module';
import { TextModule } from './components/text/text.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './components/users/entities/user.entity';

@Module({
  imports: [UserModule, TextModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      entities: [UserEntity],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

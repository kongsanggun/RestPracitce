import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema'

import { UserModule } from './components/users/user.module';
import { TextModule } from './components/text/text.module';

import { UserEntity } from './components/users/entities/user.entity';

@Module({
  imports: [UserModule, 
    TextModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.development.env`],
      load: [emailConfig],
      isGlobal: true,
      //validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'test',
      entities: [UserEntity],
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

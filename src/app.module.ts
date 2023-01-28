import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigModule } from "@nestjs/config";
import emailConfig from "./config/emailConfig";
import { validationSchema } from "./config/validationSchema";

import { UserModule } from "./components/users/user.module";
import { TextModule } from "./components/text/text.module";

import { UserEntity } from "./components/users/entities/user.entity";
import authConfig from "./config/authConfig";

@Module({
  imports: [
    UserModule,
    TextModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.development.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: "mariadb",
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: "test",
      entities: [UserEntity],
      synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

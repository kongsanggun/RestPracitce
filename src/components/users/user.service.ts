import * as uuid from "uuid";
import { ulid } from "ulid";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { EmailService } from "../email/email.service";
import { UserInfo } from "./UserInfo";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(private emailService: EmailService,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email); // 가입하려는 유저가 존재하는지 검사한다.

    if (userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: emailAddress }
    });
    
    return user !== undefined;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    throw new Error('아직 안함');
  }

  async login(email: string, password: string): Promise<string> {
    throw new Error('아직 안함');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    throw new Error('아직 안함');
  }
}

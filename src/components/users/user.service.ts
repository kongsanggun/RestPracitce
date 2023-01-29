import * as uuid from "uuid";
import { ulid } from "ulid";
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { EmailService } from "../email/email.service";
import { AuthService } from "../auth/auth.service";
import { UserInfo } from "./UserInfo";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    private emailService: EmailService,
    private authService: AuthService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email); // 가입하려는 유저가 존재하는지 검사한다.

    if (userExist) {
      throw new UnprocessableEntityException(
        "해당 이메일로는 가입할 수 없습니다."
      );
    }

    const signupVerifyToken = uuid.v1();
    console.log(signupVerifyToken);

    await this.saveUser(name, email, password, signupVerifyToken); // DB에 저장
    await this.sendMemberJoinEmail(email, signupVerifyToken); // 이메일로 전송
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: emailAddress },
    });

    //console.log(user);

    return user !== undefined && user !== null;
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
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken },
    });

    console.log("결과");
    console.log(user);

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다");
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if (!(user.password === password)) {
      throw new NotAcceptableException("잘못된 비밀번호입니다.");
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfo> {

    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다!");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

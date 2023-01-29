import { IsString } from "class-validator";

export class VerifyEmailDto {
    @IsString() // 이거 필수로 있어야함 ㅜㅜㅜㅜㅜ 
    signupVerifyToken: string;
}
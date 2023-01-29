import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateTextDto {
    
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    readonly name: string;

    @IsString()
    @MinLength(1)
    @MaxLength(5000)
    readonly context: string;
}
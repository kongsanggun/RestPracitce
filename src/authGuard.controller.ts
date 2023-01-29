import { Request } from "express";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./components/auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.vaildateRequest(request);
    }


    private vaildateRequest(request: Request) {
        const jwtString = request.headers.authorization.split('Bearer ')[1];

        this.authService.verify(jwtString);

        return true;
    }
}
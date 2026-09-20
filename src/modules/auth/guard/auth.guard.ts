import { CanActivate, ExecutionContext, Injectable,UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { isJWT } from "class-validator";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService:AuthService){}
   async canActivate(context: ExecutionContext) {
       const httpcontext=context.switchToHttp();
       const request:Request=httpcontext.getRequest<Request>()
       const token=this.ExtractToken(request)
       request.user=await this.authService.ValidateAccessToken(token)
       return true

    }
    protected ExtractToken(request:Request){
        const{authorization}=request.headers;
        if(! authorization || authorization.trim()===" "){
            throw new UnauthorizedException ("login to your account ")
        }
        const [bearer,token]=authorization.split(" ")
        if(bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)){
            throw new UnauthorizedException ("login to your account ")
        }
        return token
    }
}
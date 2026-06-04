import { IsEmail, IsMobilePhone, isString, IsString, Length } from "class-validator";
import { ConfirmedPassword } from "src/common/decorators/password.decorators";

export class SignupDTo{
    @IsString()
    first_name:string
    @IsString()
    last_name:string
    @IsMobilePhone("fa-IR",{},{message:"phone number format is incorrect"})
    mobile:string
    @IsString()
    @IsEmail()
    email:string
    @IsString()
    @Length(6,20,{message:"password is incorrect"})
    password:string
    @IsString()
    @ConfirmedPassword("password")
    confirm_password:string
}
export class LoginDTO{
    email:string
    @IsString()
    @Length(6,20,{message:"password is incorrect"})
    password:string

}
import { IsMobilePhone, IsString, Length } from "class-validator";

export class SendOTPdto{
    @IsMobilePhone("fa-IR")
    mobile:string
}
export class CheckOTPdto{
    @IsMobilePhone("fa-IR",{},{message:"invalid mobile format"})
    mobile:string
    @IsString()
    @Length(5,5,{message:"invalid otp code"})
    code:string
}
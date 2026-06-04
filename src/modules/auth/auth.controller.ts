import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckOTPdto, SendOTPdto } from './dto/otp.dto';
import { LoginDTO, SignupDTo } from './dto/basic.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/send-otp')
  sendOTP(@Body() otpDto:SendOTPdto){
    return this.authService.sendOTP(otpDto)
  }
  @Post('/check-otp')
  checkOTP(@Body() otpDto:CheckOTPdto){
    return this.authService.CheckOTP(otpDto)
  }
  @Post('/signup')
  signup(@Body() signupDto:SignupDTo){
    return this.authService.SignUp(signupDto)
  }
  @Post('/login')
  login(@Body() loginDto:LoginDTO){
    return this.authService.Login(loginDto)
  }
}

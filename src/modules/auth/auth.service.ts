import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OTPEntity } from '../user/entities/otp.entity';
import { CheckOTPdto, SendOTPdto } from './dto/otp.dto';
import { randomInt } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './types/payload';
import { LoginDTO, SignupDTo } from './dto/basic.dto';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
        @InjectRepository(OTPEntity) private otpRepository:Repository<OTPEntity>,
        private JWtservice:JwtService,
        private ConfigService:ConfigService
    ){}
    async sendOTP(otpDto:SendOTPdto){
        const {mobile}=otpDto
        let user=await this.userRepository.findOneBy({mobile})
        if(!user){
            user=await this.userRepository.create({
                mobile
            })
            user=await this.userRepository.save(user)
        }
        await this.CreateOtpForUser(user)
        return{
            message:"Otp sent successfully"
        }
        
    }
    async CheckOTP(otpDto:CheckOTPdto){
        const {mobile,code}=otpDto
        const now=new Date()
        const user=await this.userRepository.findOne({
            where:{mobile},
            relations:{
                otp:true
            }
        })
        if(!user || !user?.otp) throw new UnauthorizedException("not found user")
        const otp=user?.otp
        if(otp.code !==code) throw new UnauthorizedException("otp code is incorrect")
        if(otp.expires_in<now) throw new UnauthorizedException("otp code is expired")
        if(!user.mobile_verify){
            await this.userRepository.update({id:user.id},{mobile_verify:true})
        }
        const{AccessToken,RefreshToken}=this.CreateTokenForUser({id:user.id,mobile})
        return {
            AccessToken,
            RefreshToken,
            message:"logged in successfully"
        }

    }
    async SignUp(signupDto:SignupDTo){
        const{first_name,last_name,mobile,password,email,}=signupDto
        await this.ChechEmail(email)
        await this.ChechMobile(mobile)
        let hashedPassword=this.HashedPassword(password)
        const user= this.userRepository.create({
            first_name,
            last_name,
            email,
            password:hashedPassword,
            mobile,
            mobile_verify:false
        })
        await this.userRepository.save(user)
        return{
            message:"signup successfully"
        }


    }
    async Login(loginDto:LoginDTO){
        const{email,password}=loginDto
        const user=await this.userRepository.findOneBy({email})
        if(!user) throw new UnauthorizedException("email or password is incorrect")
        if(! compareSync(password,user.password))throw new UnauthorizedException("email or password is incorrect")
        const {AccessToken,RefreshToken}=this.CreateTokenForUser({
         mobile:user.mobile,
         id:user.id
        })
        return{
            AccessToken,
            RefreshToken,
            message:"login successfully"
        }
    }
    async CreateOtpForUser(user:UserEntity){
        const expiresIn=new Date(new Date().getTime()+1000*60*2)
        const code=randomInt(10000,99999).toString()
        let otp=await this.otpRepository.findOneBy({userId:user.id})
        if(otp){
            otp.code=code
            otp.expires_in=expiresIn
        }else{
            otp=await this.otpRepository.create({
                code,
                expires_in:expiresIn,
                userId:user.id
            })
        }
        otp=await this.otpRepository.save(otp)
        user.otpId=otp.id
        await this.userRepository.save(user)
    }
    CreateTokenForUser(payload:TokenPayload){
        const AccessToken=this.JWtservice.sign(payload,{
            secret:this.ConfigService.get("JWT.AccessTokenSecret"),
            expiresIn:"30d"
        })
        const RefreshToken=this.JWtservice.sign(payload,{
            secret:this.ConfigService.get("JWT.RefreshTokenSecret"),
            expiresIn:"1y"
        })
        return{
           AccessToken,
           RefreshToken,
        }
    }
    async ValidateAccessToken(token:string){
        try {
          const payload=this.JWtservice.verify<TokenPayload>(token,{
            secret:this.ConfigService.get("JWT.AccessTokenSecret")
          })  
          if(typeof payload==="object" && payload.id){
            const user=await this.userRepository.findOneBy({id:payload.id})
            if(! user) throw new UnauthorizedException("login to your account ")
            return user
          }
          throw new UnauthorizedException("login to your account ")
        } catch (error) {
            throw new UnauthorizedException("login to your account ")
        }
    }
    async ChechEmail(email:string){
        const user=await this.userRepository.findOneBy({email})
        if(user) throw new ConflictException("user already exists")
    }
    async ChechMobile(mobile:string){
        const user=await this.userRepository.findOneBy({mobile})
        if(user) throw new ConflictException("user already exists")
    }
    HashedPassword(password:string){
        const salt=genSaltSync(10)
        return hashSync(password,salt)
    }
}

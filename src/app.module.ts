import { Module } from '@nestjs/common';
import { CustomConfigMOdule } from './modules/configs/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormDBconfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    CustomConfigMOdule,
    TypeOrmModule.forRootAsync({
      useClass:TypeormDBconfig,
      inject:[TypeormDBconfig]
    }),
    UserModule,
    AuthModule,
    JwtModule.register({})
  ],
  controllers: [],
  providers: [TypeormDBconfig],
})
export class AppModule {}

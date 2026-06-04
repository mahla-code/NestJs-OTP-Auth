import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";




@Injectable()
export class TypeormDBconfig implements TypeOrmOptionsFactory{
    constructor(private configService:ConfigService){}
    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
       return{
        type:"postgres",
        port:this.configService.get("DB.port"),
        host:this.configService.get("DB.host"),
        username:this.configService.get("DB.username"),
        password:this.configService.get("DB.password"),
        database:this.configService.get("DB.database"),
        synchronize:true,
        autoLoadEntities:true,
        // entities:[
        //     "dist/**/**/**/*.entity.{.ts,.js}",
        //     "dist/**/**/*.entity.{.ts,.js}"
        // ]
       }
    }

}


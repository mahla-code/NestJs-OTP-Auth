import { ConfigModule } from "@nestjs/config";
import { configurations } from "src/config/config";
import { Module } from '@nestjs/common';

@Module({
    imports:[
        ConfigModule.forRoot({
            load:configurations,
            isGlobal:true
        })
    ]
})
export class CustomConfigMOdule{}

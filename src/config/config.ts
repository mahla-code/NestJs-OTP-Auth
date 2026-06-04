import { registerAs } from "@nestjs/config";

export enum ConfigKeys{
    App="App",
    DB="DB",
    JWT="JWT"
}
const AppConfig=registerAs(ConfigKeys.App,()=>({
    port:process.env.PORT
}))
const JWTConfig=registerAs(ConfigKeys.JWT,()=>({
    AccessTokenSecret:process.env.JWT_ACCESS_SECRET,
    RefreshTokenSecret:process.env.JWT_REFRESH_SECRET
}))
const DbConfig=registerAs(ConfigKeys.DB,()=>({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
}))
export const configurations=[AppConfig,DbConfig,JWTConfig]

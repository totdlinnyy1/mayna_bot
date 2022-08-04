import { ConfigModule, ConfigService } from '@nestjs/config'
import {
    TelegrafModuleAsyncOptions,
    TelegrafModuleOptions,
} from 'nestjs-telegraf'
import { session } from 'telegraf'

export const telegrafConfig: TelegrafModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService): TelegrafModuleOptions => {
        const token = configService.get<string>('BOT_TOKEN')

        if (token === undefined) {
            throw new Error(
                "Environment variable 'BOT_TOKEN' cannot be undefined",
            )
        }

        return {
            token,
            middlewares: [session()],
        }
    },
    inject: [ConfigService],
}

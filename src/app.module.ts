import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TelegrafModule } from 'nestjs-telegraf'

import { config } from './config/config'
import { telegrafConfig } from './config/telegraf.config'
import { typeOrmConfig } from './config/typeorm.config'
import { GeolocationsModule } from './geolocations/geolocations.module'
import { TelegramModule } from './telegram/telegram.module'
import { UsersModule } from './users/users.module'

@Module({
    imports: [
        ConfigModule.forRoot(config),
        TypeOrmModule.forRootAsync(typeOrmConfig),
        TelegrafModule.forRootAsync(telegrafConfig),
        UsersModule,
        TelegramModule,
        GeolocationsModule,
    ],
})
export class AppModule {}

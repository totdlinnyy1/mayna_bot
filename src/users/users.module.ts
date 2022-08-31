import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GeolocationsModule } from '../geolocations/geolocations.module'

import { UserEntity } from './enities/user.entity'
import { BanUserScene } from './scenes/ban-user.scene'
import { CreateUserScene } from './scenes/create-user.scene'
import { UsersService } from './users.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), GeolocationsModule],
    providers: [UsersService, CreateUserScene, BanUserScene],
})
export class UsersModule {}

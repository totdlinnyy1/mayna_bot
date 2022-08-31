import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GeolocationsModule } from '../geolocations/geolocations.module'

import { UserEntity } from './enities/user.entity'
import { BanUserScene } from './scenes/ban-user.scene'
import { CreateAdminScene } from './scenes/create-admin.scene'
import { CreateUserScene } from './scenes/create-user.scene'
import { UsersService } from './users.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), GeolocationsModule],
    providers: [UsersService, CreateUserScene, BanUserScene, CreateAdminScene],
})
export class UsersModule {}

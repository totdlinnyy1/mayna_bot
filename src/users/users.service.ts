import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserRoleEnum } from '../enums/user-role.enum'

import { BanUserDto } from './dtos/ban-user.dto'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserEntity } from './enities/user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _usersRepository: Repository<UserEntity>,
    ) {}

    async findUserById(
        id: string,
        select: (keyof UserEntity)[] = ['id'],
    ): Promise<UserEntity | undefined> {
        return await this._usersRepository.findOne({
            where: { id, isBanned: false },
            select,
        })
    }

    async findUser(
        chat_id: number,
        select: (keyof UserEntity)[] = ['id'],
    ): Promise<UserEntity | undefined> {
        return await this._usersRepository.findOne({
            where: { chat_id, isBanned: false },
            select,
        })
    }

    async createUser(data: CreateUserDto): Promise<UserEntity> {
        return await this._usersRepository.save(data)
    }

    async banUser(data: BanUserDto): Promise<void> {
        await this._usersRepository.update(
            { id: data.id },
            { isBanned: true, banReason: data.banReason, bannedAt: new Date() },
        )
    }

    async createAdmin(id: string): Promise<void> {
        await this._usersRepository.update({ id }, { role: UserRoleEnum.ADMIN })
    }
}

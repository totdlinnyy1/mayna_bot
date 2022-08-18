import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserDto } from './dtos/create-user.dto'
import { UserEntity } from './enities/user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _usersRepository: Repository<UserEntity>,
    ) {}

    async findUser(
        chat_id: number,
        select: (keyof UserEntity)[] = ['id'],
    ): Promise<UserEntity | undefined> {
        return await this._usersRepository.findOne({
            where: { chat_id },
            select,
        })
    }

    async createUser(data: CreateUserDto): Promise<UserEntity> {
        return await this._usersRepository.save(data)
    }
}

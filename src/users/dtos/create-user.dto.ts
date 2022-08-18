import { Point } from 'geojson'

import { UserSexEnum } from '../../enums/user-sex.enum'

export interface CreateUserDto {
    name: string
    chat_id: number
    sex: UserSexEnum
    age: number
    city: string
    coordinates: Point
    bio?: string
}

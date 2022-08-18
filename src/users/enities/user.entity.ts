import { Point } from 'geojson'
import { Check, Column, Entity } from 'typeorm'

import { MAX_AGE, MIN_AGE } from '../../constants/age.constant'
import { CommonBaseEntity } from '../../entities/common-base.entity'
import { UserRoleEnum } from '../../enums/user-role.enum'
import { UserSexEnum } from '../../enums/user-sex.enum'

@Entity('users')
@Check(`"age" >= ${MIN_AGE} AND "age" <= ${MAX_AGE}`)
export class UserEntity extends CommonBaseEntity {
    @Column('text')
    name: string

    @Column('int', { unique: true })
    chat_id: number

    @Column({ type: 'enum', enum: UserSexEnum })
    sex: UserSexEnum

    @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
    role: UserRoleEnum

    @Column('smallint')
    age: number

    @Column('text')
    city: string

    @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
    coordinates: Point

    @Column('text', { default: '' })
    bio: string
}

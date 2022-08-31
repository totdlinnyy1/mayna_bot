import { UserRoleEnum } from '../enums/user-role.enum'

export const isAdmin = (role: UserRoleEnum): boolean =>
    role === UserRoleEnum.ADMIN || role === UserRoleEnum.SUPERADMIN

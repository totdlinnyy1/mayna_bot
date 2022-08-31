import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf'
import { NarrowedContext } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { MountMap } from 'telegraf/typings/telegram-types'

import { mainMenuButton } from '../../buttons/main-menu.button'
import { SceneNamesEnum } from '../../enums/scene-names.enum'
import { UserRoleEnum } from '../../enums/user-role.enum'
import { cancel } from '../../helpers/cancel.helper'
import { getUserId } from '../../helpers/get-user-id.helper'
import { UsersService } from '../users.service'

@Scene(SceneNamesEnum.CREATE_ADMIN)
export class CreateAdminScene {
    constructor(private readonly _usersService: UsersService) {}

    @SceneEnter()
    async onStart(@Ctx() ctx: SceneContext): Promise<void> {
        const id = getUserId(ctx)
        const user = await this._usersService.findUser(id, ['role'])
        if (user && user.role === UserRoleEnum.SUPERADMIN) {
            await ctx.reply('Укажите id пользователя')
        } else {
            await ctx.reply('У вас недостаточно прав')
            await ctx.scene.leave()
        }
    }

    @On('text')
    async onId(
        @Ctx() ctx: NarrowedContext<SceneContext, MountMap['text']>,
    ): Promise<void> {
        if (!(await cancel(ctx))) {
            const user = await this._usersService.findUserById(
                ctx.message.text,
                ['role', 'chat_id'],
            )
            if (user && user.role !== UserRoleEnum.ADMIN) {
                try {
                    await this._usersService.createAdmin(user.id)
                    await ctx.telegram.sendMessage(
                        user.chat_id,
                        'Поздравляем! Теперь вы являетесь админом!',
                    )
                    await ctx.replyWithMarkdownV2('Готово', {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: mainMenuButton,
                        },
                    })
                } catch (e) {
                    await ctx.reply(e.message)
                } finally {
                    await ctx.scene.leave()
                }
            } else {
                await ctx.reply(
                    'Либо пользователя не существует, либо он уже является админом',
                )
                await ctx.scene.reenter()
            }
        }
    }
}

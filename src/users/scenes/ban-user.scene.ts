import { Command, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf'
import { NarrowedContext } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { MountMap } from 'telegraf/typings/telegram-types'

import { mainMenuButton } from '../../buttons/main-menu.button'
import { CommandsEnum } from '../../enums/commands.enum'
import { SceneNamesEnum } from '../../enums/scene-names.enum'
import { getUserId } from '../../helpers/get-user-id.helper'
import { isAdmin } from '../../helpers/isAdmin.helper'
import { isUUID } from '../../helpers/isUUID.helper'
import { BanUserDto } from '../dtos/ban-user.dto'
import { UsersService } from '../users.service'

@Scene(SceneNamesEnum.BAN_USER)
export class BanUserScene {
    constructor(private readonly _usersService: UsersService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: SceneContext): Promise<void> {
        const id = getUserId(ctx)
        const user = await this._usersService.findUser(id, ['role'])
        if (user && isAdmin(user.role)) {
            await ctx.reply('Id пользователя:')
        } else {
            await ctx.reply('У вас недостаточно прав')
            await ctx.scene.leave()
        }
    }

    @On('text')
    async onId(
        @Ctx() ctx: NarrowedContext<SceneContext, MountMap['text']>,
    ): Promise<void> {
        if (isUUID(ctx.message.text)) {
            const user = await this._usersService.findUserById(ctx.message.text)
            if (user) {
                ;(ctx.scene.state as BanUserDto).id = user.id
                await ctx.reply('Причина бана:')
            } else {
                await ctx.reply(
                    'Такого пользователя не существует или он уже забанен',
                )
            }
        } else {
            const { id } = ctx.scene.state as BanUserDto
            if (id) {
                await this._usersService.banUser({
                    id,
                    banReason: ctx.message.text,
                })
                await ctx.reply('Готово')
                await ctx.scene.leave()
            } else {
                await ctx.reply('Для начала введите id пользователя')
            }
        }
    }

    @Command(CommandsEnum.CANCEL)
    async onCancel(@Ctx() ctx: SceneContext): Promise<void> {
        await ctx.replyWithMarkdownV2('Отмена', {
            reply_markup: {
                resize_keyboard: true,
                keyboard: mainMenuButton,
            },
        })
        await ctx.scene.leave()
    }
}

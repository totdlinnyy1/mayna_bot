import { NarrowedContext } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { MountMap } from 'telegraf/typings/telegram-types'

import { mainMenuButton } from '../buttons/main-menu.button'
import { CommandsEnum } from '../enums/commands.enum'

export const cancel = async (
    ctx: NarrowedContext<SceneContext, MountMap['text']>,
): Promise<boolean> => {
    if (ctx.message.text === `/${CommandsEnum.CANCEL}`) {
        await ctx.replyWithMarkdownV2('Отмена', {
            reply_markup: {
                resize_keyboard: true,
                keyboard: mainMenuButton,
            },
        })
        await ctx.scene.leave()
        return true
    }
    return false
}

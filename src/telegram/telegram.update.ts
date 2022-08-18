import { Ctx, Hears, Start, Update } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { WizardContext } from 'telegraf/typings/scenes'

import { SceneNamesEnum } from '../enums/scene-names.enum'

@Update()
export class TelegramUpdate {
    @Start()
    async onStart(@Ctx() ctx: Context): Promise<void> {
        await ctx.replyWithMarkdownV2(
            'Привет\nЯ помогу найти тебе интересную компанию рядом🥳\nТебе нужно только рассказать немного о себе и своих интерсах🎮\n\nПоехали?🤨',
            {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [[{ text: 'Поехали' }]],
                },
            },
        )
        await ctx.replyWithSticker(
            'CAACAgIAAxkBAAEFeP5i7M4T5jwO-E4v2jf_5g2LEhXiFwACJxgAApd54UvWARYS3sXfTykE',
        )
    }

    @Hears('Поехали')
    async onGo(@Ctx() ctx: WizardContext): Promise<void> {
        await ctx.scene.enter(SceneNamesEnum.CREATE_USER)
    }
}

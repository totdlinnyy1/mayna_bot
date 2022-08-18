import { Context } from 'telegraf'

const error = -1

export const getUserId = (ctx: Context): number => {
    if ('callback_query' in ctx.update) {
        return ctx.update.callback_query.from.id
    }

    if ('message' in ctx.update) {
        return ctx.update.message.from.id
    }

    if ('my_chat_member' in ctx.update) {
        return ctx.update.my_chat_member.from.id
    }

    return error
}

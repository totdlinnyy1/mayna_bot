import { Point } from 'geojson'
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf'
import { Markup, NarrowedContext } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { MountMap } from 'telegraf/typings/telegram-types'

import { boyOrGirlButton } from '../../buttons/boy-or-girl.button'
import { mainMenuButton } from '../../buttons/main-menu.button'
import { skipButton } from '../../buttons/skip.button'
import { MAX_AGE, MIN_AGE } from '../../constants/age.constant'
import { SceneNamesEnum } from '../../enums/scene-names.enum'
import { UserSexEnum } from '../../enums/user-sex.enum'
import { GeolocationsService } from '../../geolocations/geolocations.service'
import { cancel } from '../../helpers/cancel.helper'
import { getUserId } from '../../helpers/get-user-id.helper'
import { isNumeric } from '../../helpers/isNumeric'
import { CreateUserDto } from '../dtos/create-user.dto'
import { UsersService } from '../users.service'

import { createUserData } from './data/create-user.data'

interface State extends CreateUserDto {
    step: string
}

@Scene(SceneNamesEnum.CREATE_USER)
export class CreateUserScene {
    constructor(
        private readonly _usersService: UsersService,
        private readonly _geolocationsService: GeolocationsService,
    ) {}

    @SceneEnter()
    async onEnter(
        @Ctx() ctx: NarrowedContext<SceneContext, MountMap['text']>,
    ): Promise<void> {
        ;(ctx.scene.state as State).step = createUserData.introduction.stepName
        const id = getUserId(ctx)
        const user = await this._usersService.findUser(id)

        if (user) {
            await ctx.replyWithMarkdownV2(
                createUserData.introduction.userExist.reply.message,
                {
                    reply_markup: {
                        keyboard: mainMenuButton,
                        resize_keyboard: true,
                    },
                },
            )
            await ctx.scene.leave()
        } else {
            ;(ctx.scene.state as State).step = createUserData.getName.stepName
            ;(ctx.scene.state as State).chat_id = id
            await ctx.replyWithMarkdownV2(
                createUserData.introduction.askName.reply.message,
                {
                    reply_markup: {
                        remove_keyboard: true,
                    },
                },
            )
        }
    }

    @On('text')
    async onText(
        @Ctx() ctx: NarrowedContext<SceneContext, MountMap['text']>,
    ): Promise<void> {
        await cancel(ctx)
        const { step } = ctx.scene.state as State
        if (step === createUserData.getName.stepName) {
            const MAX_NAME_LENGTH = 30
            const name = ctx.message.text
            if (name.length > MAX_NAME_LENGTH) {
                await ctx.reply(
                    createUserData.getName.maxNameLengthError.reply.message,
                )
            } else {
                ;(ctx.scene.state as State).name = name
                await ctx.replyWithMarkdownV2(
                    createUserData.getName.askBio.reply.message,
                    {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: skipButton,
                        },
                    },
                )
                ;(ctx.scene.state as State).step =
                    createUserData.getBio.stepName
            }
        }
        if (step === createUserData.getBio.stepName) {
            const MAX_BIO_LENGTH = 2000
            const bio = ctx.message.text
            if (bio !== 'Пропустить') {
                if (bio.length > MAX_BIO_LENGTH) {
                    await ctx.reply(
                        createUserData.getBio.maxBioLengthError.reply.message,
                    )
                } else {
                    ;(ctx.scene.state as State).bio = bio
                    await ctx.replyWithMarkdownV2(
                        createUserData.getBio.askSex.reply.message,
                        {
                            reply_markup: {
                                resize_keyboard: true,
                                keyboard: boyOrGirlButton,
                            },
                        },
                    )
                    ;(ctx.scene.state as State).step =
                        createUserData.getSex.stepName
                }
            } else {
                await ctx.replyWithMarkdownV2(
                    createUserData.getBio.askSex.reply.message,
                    {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: boyOrGirlButton,
                        },
                    },
                )
                ;(ctx.scene.state as State).step =
                    createUserData.getSex.stepName
            }
        }
        if (step === createUserData.getSex.stepName) {
            const sex = ctx.message.text
            if (sex === 'Парень') {
                ;(ctx.scene.state as State).sex = UserSexEnum.MALE
                ;(ctx.scene.state as State).step =
                    createUserData.getCoordinates.stepName
                await this.sendLocationInvoice(ctx)
            } else if (sex === 'Девушка') {
                ;(ctx.scene.state as State).sex = UserSexEnum.FEMALE
                ;(ctx.scene.state as State).step =
                    createUserData.getCoordinates.stepName
                await this.sendLocationInvoice(ctx)
            } else {
                await ctx.replyWithMarkdownV2(
                    createUserData.getSex.sexError.reply.message,
                    {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: boyOrGirlButton,
                        },
                    },
                )
            }
        }
        if (step === createUserData.getCoordinates.stepName) {
            const response = await this._geolocationsService.getCoordinates(
                ctx.message.text,
            )
            if (response) {
                ;(ctx.scene.state as State).city = response.city
                ;(ctx.scene.state as State).coordinates = response.point
                await ctx.replyWithMarkdownV2(
                    createUserData.getCoordinates.askAge.reply.message,
                    { reply_markup: { remove_keyboard: true } },
                )
                ;(ctx.scene.state as State).step =
                    createUserData.getAge.stepName
            } else {
                await ctx.reply(
                    createUserData.getCoordinates.coordinatesError.reply
                        .message,
                )
            }
        }
        if (step === createUserData.getAge.stepName) {
            if (isNumeric(ctx.message.text)) {
                try {
                    const age = parseInt(ctx.message.text, 10)
                    if (age >= MIN_AGE && age <= MAX_AGE) {
                        ;(ctx.scene.state as State).age = age
                        const user = await this._usersService.createUser(
                            ctx.scene.state as State,
                        )
                        if (user) {
                            await ctx.replyWithMarkdownV2(
                                `Вот что получилось:\n${user.name}, ${user.age} ${user.city}\n\n${user.bio}\nВыбери, что хочешь делать дальше`,
                                {
                                    reply_markup: {
                                        resize_keyboard: true,
                                        keyboard: mainMenuButton,
                                    },
                                },
                            )
                            await ctx.scene.leave()
                        }
                    } else {
                        await ctx.reply(
                            createUserData.getAge.ageError.reply.message,
                        )
                    }
                } catch (e) {
                    await ctx.reply(
                        createUserData.getAge.parseAgeError.reply.message,
                    )
                }
            } else {
                await ctx.reply(
                    createUserData.getAge.parseAgeError.reply.message,
                )
            }
        }
    }

    @On('location')
    async onGetLocation(
        @Ctx() ctx: NarrowedContext<SceneContext, MountMap['location']>,
    ): Promise<void> {
        const { step, sex } = ctx.scene.state as State
        if (step === createUserData.getCoordinates.stepName && sex) {
            const point: Point = {
                type: 'Point',
                coordinates: [
                    ctx.message.location.longitude,
                    ctx.message.location.latitude,
                ],
            }
            const city = await this._geolocationsService.getCity(point)
            if (city) {
                ;(ctx.scene.state as State).city = city
                ;(ctx.scene.state as State).coordinates = point
                await ctx.replyWithMarkdownV2(
                    createUserData.getCoordinates.askAge.reply.message,
                    { reply_markup: { remove_keyboard: true } },
                )
                ;(ctx.scene.state as State).step =
                    createUserData.getAge.stepName
            } else {
                await ctx.reply(
                    createUserData.getCoordinates.coordinatesError.reply
                        .message,
                )
            }
        }
    }

    protected async sendLocationInvoice(ctx: SceneContext): Promise<void> {
        await ctx.replyWithMarkdownV2(
            createUserData.getSex.askCoordinates.reply.message,
            { reply_markup: { remove_keyboard: true } },
        )
        await ctx.reply(
            'Напиши название города или отправь координаты',
            Markup.keyboard([
                Markup.button.locationRequest('Отправить местоположение'),
            ]).resize(),
        )
    }
}

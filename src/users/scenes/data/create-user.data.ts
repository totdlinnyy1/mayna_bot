export const createUserData = {
    introduction: {
        stepName: 'introduction',
        userExist: {
            reply: {
                type: 'text',
                message: 'А я тебя помню, хочешь снова начать искать компанию?',
            },
        },
        askName: {
            reply: { type: 'text', message: 'Введи свое имя:' },
        },
    },
    getName: {
        stepName: 'get_name',
        maxNameLengthError: {
            reply: {
                type: 'text',
                message: 'Ох, что-то слишком длинно, давай покороче',
            },
        },
        askBio: {
            reply: {
                type: 'text',
                message:
                    'Теперь расскажи о себе:\nЭто не обязательно, но это поможет другим определиться добавить тебя в компанию или нет',
            },
        },
    },
    getBio: {
        stepName: 'get_bio',
        maxBioLengthError: {
            reply: {
                type: 'text',
                message:
                    'Круто, конечно, что ты можешь о себе столько рассказать, но, пожалуйста, уложись в 2000 символов',
            },
        },
        askSex: {
            reply: {
                type: 'text',
                message: 'Ты девушка или парень?',
            },
        },
    },
    getSex: {
        stepName: 'get_sex',
        sexError: {
            reply: {
                type: 'text',
                message: 'Ты девушка или парень?',
            },
        },
        askCoordinates: {
            reply: {
                type: 'text',
                message:
                    'Где ты живешь?\nЭто нужно для того, чтобы найти компанию рядом',
            },
        },
    },
    getCoordinates: {
        stepName: 'get_coordinates',
        coordinatesError: {
            reply: {
                type: 'text',
                message:
                    'Что-то пошло не так попробуй ввести назавние города или повтори попытку позже',
            },
        },
        askAge: {
            reply: {
                type: 'text',
                message: 'Теперь напиши сколько тебе лет',
            },
        },
    },
    getAge: {
        stepName: 'get_age',
        parseAgeError: {
            reply: {
                type: 'text',
                message: 'Возраст должен быть целым числом',
            },
        },
        ageError: {
            reply: {
                type: 'text',
                message: 'Извини, но ты не подходишь по взорасту',
            },
        },
    },
}

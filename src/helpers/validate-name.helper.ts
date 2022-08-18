const MAX_NAME_LENGTH = 20
export const validateName = (name: string): boolean | string => {
    if (name.length > MAX_NAME_LENGTH) {
        return `Ох, какое-то длинное имя, напиши что-нибудь меньше ${MAX_NAME_LENGTH} символов`
    }

    return true
}

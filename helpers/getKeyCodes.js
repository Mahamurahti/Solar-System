export function isKeyboardNumber(keycode) {
    return keycode >= 48 && keycode <= 57
}

export function isNumpadNumber(keycode) {
    return keycode >= 96 && keycode <= 105
}

export function isSpace(keycode) {
    return keycode === 32
}
export function isKeyboardNumber(keycode) {
    return keycode >= 48 && keycode <= 57
}

export function isNumpadNumber(keycode) {
    return keycode >= 96 && keycode <= 105
}

export function isSpace(keycode) {
    return keycode === 32
}

export function isControl(keycode) {
    return keycode === 17
}

export function isQWERTYUIOP(keycode) {
    const keys = [69, 73, 79, 80, 81, 82, 84, 85, 87, 89]
    return keys.includes(keycode)
}
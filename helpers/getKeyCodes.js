/**
 * isKyeboardNumber returns true if the keycode is a number from keyboard
 * @param keycode is the keycode that is being checked
 * @returns {boolean}
 * @namespace getKeyCodes
 */
export function isKeyboardNumber(keycode) {
    return keycode >= 48 && keycode <= 57
}

/**
 * isNumpadNumber returns true if the keycode is a number from numpad
 * @param keycode is the keycode that is being checked
 * @returns {boolean}
 * @namespace getKeyCodes
 */
export function isNumpadNumber(keycode) {
    return keycode >= 96 && keycode <= 105
}

/**
 * isSpace returns true if the keycode is that of space
 * @param keycode is the keycode that is being checked
 * @returns {boolean}
 * @namespace getKeyCodes
 */
export function isSpace(keycode) {
    return keycode === 32
}

/**
 * isControl return true if the keycode is that of control
 * @param keycode is the keycode that is being checked
 * @returns {boolean}
 * @namespace getKeyCodes
 */
export function isControl(keycode) {
    return keycode === 17
}

/**
 * isQWERTYUIOP returns true if the keycode is any of the following keys: Q, W, E, R, T, Y, U, I, O or P
 * @param keycode is the keycode that is being checked
 * @returns {boolean}
 * @namespace getKeyCodes
 */
export function isQWERTYUIOP(keycode) {
    const keys = [69, 73, 79, 80, 81, 82, 84, 85, 87, 89]
    return keys.includes(keycode)
}
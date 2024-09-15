export type State = {
    content: string;
    shift: boolean;
    capsLock: boolean;
}

export function getNewState(state: State, key: string) {
    const newState = { ...state };

    key = key.toLowerCase().trim();

    if (key === "shift")
        newState.shift = !state.shift;

    if (key === "caps") {
        newState.capsLock = !state.capsLock;
        newState.shift = newState.capsLock;
    }

    if (key === "tab")
        newState.content += "    ";

    if (key === "enter")
        newState.content += "\n";

    if (key === "space")
        newState.content += " ";

    if (standardKeys.includes(key)) {
        newState.content += state.shift ? key.toUpperCase() : key;

        if (!state.capsLock && state.shift)
            newState.shift = false;

        if (state.capsLock && !state.shift)
            newState.shift = true;
    }

    return newState;
}

export const standardKeys =
    "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>? ";

export const keyboard = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"],
    ["   shift   ", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
    ["space"],
];

export const uppercaseKeyboard = [
    ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"],
    ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|"],
    ["CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "ENTER"],
    ["   SHIFT   ", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"],
    ["SPACE"],
];

/**
 * @type {Gamepad[]}
 */
let lastGamepadData = []

/**
 * @param {Gamepad} gamepad 
 */
function getLastGamepadData(gamepad) {
    return lastGamepadData.find(g => gamepad.id == g.id)
}

/**
 * @param {Gamepad} gamepad 
 */
function flattenGamepadData(gamepad) {
    return {
        axes: gamepad.axes,
        buttons: gamepad.buttons.map(button => ({pressed: button.pressed})),
        id: gamepad.id
    }
}

/**
 * @param {Gamepad} gamepad 
 */
function setLastGamepadData(gamepad) {
    let index = lastGamepadData.findIndex(g => gamepad.id == g.id)

    if (index >= 0)
        lastGamepadData[index] = flattenGamepadData(gamepad)
    else
        lastGamepadData.push(flattenGamepadData(gamepad))
}

function processGamepadInputs() {
    let gamepads = navigator.getGamepads()

    Object.values(gamepads).forEach(gamepad => {
        if (!gamepad) return

        let last = getLastGamepadData(gamepad)
        
        if (last) {
            let didChangeAxes = last.axes.some((axis, i) => axis != gamepad.axes[i])

            if (didChangeAxes)
                window.dispatchEvent(new CustomEvent(
                    "g4gamepadaxischanged",
                    {
                        detail: {gamepad}
                    }
                ))

            gamepad.buttons.forEach((button, i) => {
                if (button.pressed && !last.buttons[i].pressed) {
                    window.dispatchEvent(new CustomEvent(
                        "g4gamepadbuttonpressed",
                        {
                            detail: {
                                gamepad, button: i
                            }
                        }
                    ))
                } else if (!button.pressed && last.buttons[i].pressed) {
                    window.dispatchEvent(new CustomEvent(
                        "g4gamepadbuttonreleased",
                        {
                            detail: {
                                gamepad, button: i
                            }
                        }
                    ))
                }
            })
        }

        setLastGamepadData(gamepad)
    })
}

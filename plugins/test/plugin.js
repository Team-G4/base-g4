class JasonMode extends G4.Mode {
    constructor() {
        super("Jason") // name
    }

    getRings(
        levelIndex // the number of the generated level
    ) {
        return [
            new G4.Ring(
                [
                    new G4.RingBall(
                        0, 200, 30
                    ),
                    new G4.RingBall(
                        0.5, 200, 50
                    )
                ],
                1, // frequency multiplier
                false // not a distraction, enable collision
            )
        ]
    }

    getThemeColors() {
        return {
            background: "#ff0",
            damage: "#fee",

            foreground: "#000",
            obstacle1: "#000",
            obstacle2: "#000",

            cannon: "#f00",
            bullet: "#00f"
        }
    }
}

// Register the new mode!
plugin.registerMode(new JasonMode())
class PolarMode extends G4.Mode {
    constructor() {
        super("Polar") // name
    }

    getRings(
        levelIndex // the number of the generated level
    ) {
        return [
            new G4.Ring(
                G4.levelGen.generateRing(
                    G4.levelGen.ringTypes.TYPE_A,
                    2, 250
                ),
                1, false,
                100, 0.5, 0
            ),
            new G4.Ring(
                G4.levelGen.generateRing(
                    G4.levelGen.ringTypes.TYPE_A,
                    2, 250
                ),
                1, false,
                100, 0.5, 0.5
            ),
            new G4.Ring(
                G4.levelGen.generateRing(
                    G4.levelGen.ringTypes.TYPE_D,
                    3, 300
                ),
                0.5, false,
                100, 1, 0
            ),
            new G4.Ring(
                G4.levelGen.generateRing(
                    G4.levelGen.ringTypes.TYPE_D,
                    3, 300
                ),
                0.5, false,
                100, 1, 0.5
            )
        ]
    }

    getThemeColors() {
        return {
            background: "#272032",
            damage: "#2D2639",

            foreground: "#50B9C9",
            obstacle1: "#D73E71",
            obstacle2: "#66BAA7",

            cannon: "#FFF4F8",
            bullet: "#FFFF00"
        }
    }
}

// Register the new modes!
plugin.registerMode(new PolarMode())
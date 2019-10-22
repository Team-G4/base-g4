class JasonMode extends G4.Mode {
    constructor() {
        super("Jason") // name
    }

    getRings(
        levelIndex // the number of the generated level
    ) {
        let ringBallCounts = []

        levelIndex += 3
        while (levelIndex) {
            if (levelIndex > 6) {
                ringBallCounts.unshift(6)
                levelIndex -= 6
            } else {
                ringBallCounts.unshift(levelIndex)
                levelIndex = 0
            }
        }

        let rings = ringBallCounts.map((count, i) => {
            let items = []
            let angle = 1 / count, start = i * Math.sqrt(2)
            let distance = 200 + i * 60

            for (let i = 0; i < count; i++) {
                items.push(
                    new G4.RingBall(
                        (i * angle + start) % 1,
                        distance, 20
                    )
                )
            }

            return new G4.Ring(items, (1/2)**i, false)
        })

        return rings
    }

    getThemeColors() {
        return {
            background: "#1F342E",
            damage: "#324B4F",

            foreground: "#50B9C9",
            obstacle1: "#50B9C9",
            obstacle2: "#BEF386",

            cannon: "#BEFBFF",
            bullet: "#00A9CA"
        }
    }
}

class Easy2Mode extends G4.Mode {
    constructor() {
        super("Easy 2") // name
    }

    getRings(
        levelIndex // the number of the generated level
    ) {
        return [
            new G4.Ring(
                G4.levelGen.generateRing(
                    G4.levelGen.ringTypes.TYPE_C,
                    3, 200
                ),
                1, false
            ),
            new G4.Ring(
                G4.levelGen.generateRing(
                    G4.levelGen.ringTypes.TYPE_C,
                    2, 300
                ),
                1, false
            )
        ]
    }

    getThemeColors() {
        return {
            background: "#1F342E",
            damage: "#324B4F",

            foreground: "#50B9C9",
            obstacle1: "#50B9C9",
            obstacle2: "#BEF386",

            cannon: "#BEFBFF",
            bullet: "#00A9CA"
        }
    }
}

// Register the new modes!
plugin.registerMode(new JasonMode())
plugin.registerMode(new Easy2Mode())
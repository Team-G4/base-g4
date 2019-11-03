class BubbleMode extends G4.Mode {
    constructor() {
        super("Bubble") // name
    }

    getRings(
        levelIndex // the number of the generated level
    ) {
        return [
            new G4.Ring(
                [
                    new G4.RingBall(0, 200, 30),
                    new G4.RingBall(0.2, 200, 30),
                    new G4.RingBall(0.4, 200, 30),
                    new G4.RingBall(0.6, 200, 30),
                    new G4.RingBall(0.8, 200, 30)
                ],
                1, false
            ),
            new G4.Ring(
                [
                    new G4.RingBall(0.033, 300, 30),
                    new G4.RingBall(0.233, 300, 30),
                    new G4.RingBall(0.433, 300, 30),
                    new G4.RingBall(0.633, 300, 30),
                    new G4.RingBall(0.833, 300, 30)
                ],
                1, false
            ),
            new G4.Ring(
                [
                    new G4.RingBall(0.066, 400, 30),
                    new G4.RingBall(0.266, 400, 30),
                    new G4.RingBall(0.466, 400, 30),
                    new G4.RingBall(0.666, 400, 30),
                    new G4.RingBall(0.866, 400, 30)
                ],
                1, false
            )
        ]
    }

    moveElement(
        element,
        dTime, dRawTime, absoluteTime
    ) {
        if (element instanceof G4.RingBall) {
            element.angle = element.defaults.angle + Math.sin(absoluteTime * 1.5 + element.defaults.angle * 2 * Math.PI) * 0.3
            element.distance = element.defaults.distance + Math.sin(absoluteTime * 3 + element.defaults.angle * 2 * Math.PI) * 50
            element.radius = (Math.sin(absoluteTime * 3 + element.defaults.angle * 2 * Math.PI) / 2 + 0.5) * 50 + 20
        }

        return true
    }

    renderElement(
        element, viewport, absoluteTime
    ) {
        if (element instanceof G4.RingBall) {
            let path = G4.render.getElementPath(element)

            viewport.saveState()

            viewport.translate(10, 10)
            viewport.fillPath(path, "#00000050")

            viewport.restoreState()

            viewport.fillPath(path)
            viewport.strokePath(path, "#000", 2)

            return true
        }

        return false
    }

    getThemeColors() {
        return {
            background: "#372F33",
            damage: "#382C2D",

            foreground: "#B56191",
            obstacle1: "#B56191",
            obstacle2: "#FFA96B",

            cannon: "#ECD037",
            bullet: "#FFFFFF"
        }
    }
}

class Star {
    constructor() {
        this.x = Math.random()
        this.y = 1
        this.yVelo = Math.random() * 0.5 + 0.5
    }
}

class RetroXMode extends G4.Mode {
    constructor() {
        super("RetroX") // name

        this.stars = []
        this.lastTime = 0
    }

    getRings(
        levelIndex // the number of the generated level
    ) {
        return G4.levelGen.generateMode("nox", levelIndex)
    }

    getLevelName(levelIndex) {
        return "Anna Ou"
    }

    removeInvisibleStars() {
        this.stars.forEach((star, i) => {
            if (star.y < -0.1) this.stars.splice(i, 1)
        })
    }

    renderBackground(viewport, gameTime) {
        this.removeInvisibleStars()
        this.stars.push(new Star())

        this.stars.forEach(star => {
            let starPath = viewport.createPath()

            let x = star.x * viewport.width - viewport.width / 2
            let y = star.y * viewport.height - viewport.height / 2

            starPath.rect(
                1.5 * x - 5, 1.5 * y - 10, 10, 20
            )
            viewport.fillPath(starPath, "#333")

            star.y -= star.yVelo * 0.03
        })
    }

    renderRings(rings, viewport, gameTime) {
        let ringsPath = viewport.createPath()

        rings.forEach(ring => {
            ringsPath.addPath(
                G4.render.getRingPath(ring)
            )
        })

        let colors = [
            ["red", 10 * Math.sin(gameTime) + 20],
            ["green", 10 * Math.sin(gameTime) + 20],
            ["blue", 10 * Math.sin(gameTime) + 20]
        ]

        let acc = 0
        colors.forEach(v => acc += v[1])

        viewport.scale(1, 0.8)
    
        viewport.translate(
            0,
            acc
        )


        for (let i = colors.length - 1; i >= 0; i--) {
            viewport.fillPath(ringsPath, colors[i][0])
            viewport.translate(
                0,
                -colors[i][1]
            )
        }

        viewport.fillPath(ringsPath, "yellow")
    }

    renderCannon(cannon, viewport, gameTime) {
        let path = G4.render.getCannonPath(cannon)

        viewport.scale(1, 0.8)

        viewport.translate(0, 100)
        viewport.fillPath(path, "#222")

        viewport.translate(0, -25)
        viewport.fillPath(path, "#555")

        viewport.translate(0, -25)
        viewport.fillPath(path, "#999")

        viewport.translate(0, -25)
        viewport.fillPath(path, "#ccc")

        viewport.translate(0, -25)
        viewport.fillPath(path, "#fff")
    }

    renderProjectile(bullet, viewport, gameTime) {
        let path = viewport.createPath()

        path.arc(
            bullet.x, bullet.y,
            10, 0, Math.PI * 2
        )

        viewport.scale(1, 0.8)
        viewport.fillPath(path, "white")
    }

    getThemeColors() {
        return {
            background: "#000000",
            damage: "#100000",

            foreground: "#AAAAAA",
            obstacle1: "#FFFFFF",
            obstacle2: "#FFFFFF",

            cannon: "#FFFFFF",
            bullet: "#FFFFFF"
        }
    }
}

class AnnaOuMode extends G4.Mode {
    constructor() {
        super("Anna Ou") // name

        this.p = ""
        
        this.posX = 0
        this.posY = 0
    }

    getRings(
        levelIndex // the number of the generated level
    ) {
        return [
            new G4.Ring(
                [
                    new G4.RingBall(0, 0, 30)
                ],
                1, true
            )
        ]
    }

    getLevelName(levelIndex) {
        return `and i ${this.p}oop`
    }

    moveElement(
        element,
        dTime, dRawTime, absoluteTime
    ) {
        element.centerX = 20 * this.posX
        element.centerY = 20 * this.posY

        return true
    }

    handleKeyPress(code) {
        switch (code) {
            case "ArrowUp":
                this.posY -= 0.3;
                break
            case "ArrowDown":
                this.posY += 0.3;
                break
            case "ArrowLeft":
                this.posX -= 0.3;
                break
            case "ArrowRight":
                this.posX += 0.3;
                break
            case "KeyP":
                this.p += "p"
            default:
                return false
        }
        return true
    }
}

// Register the new modes!
plugin.registerMode(new BubbleMode())
plugin.registerMode(new RetroXMode())
plugin.registerMode(new AnnaOuMode())
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

            let x = star.x * viewport.width
            let y = star.y * viewport.height

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

    getColors() {
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

    getColors() {
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

let {BubbleMode} = plugin.import("bubble.js")

// Register the new modes!
plugin.registerMode(new BubbleMode())
plugin.registerMode(new RetroXMode())
plugin.registerMode(new AnnaOuMode())

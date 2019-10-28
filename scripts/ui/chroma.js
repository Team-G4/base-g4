class Chroma {
    constructor(appInfo) {
        this.initialized = false

        this.chromaAppInfo = appInfo

        this.sessionId = null
        this.sessionURL = null

        this.heartbeatTimer = null
    }

    async init() {
        var res = await fetch("http://localhost:54235/razer/chromasdk", {
            method: "POST",
            body: JSON.stringify(this.chromaAppInfo),
            headers: {
                "Content-Type": "application/json"
            }
        })
        var data = await res.json()
        
        if ("sessionid" in data && "uri" in data) {
            this.sessionId = data.sessionid
            this.sessionURL = data.uri
            this.initialized = true

            this.heartbeatTimer = setInterval(() => {
                fetch(this.sessionURL + "/heartbeat", {
                    method: "PUT"
                })
            }, 1000)
        }
    }

    async unInit() {
        if (!this.initialized) return

        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer)
            this.heartbeatTimer = null
        }

        var res = await fetch(this.sessionURL, {
            method: "DELETE"
        })

        this.initialized = false
    }
    
    async putEffect(device, effectType, effectParam) {
        if (!this.initialized) return
        
        var res = await fetch(this.sessionURL + "/" + device, {
            method: "PUT",
            body: JSON.stringify({
                effect: effectType,
                param: effectParam
            })
        })

        return (await res.json())
    }
}

class RGBColor {
    constructor(r, g, b, a) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    /**
     * @param {RGBColor} dest 
     * @returns {RGBColor}
     */
    blend(dest) {
        return new RGBColor(
            this.r + dest.r * (1 - this.a),
            this.g + dest.g * (1 - this.a),
            this.b + dest.b * (1 - this.a),
            1
        )
    }
}

class RGBEffect {
    constructor() {
        this.time = 0
    }

    /**
     * @returns {Boolean}
     */
    get done() {
        return false
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {RGBColor}
     */
    getColorAt(x, y) {
        return new RGBColor(0, 0, 0, 0)
    }
}

class RGBTestFX extends RGBEffect {
    getColorAt(x, y) {
        return new RGBColor(0, 1, 0, 1)
    }
}

class RGBStack {
    constructor() {
        /**
         * @type {RGBEffect[]}
         */
        this.effectStack = []
    }

    /**
     * @param {RGBEffect} effect 
     */
    push(effect) {
        this.effectStack.push(effect)
    }

    pop() {
        this.effectStack.forEach(fx => {
            let index = this.effectStack.indexOf(fx)
            if (fx.done) this.effectStack.splice(index, 1)
        })
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {RGBColor}
     */
    getColorAt(x, y) {
        let color = new RGBColor(0, 0, 0, 1)

        this.effectStack.forEach(fx => color = fx.getColorAt(x, y).blend(color))

        return color
    }

    nextFrame(dT) {
        this.effectStack.forEach(fx => fx.time += dT)
        this.pop()
    }
}

class RGBHandler {
    constructor() {
        this.stack = new RGBStack()
        this.stack.push(new RGBTestFX())
    }

    async init() {}
    async unInit() {}

    /**
     * 
     * @param {String} event 
     */
    handleEvent(event) {}

    async render() {}

    nextFrame(dT) {
        this.stack.nextFrame(dT)
    }
}

class RazerChromaRGBHandler extends RGBHandler {
    constructor() {
        super()

        this.chroma = new Chroma({
            title: "G4",
            description: "An infinite rage game.",
            author: {
                name: "Team G4",
                contact: "https://g4game.wtf"
            },
            device_supported: [
                "keyboard"
            ],
            category: "game"
        })
    }

    async init() {
        await this.chroma.init()
    }

    async unInit() {
        await this.chroma.unInit()
    }

    /**
     * @param {RGBColor} color 
     */
    rgbColorToBGR(color) {
        let r = Math.floor(color.r * 255)
        let g = Math.floor(color.g * 255)
        let b = Math.floor(color.b * 255)
        
        return r || (g << 8) || (b << 16)
    }

    createKeyboardEffect() {
        let array = Array(6).fill(0).map(x => Array(22))

        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 22; x++) {
                let xPos = x / 21, yPos = y / 5
                array[y][x] = this.rgbColorToBGR(this.stack.getColorAt(xPos, yPos))
            }
        }

        return array
    }

    async render() {
        // Render the full keyboard thing!
        let keyboardFx = this.createKeyboardEffect()
        await this.chroma.putEffect("keyboard", "CHROMA_CUSTOM", keyboardFx)
    }
}
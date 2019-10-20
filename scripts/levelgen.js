class Projectile {
    constructor(x, y, velocityX, velocityY, radius) {
        /**
         * @type {Number}
         */
        this.x = x
        /**
         * @type {Number}
         */
        this.y = y

        /**
         * @type {Number}
         */
        this.velocityX = velocityX
        /**
         * @type {Number}
         */
        this.velocityY = velocityY

        /**
         * @type {Number}
         */
        this.radius = radius
    }
}

class Cannon {
    constructor(x, y, angle, freqMultiplier) {
        /**
         * @type {Number}
         */
        this.x = x
        /**
         * @type {Number}
         */
        this.y = y
        /**
         * @type {Number}
         */
        this.angle = angle
        /**
         * @type {Number}
         */
        this.freqMultiplier = freqMultiplier
    }
}

class RingElement {
    constructor(type, centerX, centerY) {
        /**
         * @type {String}
         */
        this.type = type

        /**
         * @type {Number}
         */
        this.centerX = centerX ? 0 : centerX
        /**
         * @type {Number}
         */
        this.centerY = centerY ? 0 : centerY
    }
}

class RingBall extends RingElement {
    constructor(angle, distance, radius, centerX, centerY) {
        super("ball", centerX, centerY)

        /**
         * @type {Number}
         */
        this.angle = angle
        /**
         * @type {Number}
         */
        this.distance = distance
        /**
         * @type {Number}
         */
        this.radius = radius
    }
}

class RingPulsingBall extends RingBall {
    constructor(angle, distance, radius, pulseFreq, centerX, centerY) {
        super(angle, distance, radius, centerX, centerY)
        this.type = "pulsingBall"

        /**
         * @type {Number}
         */
        this.baseRadius = radius

        /**
         * @type {Number}
         */        
        this.pulseFreq = pulseFreq

        /**
         * @type {Number}
         */
        this.pulseTime = 0
    }
}

class RingBar extends RingElement {
    constructor(angleStart, angleLength, distance, radius, centerX, centerY) {
        super("bar", centerX, centerY)

        /**
         * @type {Number}
         */
        this.angleStart = angleStart
        /**
         * @type {Number}
         */
        this.angleLength = angleLength

        /**
         * @type {Number}
         */
        this.distance = distance
        /**
         * @type {Number}
         */
        this.radius = radius
    }
}

class RingMarqueeBar extends RingBar {
    constructor(angleStart, angleLength, distance, radius, sweepFreq, centerX, centerY) {
        super(angleStart, angleLength, distance, radius, centerX, centerY)
        this.type = "marqueeBar"

        /**
         * @type {Number}
         */
        this.baseStart = angleStart
        /**
         * @type {Number}
         */
        this.baseEnd = angleStart + angleLength
        /**
         * @type {Number}
         */
        this.sweepTime = 0
        /**
         * @type {Number}
         */
        this.sweepFreq = sweepFreq
    }
}
 /**
  * @typedef {Object} RingH
  * 
  * @property {String} type
  * 
  * @property {Number} centerX
  * @property {Number} centerY
  * 
  * @property {Number} angle
  * @property {Number} distance
  * @property {Number} radius
  * @property {Number} direction
  * @property {Number} layout
  * @property {Number} wingSpan
  * 
  * @property {Boolean} hasBase
  * @property {Number} baseDistance
  */
class RingH extends RingElement {
    constructor(
        angle, distance, radius, direction,
        layout, wingSpan, hasBase, baseDistance
    ) {
    }
}

class Ring {
    constructor(items, speedMult, isDistraction, distance, revolveFreq, revolvePhase) {
        /**
         * @type {RingElement[]}
         */
        this.items = items

        this.rotation = 0

        /**
         * @type {Number}
         */
        this.speedMult = speedMult
        /**
         * @type {Boolean}
         */
        this.isDistraction = isDistraction

        /**
         * @type {Number}
         */
        this.distance = distance
        /**
         * @type {Number}
         */
        this.revolveFreq = revolveFreq
        /**
         * @type {Number}
         */
        this.revolvePhase = revolvePhase
    }
}

class SlowMode {
    constructor(time, isSlow) {
        /**
         * @type {Number}
         */
        this.time = time
        /**
         * @type {Boolean}
         */
        this.isSlow = isSlow
    }
}
/**
 * @typedef {Object} GameData
 * 
 * @property {Projectile} projectile
 * @property {Cannon} cannon
 * @property {Ring[]} rings
 * @property {SlowMode} slow
 * @property {Number} rotation
 * 
 * @property {Number} levelIndex
 * @property {Number} userRecord
 * @property {Number} userDeaths
 * @property {String} mode
 */

class LevelGenerator {
    /**
     * @param {Number} angle 
     * @param {Number} distance 
     * @param {Number} radius 
     * @returns {RingBall}
     */
    static createRingBall(angle, distance, radius, centerX, centerY) {
        return new RingBall(angle, distance, radius, centerX, centerY)
    }

    /**
     * @param {Number} angle 
     * @param {Number} distance 
     * @param {Number} radius 
     * @param {Number} pulseFreq 
     * @return {RingPulsingBall}
     */
    static createRingPulsingBall(angle, distance, radius, pulseFreq, centerX, centerY) {
        return new RingPulsingBall(angle, distance, radius, pulseFreq, centerX, centerY)
    }

    /**
     * @param {Number} angleStart 
     * @param {Number} angleLength 
     * @param {Number} distance 
     * @param {Number} radius 
     * @returns {RingBar}
     */
    static createRingBar(angleStart, angleLength, distance, radius, centerX, centerY) {
        return new RingBar(angleStart, angleLength, distance, radius, centerX, centerY)
    }

    /**
     * @param {Number} angleStart 
     * @param {Number} angleLength 
     * @param {Number} distance 
     * @param {Number} radius 
     * @param {Number} sweepFreq 
     * @returns {RingMarqueeBar}
     */
    static createRingMarqueeBar(
        angleStart, angleLength, distance, radius,
        sweepFreq,
        centerX, centerY
    ) {
        return new RingMarqueeBar(angleStart, angleLength, distance, radius, sweepFreq, centerX, centerY)
    }

    /**
     * @param {Number} angle 
     * @param {Number} distance 
     * @param {Number} radius
     * @param {Number} direction 
     * @param {Number} layout 
     * @param {Number} wingSpan 
     * @param {Boolean} hasBase 
     * @param {Number} baseDistance 
     * @param {Number} centerX 
     * @param {Number} centerY 
     */
    static createRingH(
        angle, distance, radius,
        direction, layout, wingSpan,
        hasBase, baseDistance,
        centerX, centerY
    ) {
        if (!centerX) centerX = 0
        if (!centerY) centerY = 0
        if (!hasBase) {
            hasBase = false
            baseDistance = 1000
        }

        return {
            type: "h",
            angle, distance, radius,
            direction, layout, wingSpan,
            hasBase, baseDistance,
            centerX, centerY
        }
    }

    /**
     * @param {Number} n 
     * @param {Boolean} isSmall 
     * @param {Boolean} isEasy 
     * @returns {Number[]}
     */
    static generateAngleArrangement(
        n, isSmall, isEasy
    ) {
        let angleBetween = 1 / n

        let shiftAngle = angleBetween / 3
        let isShifted = Math.random() >= 0.5
        if (isEasy) isShifted = false

        let shiftSign = (Math.random() >= 0.5) ? 1 : -1
    
        let angles = []
    
        for (let i = 0; i < n; i++) {
            let angle = i * angleBetween
    
            if (isShifted && n == 4 && i % 2) {
                angle += shiftSign * shiftAngle
            } else if (isShifted && n == 6 && !isSmall) {
                if (i % 3 == 0) angle += shiftSign * shiftAngle
                if (i % 3 == 1) angle -= shiftSign * shiftAngle
            }
    
            angles.push(angle)
        }
    
        return angles
    }

    /**
     * @param {Number} difficulty 
     * @param {Number} distance 
     * @returns {RingElement[]}
     */
    static generateInnerRing(difficulty, distance) {
        let elements = []

        let n = 2
        if (!distance) distance = 200
        if (difficulty == 2) n = Math.floor(Math.random() * 2) + 2
        if (difficulty == 3) n = 4
    
        n += Math.round(Math.random() * 2)
    
        let angles = LevelGenerator.generateAngleArrangement(n, true, difficulty < 3)
    
        for (var i = 0; i < n; i++) {
            let isBall = Math.random() >= 0.5
    
            if (isBall || (!isBall && i == 0)) {
                elements.push(
                    LevelGenerator.createRingBall(angles[i], distance, 50)
                )
    
                if (Math.random() >= 0.7 && difficulty > 1 && i > 0) {
                    elements.push(
                        LevelGenerator.createRingBall(
                            angles[i] + 0.08, distance, 20
                        ),
                        LevelGenerator.createRingBall(
                            angles[i] - 0.08, distance, 20
                        )
                    )
    
                }
            } else if (!isBall && i > 0) {
                let angleStart = angles[i]
                let angleLength = angles[(i + 1) % angles.length] - angleStart
                if (angleLength < 0) angleLength += 1
    
                elements.push(
                    LevelGenerator.createRingBar(
                        angleStart, angleLength, distance, 10
                    )
                )
    
                if (Math.random() >= 0.5) {
                    elements.push(
                        LevelGenerator.createRingBall(
                            angleStart, distance, 30
                        ),
                        LevelGenerator.createRingBall(
                            angleStart + angleLength, distance, 30
                        )
                    )
                }
            }
        }
    
        return elements
    }

    /**
     * @param {Number} difficulty 
     * @param {Number} distance 
     * @returns {RingElement[]}
     */
    static generateMiddleRing(difficulty, distance) {
        let elements = []

        if (difficulty == 1) return []
        let n = (difficulty - 1) * 2
        if (difficulty == 3 && Math.random() >= 0.6) n = 6
    
        let angles = LevelGenerator.generateAngleArrangement(n)
    
        for (let i = 0; i < n / 2; i++) {
            let angleStart = angles[2 * i]
            let angleLength = angles[2 * i + 1] - angleStart
    
            if (difficulty == 3 && Math.random() >= 0.5) {
                elements.push(
                    LevelGenerator.createRingMarqueeBar(angleStart, angleLength, distance, 10, 1)
                )
            } else {
                elements.push(
                    LevelGenerator.createRingBar(angleStart, angleLength, distance, 10)
                )
            }
        }
    
        return elements
    }

    /**
     * @param {Number} difficulty 
     * @param {Number} distance 
     * @returns {RingElement[]}
     */
    static generateOuterRing(difficulty, distance) {
        let elements = []

        if (difficulty == 1 && Math.random() >= 0.5) return []
        let n = 3 + Math.round(1.2 * difficulty * Math.random())
        let isPulsing = Math.random() >= 0.5 && difficulty > 1
        let willGenerateBars = difficulty > 2
    
        let angles = LevelGenerator.generateAngleArrangement(n)
        angles.forEach((angle, i) => {
            if (isPulsing && i % 2) {
                elements.push(
                    LevelGenerator.createRingPulsingBall(angle, distance, 20, 2)
                )
            } else {
                elements.push(
                    LevelGenerator.createRingBall(angle, distance, 20)
                )
            }
        })
    
        if (willGenerateBars) {
            for (let i = 0; i < n/2; i++) {
                let angle1 = angles[i * 2]
                let angle2 = angles[(i * 2 + 1) % angles.length]
                if (angle2 < angle1) angle2 += 1
    
                let angleLength = (angle2 - angle1) * (Math.random() * 0.4 + 0.2)
                let angleStart = (angle1 + angle2) / 2 - angleLength / 2
    
                elements.push(
                    LevelGenerator.createRingBar(angleStart, angleLength, distance, 10)
                )
            }
        }
    
        return elements
    }

    /**
     * @param {Number} difficulty 
     * @param {Number} distance 
     * @returns {RingElement[]}
     */
    static generateDeniseRing(difficulty, distance) {
        let elements = []

        if (difficulty == 1) return []
        var n = (difficulty - 1) * 2
        if (difficulty == 3 && Math.random() >= 0.6) n = 6
        if (difficulty == 4) n = Math.floor(Math.random() * 2)*4 + 4
    
        var angles = LevelGenerator.generateAngleArrangement(n)
    
        for (var i = 0; i < n / 2; i++) {
            var angleStart = angles[2 * i]
            var angleLength = angles[2 * i + 1] - angleStart
    
            if (difficulty >= 3 && Math.random() >= 0.5) {
                elements.push(
                    LevelGenerator.createRingMarqueeBar(angleStart, angleLength, distance, 2, 1)
                )
            } else {
                elements.push(
                    LevelGenerator.createRingBar(angleStart, angleLength, distance, 2)
                )
            }
        }

        for (var i = 1; i < n; i += 2) {
            var angleStart = angles[i]
            var angleLength = angles[(i + 1) % n] - angleStart

            var numOfBalls = Math.round(Math.random() * 2 + 1)

            for (var j = 1; j <= (numOfBalls + 1); j++) {
                elements.push(
                    LevelGenerator.createRingBall(
                        angleStart + (j/(numOfBalls+2)) * angleLength,
                        distance,
                        4
                    )
                )
            }
        }
    
        return elements
    }

    /**
     * @param {RingElement[]} items 
     * @param {Number} speedMult 
     * @param {Boolean} isDistraction 
     * @returns {Ring}
     */
    static createRing(items, speedMult, isDistraction, distance, revolveFreq, revolvePhase) {
        if (!distance) distance = 0
        if (!revolveFreq) revolveFreq = 0
        if (!revolvePhase) revolvePhase = 0

        return {items, speedMult, isDistraction, distance, revolveFreq, revolvePhase, rotation: 0}
    }

    /**
     * @param {Number} levelIndex 
     * @returns {Number[][]}
     */
    static getDefaultDifficulties(levelIndex) {
        let staticProgression = [
            [1, 0, 0],
            [1, 0, 0],
            [2, 0, 0],
            [2, 0, 0],
            [2, 0, 0],
            [3, 0, 0],
            [3, 0, 1],
            [2, 0, 2],
            [2, 0, 2],
            [2, 0, 2],
            [2, 1, 2],
            [2, 1, 2]
        ]
        let loopedProgression = [
            [3, 1, 2],
            [2, 2, 2],
            [2, 2, 2],
            [2, 3, 2],
            [2, 3, 1],
            [2, 2, 2],
            [2, 2, 2],
            [3, 1, 2],
            [2, 1, 2],
            [3, 1, 2],
            [2, 2, 2],
            [2, 2, 2],
            [2, 3, 2],
            [3, 3, 3],
            [2, 2, 2],
            [2, 2, 2],
            [3, 1, 2],
            [2, 1, 2]
        ]

        if (levelIndex < staticProgression.length) return staticProgression[levelIndex]

        let index = (levelIndex - staticProgression.length) % loopedProgression.length
        return loopedProgression[index]
    }

    static generateDefaultRings(rings, progression) {
        if (progression[0])
            rings.push(
                LevelGenerator.createRing(
                    LevelGenerator.generateInnerRing(
                        progression[0], 200
                    ),
                    1, false
                )
            )
        if (progression[1])
            rings.push(
                LevelGenerator.createRing(
                    LevelGenerator.generateMiddleRing(
                        progression[1], 300
                    ),
                    0.5, false
                )
            )
        if (progression[2])
            rings.push(
                LevelGenerator.createRing(
                    LevelGenerator.generateOuterRing(
                        progression[2], 400
                    ),
                    0.25, false
                )
            )
    }

    static generateNoxRings(rings, level) {
        // The giant outer ring
        rings.push(
            LevelGenerator.createRing(
                LevelGenerator.generateOuterRing(2, 500),
                0.5, false,
                0, 0
            )
        )

        // The middle ring
        if (level > 12) {
            rings.push(
                LevelGenerator.createRing(
                    LevelGenerator.generateMiddleRing(3, 250),
                    0.5, false,
                    0, 0
                )
            )
        }

        // The revolving rings
        let diffOffset = (level > 9) ? 2 : 1
        let nOffset = (level > 4) ? 2 : 3
        let n = Math.round(Math.random() * 2) + nOffset

        for (let i = 0; i < n; i++) {
            let phase = i / n
            let ringRadius = 400
            let ringDistance = 100

            let ringDifficulty = diffOffset + Math.round(Math.random())

            rings.push(
                LevelGenerator.createRing(
                    LevelGenerator.generateInnerRing(
                        ringDifficulty,
                        ringRadius
                    ),
                    1, false,
                    ringDistance, 0.5, phase
                )
            )
        }
    }

    static generateHRings(rings, level) {
        let ring = LevelGenerator.createRing([
            LevelGenerator.createRingH(0, 200, 10, 1, 1, 0.05, true, 50, 0, 0)
        ], 1, false, 0, 0, 0)

        rings.push(ring)
    }

    /**
     * @param {RingElement} item 
     * @param {Number} ringLength
     */
    static getRingItemAngleRange(item, ringLength) {
        let low = 0, high = 0, radiusAngle

        switch (item.type) {
            case "ball":
                radiusAngle = item.radius / ringLength
                low = item.angle - radiusAngle
                high = item.angle + radiusAngle
                break
            case "pulsingBall":
                radiusAngle = 1.5 * item.baseRadius / ringLength
                low = item.angle - radiusAngle
                high = item.angle + radiusAngle
                break
            case "bar":
                low = item.angleStart
                high = item.angleStart + item.angleLength
                break
            case "marqueeBar":
                low = item.baseStart
                high = item.baseEnd
                break
        }

        if (low >= 0 && high <= 1) {
            return [
                new CoverageRange(low, high)
            ]
        } else if (low < 0 && high <= 1) {
            return [
                new CoverageRange(0, high),
                new CoverageRange(low + 1, 1)
            ]
        } else if (low >= 0 && high > 1) {
            return [
                new CoverageRange(0, high - 1),
                new CoverageRange(low, 1)
            ]
        } else {
            return [
                new CoverageRange(0, 1)
            ]
        }

        return []
    }

    /**
     * @param {Ring} ring
     * @returns {Number}
     */
    static calculateRingClearance(ring) {
        let coverage = new Coverage()
        let ringDistances = ring.items.map(item => item.distance)
        let ringRadius = Math.max(...ringDistances)
        let ringLength = 2 * Math.PI * ringRadius

        ring.items.forEach(item => {
            let ranges = LevelGenerator.getRingItemAngleRange(item, ringLength)

            ranges.forEach(range => coverage.subtract(range))
        })

        return coverage.getMaxLength() * ringLength
    }

    /**
     * @param {String} mode 
     * @param {Number} levelIndex 
     * @returns {Ring[]}
     */
    static generateRings(mode, levelIndex) {
        let rings = []

        let defaultProgression = LevelGenerator.getDefaultDifficulties(levelIndex)

        switch (mode) {
            case "easy":
                defaultProgression[0] = Math.max(defaultProgression[0], 2)
                defaultProgression[1] = 0
                defaultProgression[2] = 0

                LevelGenerator.generateDefaultRings(rings, defaultProgression)

                break
            case "normal":
                LevelGenerator.generateDefaultRings(rings, defaultProgression)

                break
            case "hard":
                defaultProgression = defaultProgression.map(x => x ? 3 : 0)

                LevelGenerator.generateDefaultRings(rings, defaultProgression)
                
                break
            case "hell":
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateInnerRing(2, 200),
                        1, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateInnerRing(2, 200),
                        0.5, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateMiddleRing(3, 300),
                        0.5, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateOuterRing(3, 400),
                        0.25, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateOuterRing(3, 400),
                        0.125, false
                    )
                )
                break
            case "hades":
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateInnerRing(1, 100),
                        1, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateInnerRing(3, 300),
                        0.5, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateOuterRing(3, 400),
                        0.25, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateOuterRing(3, 400),
                        0.125, false
                    )
                )

                // Distractions
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateMiddleRing(3, 300),
                        1, true
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateOuterRing(3, 400),
                        0.5, true
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateInnerRing(2, 150),
                        0.75, true
                    )
                )
                break
            case "denise":
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateDeniseRing(4, 200),
                        1, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateDeniseRing(4, 266),
                        0.5, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateDeniseRing(4, 333),
                        0.25, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateDeniseRing(4, 400),
                        0.125, false
                    )
                )
                break
            case "reverse":
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateOuterRing(2, 150),
                        1, false
                    )
                )
                rings.push(
                    LevelGenerator.createRing(
                        LevelGenerator.generateOuterRing(3, 300),
                        0.5, false
                    )
                )
                break
            case "nox":

                LevelGenerator.generateNoxRings(rings, levelIndex)

                break
            case "h":
                LevelGenerator.generateHRings(rings, levelIndex)

                break
        }

        let clearances = rings.map(ring => {
            return LevelGenerator.calculateRingClearance(ring)
        }).filter(n => isFinite(n))

        if (Math.min(...clearances) < 120) {
            return LevelGenerator.generateRings(mode, levelIndex)
        }

        return rings
    }

    static generate(
        levelIndex, userRecord,
        mode
    ) {
        /**
         * @type {GameData}
         */
        let gameData = {}

        gameData.levelIndex = levelIndex
        gameData.userRecord = userRecord
        gameData.userDeaths = 0
        gameData.mode = mode

        gameData.rotation = 0

        gameData.rings = []
        gameData.rings = LevelGenerator.generateRings(mode, levelIndex)

        gameData.cannon = {
            x: 0, y: 0,
            freqMultiplier: 1, angle: 0
        }

        gameData.slow = {
            isSlow: false,
            time: 0
        }

        return gameData
    }
}
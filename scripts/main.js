(() => {
    /**
     * @type {Game[]}
     */
    let games = []

    let mainGame = new Game(
        null, false, "",
        new Leaderboard()
    )

    prepG4AccountUI(mainGame.leaderboard)

    mainGame.generateLevel("easy", 0)

    document.querySelector("main").appendChild(mainGame.dom)
    mainGame.resizeCanvas()

    games.push(mainGame)

    // Music playback
    document.querySelector("input#settingMusic").addEventListener("input", function() {
        isAudioPlaying = !isAudioPlaying
    
        if (isAudioPlaying) {
            playAudio(mainGame.data.mode, true)
        } else {
            stopAudio()
        }
    })

    // Legit Verified Amirite
    document.querySelector("input#settingVerifiedLegit").addEventListener("input", function() {
        localStorage["g4_showLegitTM"] = this.checked ? "1": "0"
        mainGame.leaderboard.updateLeaderboard(
            mainGame.data.mode
        )
    })

    // Game interaction events
    addEventListener("keydown", (e) => {
        games.forEach(game => game.handleKeyboardEvent(e))
    })
    addEventListener("g4gamepadbuttonpressed", (e) => {
        games.forEach(game => game.handleGamepadEvent(e))
    })

    // Load audio & stuff
    loadAssets().then(() => {
        document.querySelector("label[for=settingMusic]").classList.remove("loading")
    })

    // On window resize, resize the canvases
    window.addEventListener("resize", () => {
        games.forEach(game => game.resizeCanvas())
    })

    // DOM update "loop"
    setInterval(() => {
        games.forEach(game => game.updateDOM())
    }, 1000 / 30)

    // Rendering "loop"
    let previousTimestamp = null
    let fpsCounter = document.querySelector("span.fpsCounter")

    function renderAllGames(timestamp) {
        if (previousTimestamp) {
            let frameTime = timestamp - previousTimestamp
            let frameRate = 1000 / frameTime

            fpsCounter.textContent = Math.round(frameRate)
        }

        requestAnimationFrame(renderAllGames)

        games.forEach(game => game.render())

        // Render static previews
        document.querySelectorAll("dialog.open div.game.modePreview").forEach(gameDOM => {
            // previews have dom.game attrs
            gameDOM.game.advance(1 / 90)
            gameDOM.game.render()            
        })

        previousTimestamp = timestamp
    }

    requestAnimationFrame(renderAllGames)

    let physicsFps = 90
    let processSpectated = true
    // Physics "loop"
    setInterval(() => {
        games.forEach(game => {
            if (!game.isSpectated)
                game.advance(1 / physicsFps)
            else if (game.isSpectated && processSpectated)
                game.advance(2 / physicsFps)
        })

        processSpectated = !processSpectated

        processGamepadInputs()
    }, 1000 / physicsFps)

    // Mode changing buttons
    let modeButtons = document.querySelector("section.gameMode div.content")
    gameModes.forEach(mode => {
        let button = document.createElement("button")
        button.classList.add("mode")

        if (mode instanceof NativeMode) {
            button.setAttribute("data-mode", mode.modeId)

            if (mode.modeId == "easy") button.classList.add("active")
        }
        button.textContent = mode.name

        button.addEventListener("click", () => {
            if (button.classList.contains("active")) return

            if (mode instanceof NativeMode) {
                mainGame.generateLevel(
                    button.getAttribute("data-mode"),
                    0
                )
                mainGame.data.slow = {
                    time: 0,
                    isSlow: false
                }

                playAudio(mainGame.data.mode)
            }

            document.querySelector("section.gameMode button.active").classList.remove("active")
            button.classList.add("active")
        })

        modeButtons.appendChild(button)
    })
})()
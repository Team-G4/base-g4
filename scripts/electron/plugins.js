(() => {
    let fs = require("fs")
    let path = require("path")
    let vm = require("vm")

    const pluginPath = path.join(__dirname, "plugins")

    /**
     * @type {Plugin[]}
     */
    let loadedPlugins = []

    class PluginDebugMessage {
        constructor(plugin) {
            this.plugin = plugin

            this.timestamp = new Date()

            dispatchEvent(new CustomEvent(
                "g4pluginmessage", {
                    detail: {
                        plugin: plugin,
                        message: this
                    }
                }
            ))
        }
    }

    class PluginDebugAPICallMessage extends PluginDebugMessage {
        constructor(plugin, apiFunc, args) {
            super(plugin)

            this.apiFunc = apiFunc
            this.args = args
        }
    }

    class PluginExecutionErrorMessage extends PluginDebugMessage {
        constructor(plugin, err) {
            super(plugin)

            this.error = err
        }
    }

    class PluginDebugTextMessage extends PluginDebugMessage {
        constructor(plugin, message, type) {
            super(plugin)

            this.message = message
            this.type = type
        }
    }

    class PluginEventHandler {
        constructor(type, listener) {
            this.eventType = type
            this.listener = listener
        }
    }

    class Plugin {
        constructor(dir, manifestData, isRunning) {
            this.directory = dir

            this.name = manifestData.name
            this.author = manifestData.author
            this.description = manifestData.description

            this.icon = manifestData.icon

            this.version = manifestData.version

            this.scriptPath = manifestData.script

            /**
             * @type {PluginDebugMessage[]}
             */
            this.debugMessages = []

            /**
             * @type {PluginEventHandler[]}
             */
            this.eventHandlers = []

            this.isRunning = isRunning
            if (isRunning) this.run()
        }

        getFilePath(relPath) {
            return path.join(pluginPath, this.directory, relPath)
        }

        getPluginContext() {
            return {
                // Event handler creation/removal
                addEventListener: (eventType, listener) => {
                    this.debugMessages.push(
                        new PluginDebugAPICallMessage(this, "[PluginContext].addEventListener", arguments)
                    )

                    let handler = new PluginEventHandler(eventType, listener)

                    this.eventHandlers.push(handler)
                },
                removeEventListener: (eventType, listener) => {
                    this.debugMessages.push(
                        new PluginDebugAPICallMessage(this, "[PluginContext].removeEventListener", arguments)
                    )

                    let index = this.eventHandlers.findIndex(h => h.eventType == eventType && h.listener == listener)
                    
                    if (index >= 0) this.eventHandlers.splice(index, 1)
                },

                // Notifications
                popNotification: (notif) => {
                    this.debugMessages.push(
                        new PluginDebugAPICallMessage(this, "[PluginContext].popNotification", arguments)
                    )

                    let source = {
                        icon: this.getFilePath(this.icon),
                        name: this.name
                    }

                    showNotification({
                        source,
                        text: notif.text,
                        buttons: notif.buttons
                    })
                },

                // Object registration
                registerMode: (mode) => {
                    this.debugMessages.push(
                        new PluginDebugAPICallMessage(this, "[PluginContext].registerMode", arguments)
                    )
                    
                    if (!(mode instanceof CustomMode)) return false

                    mode.ownerPlugin = this

                    gameModes.push(mode)
                    updateModeButtons()

                    return true
                },

                // Debug messages
                log: (message) => {
                    this.debugMessages.push(
                        new PluginDebugTextMessage(this, message, "log")
                    )
                },
                info: (message) => {
                    this.debugMessages.push(
                        new PluginDebugTextMessage(this, message, "info")
                    )
                },
                warn: (message) => {
                    this.debugMessages.push(
                        new PluginDebugTextMessage(this, message, "warn")
                    )
                },
                error: (message) => {
                    this.debugMessages.push(
                        new PluginDebugTextMessage(this, message, "error")
                    )
                }
            }
        }

        getG4Object() {
            return {
                // Level gen elements
                RingElement,
                RingBall, RingPulsingBall,
                RingBar, RingMarqueeBar,
                RingH,

                Ring,

                Mode: CustomMode,

                levelGen: {
                    ringTypes: {
                        TYPE_A: 1,
                        TYPE_B: 2,
                        TYPE_C: 3,
                        TYPE_D: 4
                    },

                    generateRing: (type, difficulty, distance) => {
                        this.debugMessages.push(
                            new PluginDebugAPICallMessage(this, "G4.levelGen.generateRing", arguments)
                        )
    
                        let items = []
    
                        switch (type) {
                            case 1: // type A
                                items = LevelGenerator.generateInnerRing(difficulty, distance)
                                break
                            case 2: // type B
                                items = LevelGenerator.generateMiddleRing(difficulty, distance)
                                break
                            case 3: // type C
                                items = LevelGenerator.generateOuterRing(difficulty, distance)
                                break
                            case 4: // type D
                                items = LevelGenerator.generateDeniseRing(difficulty, distance)
                                break
                        }
    
                        return items
                    },
                    generateMode: (modeId, levelIndex) => {
                        this.debugMessages.push(
                            new PluginDebugAPICallMessage(this, "G4.levelGen.generateMode", arguments)
                        )

                        let rings = []
                        let mode = gameModes.find(m => (m instanceof NativeMode) && m.modeId == modeId)

                        if (mode) rings = mode.getRings(levelIndex)

                        return rings
                    }
                },
                render: {
                    getElementPath: (element) => {
                        this.debugMessages.push(
                            new PluginDebugAPICallMessage(this, "G4.render.getElementPath", arguments)
                        )

                        if (!(element instanceof RingElement)) return null
                        return LevelRenderer.getElementPath(element)
                    },
                    getRingPath: (ring) => {
                        this.debugMessages.push(
                            new PluginDebugAPICallMessage(this, "G4.render.getRingPath", arguments)
                        )

                        if (!(ring instanceof Ring)) return null
                        return LevelRenderer.getRingPath(ring)
                    },
                    getCannonPath: (cannon) => {
                        this.debugMessages.push(
                            new PluginDebugAPICallMessage(this, "G4.render.getCannonPath", arguments)
                        )

                        // if (!(ring instanceof Ring)) return null
                        return LevelRenderer.getCannonPath(cannon)
                    }
                }
            }
        }

        createVolatileObject(source, exclusions) {
            let isExpired = false
        
            let volatileSpec = {
                expire() {
                    isExpired = true
                },
                isExpired() {
                    return isExpired
                },
                object: new Proxy(
                    source,
                    {
                        has(o, p) {
                            if (isExpired) return false
                            if (exclusions.includes(p)) return false
                            return p in o
                        },
                        get(o, p) {
                            if (isExpired) return undefined
                            if (exclusions.includes(p)) return undefined
        
                            return o[p]
                        },
                        ownKeys(o) {
                            if (isExpired) return []
                            return Object.keys(o).filter(k => exclusions.includes(k))
                        },
                        isExtensible(o) {
                            return false
                        },
                        set(o, p, v, r) {
                            if (isExpired) return false
                            if (exclusions.includes(p)) return false
                            if (!Object.getOwnPropertyDescriptor(o, p).writable) return false
        
                            o[p] = v
        
                            return true
                        }
                    }
                )
            }
            
            return volatileSpec
        }

        /**
         * @param {CanvasRenderingContext2D} ctx 
         */
        createSandboxedCanvasContext(ctx) {
            return {
                
            }
        }

        run() {
            let context = {
                plugin: this.getPluginContext(),
                G4: this.getG4Object()
            }
            let scriptData = fs.readFileSync(
                this.getFilePath(this.scriptPath),
                "utf-8"
            )

            try {
                vm.runInNewContext(scriptData, context)
            } catch(e) {
                this.debugMessages.push(
                    new PluginExecutionErrorMessage(this, e)
                )
            }
        }
    }
    
    function updatePluginList() {
        let list = document.querySelector("div.pluginList")
        list.innerHTML = ""

        for (let plugin of loadedPlugins) {
            let div = document.createElement("div")
            div.classList.add("plugin")

            let toggle = document.createElement("div")
            toggle.classList.add("toggle")

            let checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.id = Math.floor(Math.random() * 1000000)
            if (plugin.isRunning) checkbox.checked = true
            toggle.appendChild(checkbox)

            checkbox.addEventListener("input", () => {
                if (checkbox.checked) {
                    setPluginAsRunning(plugin.directory)
                } else {
                    setPluginAsStopped(plugin.directory)
                }
            })

            let label = document.createElement("label")
            label.htmlFor = checkbox.id

            let logo = document.createElement("img")
            logo.src = path.join(pluginPath, plugin.directory, plugin.icon)
            label.appendChild(logo)

            let name = document.createElement("p")
            name.textContent = plugin.name
            label.appendChild(name)

            toggle.appendChild(label)

            div.appendChild(toggle)

            let description = document.createElement("p")
            description.classList.add("description")
            description.textContent = plugin.description
            div.appendChild(description)

            if (plugin.isRunning) {
                let running = document.createElement("p")
                running.classList.add("running")
                running.textContent = "The plugin is enabled."
                div.appendChild(running)
            }

            let buttons = document.createElement("div")
            buttons.classList.add("buttons")

            let deleteBtn = document.createElement("button")
            deleteBtn.textContent = "Delete"
            buttons.appendChild(deleteBtn)

            div.appendChild(buttons)

            list.appendChild(div)
        }
    }

    function getRunningPlugins() {
        if (!localStorage.getItem("g4_runningPlugins")) localStorage["g4_runningPlugins"] = "[]"

        return JSON.parse(localStorage["g4_runningPlugins"])
    }

    function setPluginAsRunning(pluginID) {
        if (!localStorage.getItem("g4_runningPlugins")) localStorage["g4_runningPlugins"] = "[]"
        let plugins = JSON.parse(localStorage["g4_runningPlugins"])

        if (!plugins.includes(pluginID)) plugins.push(pluginID)

        localStorage["g4_runningPlugins"] = JSON.stringify(plugins)
    }

    function setPluginAsStopped(pluginID) {
        if (!localStorage.getItem("g4_runningPlugins")) localStorage["g4_runningPlugins"] = "[]"
        let plugins = JSON.parse(localStorage["g4_runningPlugins"])

        if (plugins.includes(pluginID)) plugins.splice(plugins.indexOf(pluginID), 1)

        localStorage["g4_runningPlugins"] = JSON.stringify(plugins)
    }

    function isPluginRunning(pluginID) {
        if (!localStorage.getItem("g4_runningPlugins")) localStorage["g4_runningPlugins"] = "[]"
        let plugins = JSON.parse(localStorage["g4_runningPlugins"])

        return plugins.includes(pluginID)
    }

    fs.readdirSync(pluginPath, {
        withFileTypes: true
    }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name).forEach(dir => {
        if (!fs.existsSync(path.join(pluginPath, dir, "manifest.json"))) return

        loadedPlugins.push(
            new Plugin(
                dir,
                JSON.parse(
                    fs.readFileSync(path.join(pluginPath, dir, "manifest.json"), "utf-8")
                ),
                isPluginRunning(dir)
            )
        )
    })

    updatePluginList()

    document.querySelector("button#reloadG4Btn").addEventListener("click", () => {
        location.reload()
    })
})()

(() => {
    let fs = require("fs")
    let path = require("path")
    let vm = require("vm")

    const pluginPath = path.join(__dirname, "plugins")

    let loadedPlugins = []

    class PluginDebugMessage {
        constructor(plugin) {
            this.plugin = plugin

            this.timestamp = new Date()
        }
    }

    class PluginDebugTextMessage extends PluginDebugMessage {
        constructor(plugin, message, type) {
            super(plugin)

            this.message = message
            this.type = type

            console[this.type]("[PLUGIN] " + this.message)
        }
    }

    class PluginEventHandler {
        constructor(type, listener) {
            this.eventType = type
            this.listener = listener
        }
    }

    class Plugin {
        constructor(dir, manifestData) {
            this.directory = dir

            this.name = manifestData.name
            this.author = manifestData.author

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

            this.run()
        }

        getPluginContext() {
            return {
                // Event handler creation/removal
                addEventListener: (eventType, listener) => {
                    let handler = new PluginEventHandler(eventType, listener)

                    this.eventHandlers.push(handler)
                },
                removeEventListener: (eventType, listener) => {
                    let index = this.eventHandlers.findIndex(h => h.eventType == eventType && h.listener == listener)
                    
                    if (index >= 0) this.eventHandlers.splice(index, 1)
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
            return {}
        }

        run() {
            let context = {
                plugin: this.getPluginContext(),
                G4: this.getG4Object()
            }
            let scriptData = fs.readFileSync(
                path.join(pluginPath, this.directory, this.scriptPath),
                "utf-8"
            )

            vm.runInNewContext(scriptData, context)
        }
    }

    function updatePluginList() {
        for (let plugin of loadedPlugins) {
        }
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
                )
            )
        )
    })

    updatePluginList()

    console.log(loadedPlugins)
})()

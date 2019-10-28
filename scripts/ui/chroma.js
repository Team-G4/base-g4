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
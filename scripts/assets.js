let mainAudioContext = new AudioContext()

class Asset {
    constructor(source, name, filePath) {
        this.source = source
        this.filePath = filePath
        this.name = name

        this.isLoaded = false
    }

    async load() {
        this.isLoaded = true
        dispatchEvent(new CustomEvent(
            "g4assetloaded",
            {
                detail: {
                    asset: this
                }
            }
        ))
    }
}

class AudioAsset extends Asset {
    constructor(source, name, filePath) {
        super(source, name, filePath)

        /**
         * @type {AudioBuffer}
         */
        this.audioBuffer = null
    }

    async load() {
        let data = await fetch(this.filePath)
        let arrayBuf = await data.arrayBuffer()

        this.audioBuffer = await mainAudioContext.decodeAudioData(arrayBuf)

        super.load()
    }
}

class ImageAsset extends Asset {
    constructor(source, name, filePath) {
        super(source, name, filePath)

        /**
         * @type {HTMLImageElement}
         */
        this.image = null
    }

    asyncImgLoad() {
        return new Promise((resolve, reject) => {
            let listener = () => {
                this.image.removeEventListener("load", listener)
                resolve()
            }

            this.image.addEventListener("load", listener)
            this.image.src = this.filePath
        })
    }

    async load() {
        this.image = new Image()

        await this.asyncImgLoad()

        super.load()
    }
}

/**
 * @type {Asset[]}
 */
let gameAssets = []

function updateAssetProgress() {
    let loaded = gameAssets.filter(a => a.isLoaded).length

    document.querySelector("div.assetProgress").classList.toggle("hidden", loaded == gameAssets.length)

    document.querySelector("div.assetProgress div.bar").style.width = `${100 * loaded / gameAssets.length}%`
}

function registerAsset(asset) {
    let index = gameAssets.push(asset)

    updateAssetProgress()
    asset.load().then(() => updateAssetProgress())

    return index
}

function areAssetsLoaded(assets) {
    return assets.filter(a => a.isLoaded).length == assets.length
}

function waitForAssetLoad(assets) {
    return new Promise((resolve, reject) => {
        if (areAssetsLoaded(assets)) resolve()

        let listener = () => {
            if (areAssetsLoaded(assets)) {
                removeEventListener("g4assetloaded", listener)
                resolve()
            }
        }

        addEventListener("g4assetloaded", listener)
    })
}

function getAsset(source, name) {
    return gameAssets.find(a => a.source == source && a.name == name)
}

updateAssetProgress()

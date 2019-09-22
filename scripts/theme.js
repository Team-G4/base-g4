async function loadTheme(name) {
    let data = await fetch(
        `res/themes/${name}.json`
    )
    return await data.json()
}

async function loadDefaultThemes() {
    let themes = [
        await loadTheme("dark"),
        await loadTheme("light")
    ]

    localStorage["g4_themes"] = JSON.stringify(themes)
}

function createCSSVars(compStyles, obj, prefix) {
    for (let key in obj) {
        let value = obj[key]
        let property = prefix + "-" + key

        if (typeof value === "string") {
            compStyles.setProperty(property, value)
        } else {
            createCSSVars(compStyles, value, property)
        }
    }
}

function applyTheme() {
    if (!localStorage.getItem("g4_currentTheme")) localStorage["g4_currentTheme"] = 1

    let themes = JSON.parse(localStorage["g4_themes"])
    let theme = themes[localStorage["g4_currentTheme"] - 1]

    console.log(theme)
    createCSSVars(
        document.documentElement.style,
        theme.colors, "--g4-theme")
}

function setTheme(id) {
    localStorage["g4_currentTheme"] = id
    applyTheme()
    updateThemeList()
}

function updateThemeList() {
    let list = document.querySelector("div.themeList")
    list.innerHTML = ""

    let themes = JSON.parse(localStorage["g4_themes"])

    for (let theme of themes) {
        let div = document.createElement("div")
        div.classList.add("theme")

        div.style.setProperty(
            "--g4-app-background",
            theme.colors.app.background
        )
        div.style.setProperty(
            "--g4-app-foreground",
            theme.colors.app.foreground
        )
        div.style.setProperty(
            "--g4-app-header-background",
            theme.colors.app.headerBackground
        )

        if (localStorage.g4_currentTheme == themes.indexOf(theme) + 1) div.classList.add("current")

        let name = document.createElement("p")
        name.textContent = theme.name
        div.appendChild(name)

        let applyBtn = document.createElement("button")
        applyBtn.textContent = "Apply theme"
        div.appendChild(applyBtn)

        applyBtn.addEventListener("click", () => {
            setTheme(themes.indexOf(theme) + 1)
        })

        list.appendChild(div)
    }
}

if (!localStorage.getItem("g4_themes")) {
    loadDefaultThemes().then(() => applyTheme())
} else {
    applyTheme()
}
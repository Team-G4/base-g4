// First time hint
if (!localStorage.getItem("g4_hideHint")) {
    openWindow("oobe")
    localStorage.setItem("g4_hideHint", true)
}

// Sidebar expander
document.querySelector("button.expander").addEventListener("click", () => {
    document.querySelector("aside").classList.toggle("expanded")
})

// Sidebar windows
document.querySelectorAll("dialog").forEach(dialog => {
    dialog.querySelector("button.close").addEventListener("click", () => {
        dialog.classList.remove("open")
    })
})

function openWindow(id) {
    let zIndex = 2000 + document.querySelectorAll("dialog.open").length
    let dialog = document.querySelector("dialog#" + id)

    dialog.classList.add("open")
    dialog.style.zIndex = zIndex
}

function closeWindows() {
    document.querySelectorAll("dialog.open").forEach(d => d.classList.remove("open"))
}

// G4 Account
/**
 * 
 * @param {Leaderboard} leaderboard 
 */
function prepG4AccountUI(leaderboard) {
    document.querySelector("button#openLoginBtn").addEventListener("click", () => {
        openWindow("login")
    })

    document.querySelector("button#goToRegisterBtn").addEventListener("click", () => {
        openWindow("register")
    })

    document.querySelector("button#logoutBtn").addEventListener("click", () => {
        leaderboard.logout()
    })

    document.querySelector("button#loginBtn").addEventListener("click", () => {
        let err = document.querySelector("dialog#login p.error")
        err.classList.remove("visible")

        let username = document.querySelector("input#loginUsername").value
        let passwd = document.querySelector("input#loginPassword").value

        if (!username || !passwd) {
            err.textContent = "Incomplete login information."
            err.classList.add("visible")
            return
        }

        try {
            leaderboard.loginAccount(
                username, passwd
            ).then(result => {
                if (result) {
                    closeWindows()
                } else {
                    err.textContent = "Incorrect login information."
                    err.classList.add("visible")
                }
            })
        } catch(e) {
            err.textContent = "Couldn't connect to the server. Try again later."
            err.classList.add("visible")
        }
    })

    document.querySelector("button#registerBtn").addEventListener("click", () => {
        let err = document.querySelector("dialog#register p.error")
        err.classList.remove("visible")

        let username = document.querySelector("input#registerUsername").value
        let passwd = document.querySelector("input#registerPassword").value

        if (!username || !passwd) {
            err.textContent = "Incomplete login information."
            err.classList.add("visible")
            return
        }
        if (username.length > 20) {
            err.textContent = "Username must be 20 characters or less."
            err.classList.add("visible")
            return
        } else if (username.length < 3) {
            err.textContent = "Username must be longer than 2 characters."
            err.classList.add("visible")
            return
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            err.textContent = "Username must contain only letters A-Z, numbers and underscores (_)."
            err.classList.add("visible")
            return
        }

        try {
            leaderboard.isUsernameAvailable(username).then(available => {
                if (available) {
                    console.log("available!")
                    leaderboard.registerAccount(username, passwd).then(result => {
                        console.log(result)
                        if (result) {
                            closeWindows()
                        } else {
                            err.textContent = "Couldn't complete account registration. Try again later."
                            err.classList.add("visible")
                        }
                    })
                } else {
                    err.textContent = "This username is already taken."
                    err.classList.add("visible")
                }
            })
        } catch(e) {
            err.textContent = "Couldn't connect to the server. Try again later."
            err.classList.add("visible")
        }
    })
}

// Open settings
document.querySelector("button#openSettingsBtn").addEventListener("click", () => {
    updateThemeList()
    openWindow("settings")
})

// Left side sidebar
if (!localStorage.getItem("g4_leftSidebar")) localStorage["g4_leftSidebar"] = false
if (localStorage["g4_leftSidebar"] == "true") {
    document.querySelector("input#settingLeftBar").checked = true
    document.body.classList.add("left", this.checked)
}

document.querySelector("input#settingLeftBar").addEventListener("input", function() {
    localStorage["g4_leftSidebar"] = this.checked
    document.body.classList.toggle("left", this.checked)
})

// Settings section
document.querySelector("#settingsMusicBtn").addEventListener("click", function() {
    openWindow("settingsMusic")
})
document.querySelector("#settingsInputBtn").addEventListener("click", function() {
    openWindow("settingsInput")
})
document.querySelector("#settingsAppearanceBtn").addEventListener("click", function() {
    openWindow("settingsAppearance")
})
document.querySelector("#settingsLeaderboardBtn").addEventListener("click", function() {
    openWindow("settingsLeaderboard")
})
document.querySelector("#settingsPluginsBtn").addEventListener("click", function() {
    openWindow("settingsPlugins")
})
document.querySelector("#settingsAboutBtn").addEventListener("click", function() {
    openWindow("settingsAbout")
})

// Notifications
/**
 * @typedef {Object} NotificationSpec
 * 
 * @property {Object} source
 * 
 * @property {String} text
 * @property {NotificationButtonSpec[]} buttons
 */

/**
 * @typedef {Object} NotificationButtonSpec
 * 
 * @property {String} text
 * @property {Function} callback
 */

/**
 * 
 * @param {NotificationSpec} notif 
 */
function showNotification(notif) {
    if (notif.text.length > 100) notif.text = notif.text.substring(0, 98) + "..."

    let container = document.querySelector("div.notifications")

    let notifSection = document.createElement("section")
    notifSection.classList.add("notification")

    let header = document.createElement("header")

    let icon = "", name = "G4"
    if (notif.source) {
        icon = notif.source.icon
        name = notif.source.name
    }

    let iconImg = document.createElement("img")
    iconImg.src = icon
    header.appendChild(iconImg)

    let nameP = document.createElement("p")
    nameP.classList.add("name")
    nameP.textContent = name
    header.appendChild(nameP)

    let dismissBtn = document.createElement("button")
    dismissBtn.textContent = "Dismiss"
    dismissBtn.addEventListener("click", () => {
        container.removeChild(notifSection)
    })
    header.appendChild(dismissBtn)

    notifSection.appendChild(header)

    let content = document.createElement("div")
    content.classList.add("content")

    let text = document.createElement("p")
    text.textContent = notif.text
    content.appendChild(text)

    if (notif.buttons && notif.buttons.length) {
        let buttons = document.createElement("div")
        buttons.classList.add("buttons")

        notif.buttons.forEach(btn => {
            let button = document.createElement("button")

            button.textContent = btn.text
            button.addEventListener("click", () => {
                btn.callback()
                container.removeChild(notifSection)
            })

            buttons.appendChild(button)
        })

        content.appendChild(buttons)
    }

    notifSection.appendChild(content)

    if (container.children.length) {
        container.insertBefore(notifSection, container.children[0])
    } else {
        container.appendChild(notifSection)
    }
}

function updateModeButtons() {
    let modeButtons = document.querySelector("section.gameMode div.content")
    
    modeButtons.innerHTML = ""
    
    gameModes.forEach(mode => {
        let button = document.createElement("button")
        button.classList.add("mode")

        if (mode instanceof NativeMode) {
            button.setAttribute("data-mode", mode.modeId)
        } else if (mode instanceof CustomMode) {
            let colors = mode.getThemeColors()

            button.setAttribute("data-mode", "custom")

            for (let color in colors) {
                button.style.setProperty("--g4-game-custom-" + color, colors[color])
            }
        }

        if (mode == getActiveMode()) button.classList.add("active")

        button.textContent = mode.name

        if (mode instanceof CustomMode) {
            let icon = document.createElement("img")
            icon.src = mode.ownerPlugin.getFilePath(mode.ownerPlugin.icon)
            button.appendChild(icon)
        }

        button.addEventListener("click", () => {
            if (button.classList.contains("active")) return

            dispatchEvent(new CustomEvent(
                "g4modechange",
                {
                    detail: {
                        mode: mode
                    }
                }
            ))

            document.querySelector("section.gameMode button.active").classList.remove("active")
            button.classList.add("active")
        })

        modeButtons.appendChild(button)
    })
}
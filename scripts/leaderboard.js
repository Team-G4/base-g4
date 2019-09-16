let leaderboardEndpoint = "https://g4-leaderboard.herokuapp.com"

/**
 * @typedef {Object} Score
 * 
 * @property {String} player
 * @property {Number} score
 * @property {Number} date
 */

class Leaderboard {
    /**
     * @param {String} mode 
     * @returns {Promise<Score[]>}
     */
    static async getLeaderboard(mode) {
        let data = await fetch(
            leaderboardEndpoint + "/scores/" + mode
        )
        data = await data.json()

        return data.sort((i1, i2) => i2.score - i1.score)
    }

    static getNickname() {
        return localStorage.getItem("g4game_player")
    }

    static async isNicknameAvailable(nickname) {
        let player = encodeURIComponent(nickname)
        let url = `${leaderboardEndpoint}/players/nicknameCheck?user=${player}`

        let data = await fetch(url)
        data = await data.json()

        if (data.check) return false
        return true
    }

    static async setNickname(nickname) {
        let player = encodeURIComponent(nickname)
        let url = `${leaderboardEndpoint}/players/nicknameAdd?user=${player}`

        let data = await fetch(url)
        data = await data.json()
        
        localStorage.setItem("g4game_player", nickname)
    }

    static async setScore(mode, score) {
        if (!localStorage.getItem("g4game_player")) return false
        
        let player = encodeURIComponent(localStorage.getItem("g4game_player"))

        let url = `${leaderboardEndpoint}/set/${mode}?user=${player}&score=${score}`

        await fetch(url)

        return true
    }

    static async updateLeaderboard(mode) {
        let scores = await Leaderboard.getLeaderboard(mode)

        console.log(scores)

        let table = document.querySelector("section.leaderboard tbody")
        table.innerHTML = ""

        scores.forEach((score, i) => {
            let tr = document.createElement("tr")

            let rank = document.createElement("td")
            rank.textContent = i + 1
            tr.appendChild(rank)

            let player = document.createElement("td")
            player.textContent = score.player
            tr.appendChild(player)

            let scoreText = document.createElement("td")
            scoreText.textContent = score.score
            tr.appendChild(scoreText)

            table.appendChild(tr)
        })
    }
}
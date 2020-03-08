const loadingTextArr = [
    "Placing circular obstacles",
    "Shooting bullets",
    "Spinning in circles",
    "Have you tried bepsi today?",
    "Stealing all the cookies",
    "Coming up with more loading texts"
]


//get random item
const item = loadingTextArr[Math.floor(Math.random() * loadingTextArr.length)]

window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("loadingText").textContent = item
});
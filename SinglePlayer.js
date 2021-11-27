import {} from './DuoPlayer.js'
import { initalize } from './Utilities.js'

let levelButton = document.getElementById('level-button')
let levelOptions = ["Easy", "Medium", "Hard"]
let levelColors = ["#0D8C10", "#6EE2CE", "#EB4D4D"]
let currentLevel = 1
let delay
levelButton.onmouseenter = ()=>{
    delay = setTimeout(() => {
        levelButton.innerHTML = levelOptions[currentLevel]
    }, 150);
}
levelButton.onmouseleave = ()=>{
    levelButton.innerHTML = ""
    clearTimeout(delay)
}
levelButton.onclick = ()=>{
    currentLevel++
    if (currentLevel>=levelOptions.length){
        currentLevel=0
    }
    levelButton.innerHTML = levelOptions[currentLevel]
    levelButton.style.setProperty('--box-shadow-color', levelColors[currentLevel])
}
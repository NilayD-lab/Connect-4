
let popUpContainer = document.getElementById('pop-up-container')
let hardButton = document.getElementById('hard')
let easyButton = document.getElementById('easy')
let mediumButton = document.getElementById('medium')
hardButton.remove()
easyButton.remove()
mediumButton.remove()
let lightMode = true;
let isRed = true;
let topPiece = document.getElementById('player-one')
let computerButton = document.getElementById('computer')
let duoButton = document.getElementById('duo')
console.log(computerButton.offsetTop); 
let piece = document.getElementById('piece')
piece.style.display = "none"
let timer;
if (window.innerWidth>=1400){
    timer = setInterval(rain, 2000)
}
document.body.addEventListener('dblclick', event=>{
    if (event.target!=computerButton && event.target!=duoButton && event.target!=topPiece){
        if (lightMode){
            lightMode = false;
            document.getElementById('all').style.backgroundColor= '#121212'
            document.getElementById('title').style.color = '#eee9e3'
        }
        else{
            lightMode = true;
            document.getElementById('all').style.backgroundColor= '#eee9e3'
            document.getElementById('title').style.color = 'black'
        }  
    }  
})
window.addEventListener('resize', ()=>{
    if (window.innerWidth<1400){
        clearInterval(timer)
    }

})
topPiece.addEventListener('click', ()=>{
    if (isRed){
        isRed = false
        topPiece.style.backgroundColor = 'yellow'
        topPiece.style.borderColor = '#DBC900'
    }
    else{
        isRed = true
        topPiece.style.backgroundColor = 'red'
        topPiece.style.borderColor = '#C90A0A'
    }
    
})

computerButton.addEventListener('click', ()=>{
    popUpContainer.appendChild(hardButton)
    popUpContainer.appendChild(mediumButton)
    popUpContainer.appendChild(easyButton)
    hardButton.classList.add('pop')
    mediumButton.classList.add('pop')
    easyButton.classList.add('pop')
    
    

})
























function rain(){
    if (Math.random()<.5){
        return
    }
    if(Math.random()>.5){
        piece.style.backgroundColor = 'yellow'
        piece.style.borderColor = '#DBC900'
    }
    else{
        piece.style.backgroundColor = 'red'
        piece.style.borderColor = '#C90A0A'
    }
    
    switch (Math.floor(Math.random()*10)){
        case 0: piece.style.left = '2vw'; break;
        case 1: piece.style.left = '5vw'; break;
        case 2: piece.style.left = '10vw'; break;
        case 3: piece.style.left = '15vw'; break;
        case 4: piece.style.left = '20vw'; break;
        case 5: piece.style.left = '80vw'; break;
        case 6: piece.style.left = '85vw'; break;
        case 7: piece.style.left = '90vw'; break;
        case 8: piece.style.left = '95vw'; break;
        default: piece.style.left = '95vw'
    }
    piece.style.display = "inline"
    piece.classList.add('drop')
    piece.classList.remove('upper')
    piece.addEventListener('animationend', lower)
}
function lower(){
    piece.classList.remove('drop')
    piece.classList.add('upper')
}


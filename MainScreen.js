
// let popUpContainer = document.getElementById('pop-up-container')
// let hardButton = document.getElementById('hard')
// let easyButton = document.getElementById('easy')
// let mediumButton = document.getElementById('medium')
// hardButton.remove()
// easyButton.remove()
// mediumButton.remove()
// popUpContainer.remove()
let lightMode = true;
let isRed = true;
let topPiece = document.getElementById('player-one')
let computerButton = document.getElementById('computer')
let duoButton = document.getElementById('duo') 
let piece = document.getElementById('piece')
piece.style.display = "none"
let timer = setInterval(rain, 2000);
if (window.innerWidth<1400){
    topPiece.remove()
}

document.body.addEventListener('dblclick', event=>{
    function onlyBackground(child){
        let arr = [computerButton, duoButton, topPiece, piece, popUpContainer, easyButton, mediumButton, hardButton, popUpContainer]
        for (let i=0;i<arr.length;i++){
            if (child==arr[i]){
                return false
            }
        }
        return true
    }
    
    if (onlyBackground(event.target)){
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
        topPiece.remove()
    }
    else{
        document.body.appendChild(topPiece)
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



popUpContainer.addEventListener('click', event=>{
    if (event.target!=hardButton && event.target!=mediumButton && event.target!=easyButton){
        piece.style.animationPlayState = 'running'
        timer = setInterval(rain, 2000)
        hardButton.remove()
        mediumButton.remove()
        easyButton.remove()
        popUpContainer.remove() 
    }
   
    

})
window.addEventListener('keydown', event=>{
    if (event.key == "Escape"){
        piece.style.animationPlayState = 'running'
        timer = setInterval(rain, 2000)
        hardButton.remove()
        mediumButton.remove()
        easyButton.remove()
        popUpContainer.remove()
    }
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
    if (window.innerWidth>=1400){
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
    }
    else{
        piece.style.left =(Math.floor(Math.random()*80)+10) + 'vw'
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


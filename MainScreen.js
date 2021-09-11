let computerButton = document.getElementById('computer')
let piece = document.getElementById('piece')
let timer;
if (window.innerWidth>=1400){
    timer = setInterval(rain, 2000)
}
window.addEventListener('resize', ()=>{
    if (window.innerWidth<1400){
        clearInterval(timer)
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
    piece.classList.add('drop')
    piece.classList.remove('upper')
    piece.addEventListener('animationend', lower)
}
function lower(){
    piece.classList.remove('drop')
    piece.classList.add('upper')
   
}


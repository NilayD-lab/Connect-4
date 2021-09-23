
let container = document.getElementById('container')
let one = document.getElementById('one')
let two = document.getElementById('two')
let three = document.getElementById('three')
let four = document.getElementById('four')
let five = document.getElementById('five')
let six = document.getElementById('six')
let seven = document.getElementById('seven')
let count = 0;
let cols = [one, two, three, four, five, six, seven]
let selectedCol;
let pieces = []
for (let i=0;i<42;i++){
    pieces[i] = document.createElement('div')
    pieces[i].style = "--topPos: 0px; --endCol: 1; --row: 7; --startCol: 1; --dropCol: 1;"
    pieces[i].classList.add('circle')
    pieces[i].classList.add('follow')
}
for (let i=0;i<cols.length;i++){
    cols[i].style.gridColumn = i+1;
    cols[i].addEventListener('mouseover', event=>{
        container.appendChild(pieces[count])
        pieces[count].style.setProperty('--endCol', returnColVal("" + (i+1)) + 'vw')
        pieces[count].addEventListener('animationend',()=>{
            pieces[count].style.setProperty('--startCol', returnColVal("" + (i+1)) + 'vw')
        })
    })
}
container.addEventListener('mouseleave', ()=>{
    pieces[count].remove()
})
container.addEventListener('click', ()=>{
    pieces[count].classList.add('drop')
    pieces[count].addEventListener('animationend', ()=>{
        pieces[count].classList.remove('drop')
        pieces[count].classList.remove('follow')
        pieces[count].classList.add('stop')
        count++
    })
    
   
})







function returnColVal(col){
    switch (col){
        case "1": return 0; break;
        case "2": return 1*(55/7); break;
        case "3": return 2*(55/7); break;
        case "4": return 3*(55/7); break;
        case "5": return 4*(55/7); break;
        case "6": return 5*(55/7); break;
        default: return 6*(55/7);
    }
}
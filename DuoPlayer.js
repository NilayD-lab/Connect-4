
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
    pieces[i].classList.add('circle')
    pieces[i].classList.add('follow')
}
for (let i=0;i<cols.length;i++){
    cols[i].style.gridColumn = i+1;
    cols[i].addEventListener('mouseover', event=>{
        container.appendChild(pieces[count])
        document.documentElement.style.setProperty('--col', ''+(i+1))
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

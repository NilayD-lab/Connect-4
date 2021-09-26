let enteredBoard = false
let mouseLeft = true
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
let delay;
for (let i = 0; i < 42; i++) {
    pieces[i] = document.createElement('div')
    pieces[i].style = "--topPos: 0px; --endCol: 1; --row: 7; --startCol: 1; --dropCol: 1;"
    pieces[i].classList.add('circle')
    pieces[i].classList.add('follow')
}
for (let i = 0; i < cols.length; i++) {
    cols[i].style.gridColumn = i + 1;

    cols[i].addEventListener('mouseover', event => {
        clearTimeout(delay)
        delay = setTimeout(() => {
            cols[i].addEventListener('mouseleave', () => {
                clearTimeout(delay)
            })
            if (enteredBoard) {
                container.appendChild(pieces[count])
                pieces[count].style.setProperty('--endCol', returnColVal("" + (i + 1)) + 'vw')
                pieces[count].addEventListener('animationstart', () => {
                    if (!pieces[count].classList.contains('drop')) {
                        pieces[count].style.setProperty('--dropCol', i + 1 + '')
                        pieces[count].style.setProperty('--startCol', returnColVal("" + (i + 1)) + 'vw')
                    }

                })
            }
        }, 200)


        mouseLeft = false


    })

}

container.addEventListener('mouseleave', () => {
    if (!pieces[count].classList.contains('drop')) {
        pieces[count].remove()
        pieces[count].style.display = 'none'
        enteredBoard = false;
    }

})
container.addEventListener('mousedown', () => {
    pieces[count].classList.add('drop')
    pieces[count].addEventListener('animationend', () => {
        pieces[count].classList.remove('follow')
        pieces[count].classList.remove('drop')
        pieces[count].classList.add('stop')
        count++
    })

})
container.addEventListener('mouseover', event => {
    pieces[count].style.display = 'block'
    //pieces[count].style.setProperty('--startCol', '0vw')
    enteredBoard = true

})
function appearWhereMouseIs(i) {
    pieces[count].style.setProperty('--startCol', returnColVal("" + (i + 1)) + '%')

}





function returnColVal(col) {
    if (window.innerWidth >= 1000) {
        switch (col) {
            case "1": return 0; break;
            case "2": return 1 * (55 / 7); break;
            case "3": return 2 * (55 / 7); break;
            case "4": return 3 * (55 / 7); break;
            case "5": return 4 * (55 / 7); break;
            case "6": return 5 * (55 / 7); break;
            default: return 6 * (55 / 7);
        }
    }
    else{
        switch (col) {
            case "1": return 0; break;
            case "2": return 1 * (90 / 7); break;
            case "3": return 2 * (90 / 7); break;
            case "4": return 3 * (90 / 7); break;
            case "5": return 4 * (90 / 7); break;
            case "6": return 5 * (90 / 7); break;
            default: return 6 * (90 / 7);
        }
    }

}
import * as BackEnd from './backEnd.js'
import { initalize, dropChip, decideGameState, returnColVal, resetBoard, board, reachDelay } from './Utilities.js'
let undoButton = document.getElementById('undo')
export let enteredBoard = false
let container = document.getElementById('container')
let count = 0;
let cols = document.querySelectorAll('.col')
let pieces = []
let delay;
//let reachDelay;
let clearButton = document.getElementById('clear')

let columnLengths = [5, 5, 5, 5 ,5, 5, 5]
initalize(pieces, reachDelay, container)
for (let i = 0; i < cols.length; i++) {
    cols[i].style.gridColumn = i + 1;
    cols[i].addEventListener('mouseover', event => {
        if (decideGameState() == -1) {
            clearInterval(reachDelay)
            clearTimeout(delay)
            delay = setTimeout(() => {
                cols[i].addEventListener('mouseleave', () => {
                    clearTimeout(delay)
                })
                if (enteredBoard && !pieces[count].classList.contains('drop')) {
                    container.appendChild(pieces[count])
                    pieces[count].style.setProperty('--endCol', returnColVal("" + (parseInt(event.target.style.gridColumn))) + 'vw')
                    pieces[count].addEventListener('animationstart', () => {
                        pieces[count].style.setProperty('--startCol', returnColVal("" + (parseInt(event.target.style.gridColumn))) + 'vw')

                    })
                    pieces[count].onanimationend = event => {
                        if (event.animationName == 'shift') {
                            container.onmousedown = event => {
                                if (columnLengths[parseInt(event.target.style.gridColumn) - 1] >= 0 && decideGameState() == -1) {
                                    pieces[count].style.setProperty('--dropCol', parseInt(event.target.style.gridColumn) + '')
                                    dropChip(parseInt(event.target.style.gridColumn) - 1, count, columnLengths)
                                    console.log("sdfjksd")
                                }

                            }
                        }
                    }
                }

            }, 200)
        }
    })

}

export function changeCount(val) {
    count = val
}

container.addEventListener('mouseleave', () => {
    clearInterval(reachDelay)
    if (!pieces[count].classList.contains('drop')) {
        pieces[count].remove()
        pieces[count].style.display = 'none'
        enteredBoard = false;
    }
})
container.addEventListener('mouseover', () => {
    pieces[count].style.display = 'block'
    enteredBoard = true
})






undoButton.onmousedown = () => {
    undoButton.classList.add('down')
    undoButton.style.boxShadow = '0px 0px 0px .9vw black'


    undoButton.onmouseup = () => {
        undoButton.style.boxShadow = '0px 0px 0px 0px black'

        undoButton.style.opacity = '1'
        if (count > 0) {
            count--
            pieces[count].classList.add('disappear')
            hide(count)
            for (let i = 0; i <= count; i++) {
                pieces[i].classList.remove('red-won')
                pieces[i].classList.remove('yellow-won')

            }

        }


        undoButton.addEventListener('animationend', () => {
            undoButton.classList.remove('down')

        })
    }
}
function hide(count) {
    pieces[count].ontransitionend = () => {
        console.log(pieces[count])
        board[parseInt(getComputedStyle(pieces[count]).gridRow) - 2][parseInt(getComputedStyle(pieces[count]).gridColumn) - 1] = 0;
        columnLengths[parseInt(getComputedStyle(pieces[count]).gridColumn) - 1]++
        pieces[count].style = "--topPos: -0.08vw; --endCol: 4; --row: 7; --startCol: 4; --dropCol: 4; --innerColor:" + getColor(count, false) + "; --borderColor: " + getColor(count, true)
        pieces[count].className = 'circle follow'
        pieces[count].remove()
        pieces[count].ontransitionend = () => { console.log() }
    }

}
function getColor(num, isBorder) {
    if (isBorder) {
        if (num % 2 == 0) {
            return '#c90a0a'
        }
        return '#DBC900'
    }
    if (num % 2 == 0) {
        return 'red'
    }
    return 'yellow'
}
undoButton.addEventListener('mouseleave', () => {
    undoButton.style.boxShadow = '0px 0px 0px 0px black'
    undoButton.style.opacity = '1'
    undoButton.classList.remove('down')
    //count++
})
clearButton.querySelector('p').ontransitionend =  () => {
    clearButton.onmousedown = () => {
        clearButton.classList.remove('rotate-back')
        clearButton.classList.add('rotate')
        clearButton.onmouseup = () => {
            console.log()
            clearButton.classList.remove('rotate')
            clearButton.classList.add('rotate-back')

            if (parseInt(getComputedStyle(clearButton).transform.substring(7, 8)) >= .94) {
                console.log()
                for (let i = 0; i <= count; i++) {
                    pieces[i].classList.remove('red-won')
                    pieces[i].classList.remove('yellow-won')

                }
                while (count != 0) {
                    count--

                    pieces[count].classList.add('disappear')
                    remove(count)
                }
                resetBoard()
                columnLengths.fill(5)
            }


        }

    }
    clearButton.addEventListener('mouseleave', () => {
        clearButton.classList.remove('rotate')
        clearButton.classList.add('rotate-back')

    })
}
function remove(count) {
    pieces[count].ontransitionend = () => {
        pieces[count].style = "--topPos: -0.08vw; --endCol: 4; --row: 7; --startCol: 4; --dropCol: 4; --innerColor:" + getColor(count, false) + "; --borderColor: " + getColor(count, true)
        pieces[count].className = 'circle follow'
        pieces[count].ontransitionend = () => { console.log() }
        pieces[count].remove()

    }
}


















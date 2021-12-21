import * as BackEnd from './backEnd.js'
import { initalize, decideGameState, returnColVal, resetBoard, board, returnRowShift, contains, editDropAnimation, showWinningPieces } from './Utilities.js'
let undoButton = document.getElementById('undo')
let enteredBoard = false
let container = document.getElementById('container')
let count = 0;
let cols = document.querySelectorAll('.col')
let pieces = []
let delay;
let reachDelay;
let clearButton = document.getElementById('clear')
let smallWindow = window.innerWidth < 1000
let columnLengths = [5, 5, 5, 5, 5, 5, 5]
initalize(pieces)
window.onresize = () => {
    smallWindow = smallWindow < 1000
}

for (let i = 0; i < cols.length; i++) {
    cols[i].style.gridColumn = i + 1;
    if (!smallWindow) {
        cols[i].addEventListener('mouseover', event => {
            if (decideGameState(board) == -1) {
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
                                    if (columnLengths[parseInt(event.target.style.gridColumn) - 1] >= 0 && decideGameState(board) == -1) {
                                        pieces[count].style.setProperty('--dropCol', parseInt(event.target.style.gridColumn) + '')
                                        dropChip(parseInt(event.target.style.gridColumn) - 1)
                                    }

                                }
                            }
                        }
                    }

                }, 200)
            }
        })
    }
    else {
        cols[i].onmouseup = () => {
            if (decideGameState(board) == -1 && enteredBoard && !pieces[count].classList.contains('drop')) {
                console.log(i)
                container.appendChild(pieces[count])

                pieces[count].style.setProperty('--endCol', returnColVal("" + (parseInt(cols[i].style.gridColumn))) + 'vw')
                pieces[count].addEventListener('animationstart', () => {
                    pieces[count].style.setProperty('--startCol', returnColVal("" + (parseInt(cols[i].style.gridColumn))) + 'vw')

                })
                if (columnLengths[parseInt(cols[i].style.gridColumn) - 1] >= 0 && decideGameState(board) == -1) {
                    pieces[count].style.setProperty('--dropCol', parseInt(cols[i].style.gridColumn) + '')
                    dropChip(parseInt(cols[i].style.gridColumn) - 1)
                }
            }

        }
    }

}
let msCounted = 0;
function dropChip(i) {
    container.onmousedown = () => {
        console.log()
    }
    board[columnLengths[i]][i] = count % 2 + 1
    pieces[count].style.setProperty('--row', '' + (columnLengths[i] + 2))
    pieces[count].style.setProperty('--topPos', returnRowShift("" + columnLengths[i]))
    pieces[count].classList.add('drop')
    editDropAnimation(columnLengths[i], count)
    columnLengths[i]--;
    pieces[count].onanimationend = event => {
        if (event.animationName == 'fall-rows-3-5' || event.animationName == 'fall-rows-1-2' || event.animationName == 'fall-row-0') {

            pieces[count].classList.remove('follow')
            pieces[count].classList.remove('drop')
            pieces[count].classList.add('stop')
            count++
            msCounted = 0
            if (decideGameState(board) == -1 && !smallWindow) {
                reachDelay = setInterval(reachMouse, 1)

            }
            if (decideGameState(board) == 1) {
                showWinningPieces('red-won', count)
            }
            if (decideGameState(board) == 2) {
                showWinningPieces('yellow-won', count)
            }

        }

    }

}
function reachMouse() {
    if (!enteredBoard) {
        clearInterval(reachDelay)
    }
    if (msCounted > 100) {

        clearInterval(reachDelay)
        container.appendChild(pieces[count])

        pieces[count].onanimationend = event => {
            if (event.animationName == 'shift') {
                container.onmousedown = event => {
                    pieces[count].style.setProperty('--dropCol', parseInt(event.target.style.gridColumn) + '')
                    dropChip(parseInt(event.target.style.gridColumn) - 1, count, columnLengths)
                }
            }

        }


    }

    if (contains(container.querySelectorAll('div'), document.querySelectorAll(':hover')[3])) {
        let col = parseInt(getComputedStyle(document.querySelectorAll(':hover')[3]).gridColumn)
        pieces[count].style.setProperty('--endCol', returnColVal("" + (col)) + 'vw')
        pieces[count].addEventListener('animationstart', () => {
            pieces[count].style.setProperty('--startCol', returnColVal("" + (col)) + 'vw')

        })

        msCounted++;

    }


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




undoButton.addEventListener('mouseleave', () => {
    undoButton.style.boxShadow = '0px 0px 0px 0px black'
    undoButton.style.opacity = '1'
    undoButton.classList.remove('down')
    //count++
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

clearButton.querySelector('p').ontransitionend = () => {
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
if (smallWindow){
    clearButton.onmousedown = ()=>{
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
function remove(count) {
    pieces[count].ontransitionend = () => {
        pieces[count].style = "--topPos: -0.08vw; --endCol: 4; --row: 7; --startCol: 4; --dropCol: 4; --innerColor:" + getColor(count, false) + "; --borderColor: " + getColor(count, true)
        pieces[count].className = 'circle follow'
        pieces[count].ontransitionend = () => { console.log() }
        pieces[count].remove()

    }
}


















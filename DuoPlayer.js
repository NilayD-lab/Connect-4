import * as BackEnd from './backEnd.js'
let gameEnd = false
let undoButton = document.getElementById('undo')
let clearButton = document.getElementById('clear')
let enteredBoard = false
let mouseLeft = false
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
let pieces = []
let delay;
let reachDelay;
let turn = 0;
let columnLengths = [5, 5, 5, 5, 5, 5, 5]
let board = BackEnd.makeBoard()
let ended = false;
let innerColor = ""
let borderColor = ""
for (let i = 0; i < 42; i++) {
    pieces[i] = document.createElement('div')
    let shift = "-.8vw";
    // if (window.innerWidth < 1000) {
    //     shift = 0
    // }
    innerColor = "red"
    borderColor = "#c90a0a"
    if (turn % 2 == 1) {
        innerColor = "yellow"
        borderColor = "#DBC900"
    }
    turn++
    pieces[i].style = "--topPos:" + shift + "; --endCol: 4; --row: 7; --startCol: 4; --dropCol: 4; --innerColor:" + innerColor + "; --borderColor: " + borderColor
    pieces[i].classList.add('circle')
    pieces[i].classList.add('follow')
}
turn = 0
for (let i = 0; i < cols.length; i++) {
    cols[i].style.gridColumn = i + 1;
    cols[i].addEventListener('mouseover', event => {
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
                            pieces[count].style.setProperty('--dropCol', parseInt(event.target.style.gridColumn) + '')

                            dropChip(parseInt(event.target.style.gridColumn) - 1)
                        }
                    }



                }
            }

        }, 200)

    })
}

container.addEventListener('mouseleave', () => {
    clearInterval(reachDelay)
    if (!pieces[count].classList.contains('drop')) {
        pieces[count].remove()
        pieces[count].style.display = 'none'
        enteredBoard = false;
    }
})
let thing = 0;
function dropChip(i) {
    container.onmousedown = () => {
        console.log()
    }
    if (columnLengths[i] >= 0) {
        board[columnLengths[i]][i] = turn % 2 + 1
        //
        gameEnd = BackEnd.calculateWin(1, board)

        //
        pieces[count].style.setProperty('--row', '' + (columnLengths[i] + 2))
        pieces[count].style.setProperty('--topPos', returnRowShift("" + columnLengths[i]))
        pieces[count].classList.add('drop')
        editDropAnimation(columnLengths[i])
        columnLengths[i]--;
        pieces[count].addEventListener('animationend', event => {
            if (event.animationName == 'fall-rows-3-5' || event.animationName == 'fall-rows-1-2' || event.animationName == 'fall-row-0') {
                pieces[count].classList.remove('follow')
                pieces[count].classList.remove('drop')
                pieces[count].classList.add('stop')
                count++
                turn++;
                thing = 0
                reachDelay = setInterval(reachMouse, 1)




            }

        })
    }

}


function reachMouse() {
    if (!enteredBoard) {
        clearInterval(reachDelay)
    }
    if (thing > 100) {
        clearInterval(reachDelay)
        container.appendChild(pieces[count])

        pieces[count].onanimationend = event => {
            if (event.animationName == 'shift') {
                container.onmousedown = event => {
                    pieces[count].style.setProperty('--dropCol', parseInt(event.target.style.gridColumn) + '')
                    dropChip(parseInt(event.target.style.gridColumn) - 1)
                }
            }

        }


    }
    let col = parseInt(getComputedStyle(document.querySelectorAll(':hover')[3]).gridColumn)
    pieces[count].style.setProperty('--endCol', returnColVal("" + (col)) + 'vw')
    pieces[count].addEventListener('animationstart', () => {
        pieces[count].style.setProperty('--startCol', returnColVal("" + (col)) + 'vw')

    })

    thing++;
}
container.addEventListener('mouseover', () => {
    pieces[count].style.display = 'block'
    enteredBoard = true
})

undoButton.addEventListener('mousedown', () => {
    undoButton.classList.add('down')
    undoButton.style.boxShadow = '0px 0px 0px .9vw black'
    if (window.innerWidth < 1000) {
        undoButton.style.boxShadow = '0px 0px 0px 1.8vw black'
    }
    undoButton.addEventListener('mouseup', () => {
        undoButton.style.boxShadow = '0px 0px 0px 0px black'
        undoButton.style.opacity = '1'
        console.log(count)
        count--
        console.log(count)

        pieces[count].style.transform = 'scale(0);'
        undoButton.addEventListener('animationend', () => {
            undoButton.classList.remove('down')

        })
    })
})
undoButton.addEventListener('mouseleave', () => {
    undoButton.style.boxShadow = '0px 0px 0px 0px black'
    undoButton.style.opacity = '1'
    undoButton.classList.remove('down')
})

clearButton.querySelector('p').addEventListener('transitionend', () => {
    clearButton.addEventListener('mousedown', () => {
        clearButton.classList.remove('rotate-back')
        clearButton.classList.add('rotate')
        clearButton.addEventListener('mouseup', () => {
            clearButton.classList.remove('rotate')
            clearButton.classList.add('rotate-back')


        })

    })
    clearButton.addEventListener('mouseleave', () => {
        clearButton.classList.remove('rotate')
        clearButton.classList.add('rotate-back')

    })
})



















function editDropAnimation(row) {
    let multiplier = 1;
    if (window.innerWidth < 1000) {
        multiplier = 90 / 55
    }
    if (row > 3) {
        pieces[count].style.animationName = 'fall-rows-3-5'
        pieces[count].style.animationDuration = '700ms'
    }
    else if (row == 3) {
        pieces[count].style.animationName = 'fall-rows-3-5'
        pieces[count].style.animationDuration = '600ms'
    }
    else if (row == 2) {
        pieces[count].style.animationName = 'fall-rows-1-2'
        pieces[count].style.animationDuration = '400ms'
    }
    else if (row == 1) {
        pieces[count].style.animationName = 'fall-rows-1-2'
        pieces[count].style.animationDuration = '250ms'
    }
    else if (row == 0) {
        pieces[count].style.animationName = 'fall-row-0'
        pieces[count].style.animationDuration = '150ms'
    }

    pieces[count].style.setProperty('--dropDepth', multiplier * parseFloat(rowDepth(row)) + 'vw')
    pieces[count].style.setProperty('--firstBounce', multiplier * parseFloat(firstBounce(row)) + 'vw')
    pieces[count].style.setProperty('--secondBounce', multiplier * parseFloat(secondBounce(row)) + 'vw')

}
function firstBounce(row) {
    switch ('' + row) {
        case '5': return '36vw';
        case '4': return '29.6vw';
        case '3': return '23.3vw';
        case '2': return '18.3vw';
        case '1': return '13vw';
        default: return '0vw';
    }
}
function secondBounce(row) {
    switch ('' + row) {
        case '5': return '37vw';
        case '4': return '31vw';
        case '3': return '24.3vw';
        default: return '0vw';
    }
}

function rowDepth(row) {
    switch ('' + row) {
        case '5': return '39.3vw';
        case '4': return '32.8vw';
        case '3': return '26.6vw';
        case '2': return '20.1vw';
        case '1': return '13.6vw';
        default: return '7.3vw';
    }
}


function returnRowShift(row) {
    switch (row) {
        case '5': return "-.8vw"; break;
        case '4': return "-.4vw"; break;
        case '3': return "-.1vw"; break;
        case '2': return "-.1vw"; break;
        case '1': return ".2vw"; break;
        default: return ".5vw";
    }

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
    else {
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
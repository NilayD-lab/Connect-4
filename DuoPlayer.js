import * as BackEnd from './backEnd.js'
let gameEnd = -1
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
container.addEventListener('mouseleave', () => {
    clearInterval(reachDelay)
    if (!pieces[count].classList.contains('drop')) {
        pieces[count].remove()
        pieces[count].style.display = 'none'
        enteredBoard = false;
    }
})
let msCounted = 0;
function dropChip(i) {
    console.log(count + "bff")
    container.onmousedown = () => {
        console.log()
    }
    console.log(columnLengths)
    board[columnLengths[i]][i] = count % 2 + 1
    pieces[count].style.setProperty('--row', '' + (columnLengths[i] + 2))
    pieces[count].style.setProperty('--topPos', returnRowShift("" + columnLengths[i]))
    pieces[count].classList.add('drop')
    editDropAnimation(columnLengths[i])
    columnLengths[i]--;
    pieces[count].onanimationend = event => {

        if (event.animationName == 'fall-rows-3-5' || event.animationName == 'fall-rows-1-2' || event.animationName == 'fall-row-0') {

            pieces[count].classList.remove('follow')
            pieces[count].classList.remove('drop')
            pieces[count].classList.add('stop')
            count++
            msCounted = 0
            if (decideGameState() == -1) {
                reachDelay = setInterval(reachMouse, 1)
            }
            if (decideGameState() == 1) {
                showWinningPieces('red-won')
            }
            if (decideGameState() == 2) {
                showWinningPieces('yellow-won')
            }


        }

    }

}

function showWinningPieces(name) {
    decideGameState()
    let entry = BackEnd.getWinningLine()
    console.log(entry)
    for (let i = 0; i < entry.length; i++) {

        findPiece(entry[i].row, entry[i].col).classList.add(name)
    }
}
function findPiece(row, col) {
    for (let i = 0; i <= count; i++) {

        if (parseInt(getComputedStyle(pieces[i]).gridColumn) == col + 1 && parseInt(getComputedStyle(pieces[i]).gridRow) == row + 2) {

            return pieces[i]
        }
    }
}
function decideGameState() {
    if (BackEnd.calculateWin(1, board)) {
        return 1
    }
    if (BackEnd.calculateWin(2, board)) {
        return 2
    }
    if (isFull()) {
        return 0
    }
    return -1
    function isFull() {
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                if (board[r][c] == 0) {
                    return false
                }
            }
        }
        return true
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
                    dropChip(parseInt(event.target.style.gridColumn) - 1)
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
function contains(list, elem) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] == elem) {
            return true
        }
    }
    return false
}
container.addEventListener('mouseover', () => {
    pieces[count].style.display = 'block'
    enteredBoard = true
})
undoButton.onmouseenter = () => {
    //count--
    console.log(count)
}
undoButton.onmousedown = () => {
    console.log(count)
    undoButton.classList.add('down')
    undoButton.style.boxShadow = '0px 0px 0px .9vw black'
    if (window.innerWidth < 1000) {
        undoButton.style.boxShadow = '0px 0px 0px 1.8vw black'
    }
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
            gameEnd = -1

        }


        undoButton.addEventListener('animationend', () => {
            undoButton.classList.remove('down')

        })
    }
}
function hide(count) {
    pieces[count].ontransitionend = () => {
        console.log(board)
        board[parseInt(getComputedStyle(pieces[count]).gridRow) - 2][parseInt(getComputedStyle(pieces[count]).gridColumn) - 1] = 0;
        columnLengths[parseInt(getComputedStyle(pieces[count]).gridColumn) - 1]++
        pieces[count].style = "--topPos: -0.08vw; --endCol: 4; --row: 7; --startCol: 4; --dropCol: 4; --innerColor:" + getColor(count, false) + "; --borderColor: " + getColor(count, true)
        pieces[count].className = 'circle follow'
        pieces[count].remove()
        pieces[count].removeEventListener('transitionend', hide)
        gameEnd = -1
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

clearButton.querySelector('p').addEventListener('transitionend', () => {
    clearButton.onmousedown = () => {
        clearButton.classList.remove('rotate-back')
        clearButton.classList.add('rotate')
        clearButton.onmouseup = () => {
            console.log()
            clearButton.classList.remove('rotate')
            clearButton.classList.add('rotate-back')

            if (getComputedStyle(clearButton).transform.substring(7, 8) >= ".94") {
                while (count != 0) {
                    count--
                    pieces[count].classList.add('disappear')
                    remove(count)
                }
                board = BackEnd.makeBoard()
                columnLengths = [5, 5, 5, 5, 5, 5]
                gameEnd = -1
            }


        }

    }
    clearButton.addEventListener('mouseleave', () => {
        clearButton.classList.remove('rotate')
        clearButton.classList.add('rotate-back')

    })
})

function remove(count) {
    pieces[count].addEventListener('transitionend', () => {
        pieces[count].style = "--topPos: -0.08vw; --endCol: 4; --row: 7; --startCol: 4; --dropCol: 4; --innerColor:" + getColor(count, false) + "; --borderColor: " + getColor(count, true)
        pieces[count].className = 'circle follow'
        pieces[count].remove()

    })
}














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
        case '2': return '21.4vw';
        case '1': return '13.6vw';
        default: return '7.3vw';
    }
}


function returnRowShift(row) {
    switch (row) {
        case '5': return "-.8vw"; break;
        case '4': return "-.4vw"; break;
        case '3': return "-.1vw"; break;
        case '2': return "0vw"; break;
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
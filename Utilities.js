import * as BackEnd from './backEnd.js'
export let board = BackEnd.makeBoard()

let pieces
export function initalize(p) {
    pieces = p
    let turn = 0;
    let innerColor = "red"
    let borderColor = "#c90a0a"
    for (let i = 0; i < 42; i++) {
        pieces[i] = document.createElement('div')
        if (turn % 2 == 1) {
            innerColor = "yellow"
            borderColor = "#DBC900"
        }
        else{
            innerColor = "red"
            borderColor = "#c90a0a"
        }
        turn++
        pieces[i].style = "--topPos: -.8vw; --endCol: 4; --row: 7; --startCol: 4; --dropCol: 4; --innerColor:" + innerColor + "; --borderColor: " + borderColor
        pieces[i].classList.add('circle')
        pieces[i].classList.add('follow')
    }
    
}


export function decideGameState(board) {
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
export function returnColVal(col) {
    let value = 55;
    if (window.innerWidth < 1000) {
        value = 90
    }
    return (parseInt(col) - 1) * (value / 7)
}

export function resetBoard(){
    board = BackEnd.makeBoard()
}
export function showWinningPieces(name, count) {
    //decideGameState()
    let entry = BackEnd.getWinningLine()
    console.log(entry)
    for (let i = 0; i < entry.length; i++) {
        findPiece(entry[i].row, entry[i].col, count).classList.add(name)
    }
}
function findPiece(row, col, count) {
    console.log(count)

    for (let i = 0; i <= count; i++) {

        if (parseInt(getComputedStyle(pieces[i]).gridColumn) == col + 1 && parseInt(getComputedStyle(pieces[i]).gridRow) == row + 2) {
            return pieces[i]
        }
    }
}

export function contains(list, elem) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] == elem) {
            return true
        }
    }
    return false
}

export function editDropAnimation(row, count) {
    let multiplier = 1;
    if (window.innerWidth < 1000) {
        multiplier = 90 / 55
    }
    let animationNameOptions = ['fall-row-0', 'fall-rows-1-2', 'fall-rows-1-2', 'fall-rows-3-5', 'fall-rows-3-5', 'fall-rows-3-5']
    let animationDurationOptions = ['150ms', '250ms', '400ms', '600ms', '700ms', '700ms']
    pieces[count].style.animationName = animationNameOptions[row]
    pieces[count].style.animationDuration = animationDurationOptions[row]

    pieces[count].style.setProperty('--dropDepth', multiplier * parseFloat(rowDepth(row)) + 'vw')
    pieces[count].style.setProperty('--firstBounce', multiplier * parseFloat(firstBounce(row)) + 'vw')
    pieces[count].style.setProperty('--secondBounce', multiplier * parseFloat(secondBounce(row)) + 'vw')

}
function firstBounce(row) {
    let firstBounceDepths = ['0vw', '13vw', '18.3vw', '23.3vw', '29.6vw', '36vw']
    return firstBounceDepths[row]
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
    let rowDepths = ['7.3vw', '13.6vw', '21.4vw', '26.6vw', '32.8vw', '39.3vw']
    return rowDepths[row]
}


export function returnRowShift(row) {
    let rowShifts = ['.5vw', '.2vw', '0vw', '-.1vw', '-.4vw', '-.8vw']

    return rowShifts[row]

}
import { initalize, decideGameState, returnColVal, resetBoard, board, returnRowShift, contains, editDropAnimation, showWinningPieces } from './Utilities.js'
import * as BackEnd from './backEnd.js'

let levelButton = document.getElementById('level-button')
let levelOptions = ["Easy", "Medium", "Hard"]
let levelColors = ["#0D8C10", "#6EE2CE", "#EB4D4D"]
let currentLevel = 1

let numOfThreadsBack = 7
let depth = 7
let inc = 1
let undoButton = document.getElementById('undo')
let enteredBoard = false
let container = document.getElementById('container')
let count = 0;
let cols = document.querySelectorAll('.col')
let pieces = []
let delay;
let reachDelay;
let clearButton = document.getElementById('clear')
let columnLengths = [5, 5, 5, 5, 5, 5, 5]

initalize(pieces)
initalizeLevelButton()

if (count == 1) {
    container.appendChild(pieces[count])
    pieces[count].style.setProperty('--endCol', returnColVal("" + (parseInt(4))) + 'vw')
    pieces[count].onanimationend = event => {
        if (event.animationName == 'shift' && count % 2 == 1) {
            pieces[count].style.setProperty('--dropCol', 4 + '')
            dropChip(4 - 1)

        }
    }
}

for (let i = 0; i < cols.length; i++) {
    cols[i].style.gridColumn = i + 1;
    cols[i].addEventListener('mouseover', event => {

        if (decideGameState(board) == -1) {
            if (count % 2 == 0) {
                clearInterval(reachDelay)
                clearTimeout(delay)
                delay = setTimeout(() => {
                    cols[i].addEventListener('mouseleave', () => {
                        clearTimeout(delay)
                    })
                    if (enteredBoard && !pieces[count].classList.contains('drop')) {
                        container.appendChild(pieces[count])
                        pieces[count].style.setProperty('--endCol', 
                            returnColVal("" + (parseInt(event.target.style.gridColumn))) + 'vw')
                        pieces[count].addEventListener('animationstart', () => {
                            pieces[count].style.setProperty('--startCol', 
                                returnColVal("" + (parseInt(event.target.style.gridColumn))) + 'vw')
                        })
                        pieces[count].onanimationend = event => {
                            if (event.animationName == 'shift' && count % 2 == 0) {
                                container.onmousedown = event => {
                                    if (columnLengths[parseInt(event.target.style.gridColumn) - 1] >= 0 && decideGameState(board) == -1) {
                                        pieces[count].style.setProperty('--dropCol', parseInt(event.target.style.gridColumn) + '')
                                        dropChip(parseInt(event.target.style.gridColumn) - 1)
                                    }

                                }
                            }
                        }
                    }

                }, 0)
            }

        }

    })

}
function selectionSort(arr) {
    let min = { move: -1, value: Number.MAX_SAFE_INTEGER }
    let minIndex
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            if (min.value > arr[j].value) {
                min = arr[j]
                minIndex = j
            }
        }
        arr[minIndex] = arr[i]
        arr[i] = min

        min = { move: -1, value: Number.MAX_SAFE_INTEGER }
    }
    
    return arr
}
function orderByCenter(arr) {
    let max = { move: -1, value: -1 }
    let maxIndex
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            if (arr[i].value == arr[j].value && colValue(arr[j].move) > colValue(max.move)) {
                max = arr[j]
                maxIndex = j
            }
        }
        arr[maxIndex] = arr[i]
        arr[i] = max
        max = { move: -1, value: -1 }
    }
    return arr
}
function colValue(i) {
    let arr = [1, 2, 3, 4, 3, 2, 1]
    return arr[i] == undefined ? -1 : arr[i]

}






let amountOfFullCols = 0
function checkAmountOfFullCols(columnLengths) {
    let temp = 0
    for (let i = 0; i < columnLengths.length; i++) {
        if (columnLengths[i] === -1) {
            temp++
        }
    }
    return temp > amountOfFullCols
}


let threshhold = 13
let msCounted = 0;
function dropChip(i) {
    if (count % 3 == 0) {
        depth+=inc
        console.log(depth)
    }





    container.onmousedown = () => {
        console.log()
    }
    board[columnLengths[i]][i] = count % 2 + 1
    pieces[count].style.setProperty('--row', '' + (columnLengths[i] + 2))
    pieces[count].style.setProperty('--topPos', returnRowShift("" + columnLengths[i]))
    pieces[count].classList.add('drop')
    editDropAnimation(columnLengths[i], count)
    columnLengths[i]--
    print(board)
    pieces[count].onanimationend = event => {

        if (event.animationName == 'fall-rows-3-5' || event.animationName == 'fall-rows-1-2' || event.animationName == 'fall-row-0') {

            pieces[count].classList.remove('follow')
            pieces[count].classList.remove('drop')
            pieces[count].classList.add('stop')
            count++
            msCounted = 0
            if (decideGameState(board) == -1 && count % 2 == 0) {
                reachDelay = setInterval(reachMouse, 1)
            }
            if (decideGameState(board) == 1) {
                showWinningPieces('red-won', count)
                return
            }
            if (decideGameState(board) == 2) {
                showWinningPieces('yellow-won', count)
                return
            }
            if (count % 2 == 1) {
                startThreads()


            }
        }

    }

}
function assignObj(arr){
    let temp = []
    for (let i=0;i<7;i++){
        temp[i] = {move: i, value: arr[i]}
    }
    return temp
}

function playBestMove(scores) {
    let bestMove = orderByCenter(selectionSort(scores))[0].move + 1 
    container.appendChild(pieces[count])
    pieces[count].style.setProperty('--endCol', returnColVal("" + (parseInt(bestMove))) + 'vw')
    console.log(scores)
    pieces[count].onanimationend = event => {
        if (event.animationName == 'shift' && count % 2 == 1) {
            pieces[count].style.setProperty('--dropCol', bestMove + '')
            dropChip(bestMove - 1)

        }
    }

}
function print(board) {
    let row = ""
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < 7; c++) {
            row += "" + board[r][c] + " "
        }
        console.log(row)
        row = ""
    }
}
function startThreads() {
    let scores = [-1, -1, -1, -1, -1, -1, -1]
    numOfThreadsBack = 0
    let workers = []
    for (let i = 0; i < 7; i++) {
        workers[i] = new Worker('worker.js')
        workers[i].postMessage({
            move: i,
            depth: depth,
            board: board,
            colLengths: columnLengths
        })
        workers[i].onmessage = (event) => {
            scores[i] = event.data
            numOfThreadsBack++
            workers[i].terminate()
        }


    }
    let temp = setInterval(() => {
        if (numOfThreadsBack == 7) {

            clearInterval(temp)
            console.log(scores)
            scores = assignObj(scores)
            playBestMove(scores)


        }
    }, 1);


}

function indexOfMin(arr) {
    // for (let i = 0; i < 7; i++) {
    //     if (arr[i] == 0) {
    //         arr[i] = -1 * colValue(i)
    //     }
    // }
    let min = Number.MAX_SAFE_INTEGER
    let minIndex = -1
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < min && arr[i] != -5) {
            min = arr[i]
            minIndex = i
        }
    }

    return minIndex
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
                    console.log('slskFJsd;lkf')
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
    if (!pieces[count].classList.contains('drop') && count % 2 == 0) {
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


function initalizeLevelButton() {
    let textDelay
    levelButton.onmouseenter = () => {
        textDelay = setTimeout(() => {
            console.log(levelOptions[currentLevel])
            levelButton.innerHTML = levelOptions[currentLevel]
        }, 150);
    }
    levelButton.onmouseleave = () => {
        levelButton.innerHTML = ""
        clearTimeout(textDelay)
    }
    levelButton.onclick = () => {
        currentLevel++
        if (currentLevel >= levelOptions.length) {
            currentLevel = 0
        }
        if (currentLevel == 2){inc = 2}
        if (currentLevel == 1){inc = 1}
        if (currentLevel == 0){inc = 0}
        levelButton.innerHTML = levelOptions[currentLevel]
        levelButton.style.setProperty('--box-shadow-color', levelColors[currentLevel])
    }
}


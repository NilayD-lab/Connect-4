//import * as BackEnd from "./backEnd";

const prompt = require('prompt-sync')()
let columnLengths = [0, 5, 5, -1, 4, 5, 5]
//columnLengths.fill(5)
let board = [
    [0, 0, 0, 2, 0, 0, 0],
    [1, 0, 0, 2, 0, 0, 0],
    [2, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 2, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 2, 2, 0, 0]
]
//let board = makeBoard()
let scores = [0, 5, 5, -1, 4, 5, 5]
let turn = 1
let answer
let bestMove
print(board)
let depth = 10;
startGame()
async function startGame() {
    while (decideGameState(board) == -1) {
        if (turn % 3 == 0) {
            depth++
        }
        if (turn % 2 == 0) {
            answer = parseInt(prompt("move: "))
            board[columnLengths[answer]][answer] = 1
            columnLengths[answer]--
            print(board)
        }
        else {

            await Promise.all([
                startBranch(0),
                startBranch(1),
                startBranch(2),
                startBranch(3),
                startBranch(4),
                startBranch(5),
                startBranch(6)

            ])
            // for (let i = 0; i < columnLengths.length; i++) {
            //     if (columnLengths[i] >= 0) {
            //         board[columnLengths[i]][i] = 2
            //         columnLengths[i]--
            //         scores[i] = (minimax(1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, depth, true, board, columnLengths))
            //         columnLengths[i]++
            //         board[columnLengths[i]][i] = 0

            //     }
            //     else {
            //         columnLengths[i] = Math.MAX_SAFE_INTEGER
            //     }
            // }
            console.log(scores)
            bestMove = indexOfMin(scores)
            console.log(bestMove)
            board[columnLengths[bestMove]][bestMove] = 2
            columnLengths[bestMove]--
            print(board)
        }
        turn++
    }
}
async function doSomething(i) {
    let tempBoard = copyBoard(board)
    let colLenghts = columnLengths.slice()
    tempBoard[colLenghts[i]][i] = 2
    colLenghts[i]--
    scores[i] = minimax(1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, depth, true, tempBoard, colLenghts)
}
function indexOfMin(arr) {
    let min = Number.MAX_SAFE_INTEGER
    let minIndex = -1
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < min && arr[i] != -5 && arr[i] != -1) {
            min = arr[i]
            minIndex = i
        }
    }
    return minIndex
}

function startBranch(i) {
    if (columnLengths[i] < 0) {
        return
    }
    
    return new Promise(resolve => {
        console.time('doSomething')
        doSomething(i)
        console.log("process " + i+ ":")
        console.timeEnd('doSomething')
        resolve("bruh")

    })
}
async function createRoot(i) {
    await startBranch(i)
}


console.log(scores)
function colValue(i) {
    let arr = [1, 2, 3, 4, 3, 2, 1]
    return arr[i]
}
function minimax(move, alpha, beta, depth, player1, board, columnLengths) {

    let maxVal;
    let minVal;
    var val = 0;
    if (decideGameState(board) === 1) {
        return 100 + depth
    }
    if (decideGameState(board) === 2) {

        return -100 - depth
    }
    if (decideGameState(board) === 0) {

        return 0
    }
    if (depth == 0) {
        return 0
    }
    if (player1) {
        maxVal = Number.MIN_SAFE_INTEGER
        for (let i = 0; i < columnLengths.length; i++) {
            if (columnLengths[i] >= 0) {
                board[columnLengths[i]][i] = 1
                columnLengths[i]--
                val = minimax(i, alpha, beta, depth - 1, false, board, columnLengths)
                columnLengths[i]++
                board[columnLengths[i]][i] = 0
                maxVal = max(maxVal, val)
                alpha = max(alpha, val)
                if (beta <= alpha) {
                    break
                }
            }
        }
        return maxVal
    }
    else {
        minVal = Number.MAX_SAFE_INTEGER
        for (let i = 0; i < columnLengths.length; i++) {
            if (columnLengths[i] >= 0) {
                board[columnLengths[i]][i] = 2
                columnLengths[i]--
                val = minimax(i, alpha, beta, depth - 1, true, board, columnLengths)
                columnLengths[i]++
                board[columnLengths[i]][i] = 0
                minVal = min(minVal, val)
                beta = min(beta, val)
                if (beta <= alpha) {
                    break
                }
            }
        }
        return minVal
    }
}
function copyBoard(arr) {
    let temp = []
    for (let i = 0; i < 6; i++) {
        temp[i] = []
        for (let c = 0; c < 7; c++) {
            temp[i][c] = arr[i][c];
        }
    }
    return temp
}
function makeBoard() {
    let temp = []
    for (let i = 0; i < 6; i++) {
        temp[i] = []
        for (let c = 0; c < 7; c++) {
            temp[i][c] = 0;
        }
    }

    return temp
}

function decideGameState(board) {
    if (calculateWin(1, board)) {
        return 1
    }
    if (calculateWin(2, board)) {
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



function max(a, b) {
    return a > b ? a : b
}
function min(a, b) {
    return a < b ? a : b
}

function calculateWin(num, board) {
    return backSlashSearch(num, board) || fowardSlashSearch(num, board) || horizontalSearch(num, board) || verticalSearch(num, board)
}
function getWinningLine() {
    return winningLine
}
function backSlashSearch(num, board) {
    let topList = []
    let bottomList = []
    for (let r = board.length - 4; r >= 0; r--) {
        for (let c = 0; c < board[0].length - 1 - r; c++) {
            bottomList.push({ row: r + c, col: c })
            topList.push({ row: c, col: r + c + 1 })
        }
        if (searchForWinningLine(topList, num, board)) {
            return true
        }
        // if (searchForWinningLine(bottomList, num, board)){
        //     return true
        // }
        topList = []
        bottomList = []
    }
    return false;
}

function fowardSlashSearch(num, board) {
    let topList = []
    let bottomList = []
    for (let r = board.length - 1; r > 2; r--) {
        for (let c = 0; c <= r; c++) {
            topList.push({ row: r - c, col: c })
            bottomList.push({ row: board.length - 1 - r + c, col: board[0].length - 1 - c })

        }
        if (searchForWinningLine(topList, num, board)) {
            return true
        }
        if (searchForWinningLine(bottomList, num, board)) {
            return true
        }
        topList = []
        bottomList = []
    }
    return false;
}
function searchForWinningLine(list, num, board) {

    for (let i = 0; i < list.length - 3; i++) {
        if (getSpot(list[i], board) == num && getSpot(list[i + 1], board) == num && getSpot(list[i + 2], board) == num && getSpot(list[i + 3], board) == num) {
            for (let z = list.length - 1; z > i + 3; z--) {
                list.pop()
            }
            return true
        }
        else {
            list.shift()
            i--;
        }
    }
    return false
}
function getSpot(object, board) {
    return board[object.row][object.col]
}
function verticalSearch(num, board) {
    for (let c = 0; c < board[0].length; c++) {
        for (let r = 0; r < board.length - 3; r++) {
            if (board[r][c] == num && board[r + 1][c] == num && board[r + 2][c] == num && board[r + 3][c] == num) {
                winningLine = [{ row: r, col: c }, { row: r + 1, col: c }, { row: r + 2, col: c }, { row: r + 3, col: c }]
                return true
            }
        }
    }
    return false
}

function horizontalSearch(num, board) {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length - 3; c++) {
            if (board[r][c] == num && board[r][c + 1] == num && board[r][c + 2] == num && board[r][c + 3] == num) {
                winningLine = [{ row: r, col: c }, { row: r, col: c + 1 }, { row: r, col: c + 2 }, { row: r, col: c + 3 }]
                return true
            }
        }
    }
    return false
}
//import { board } from "./Utilities"
let prunes = 0
let map = new Map()
let initDepth
self.addEventListener('message', function (e) {
    map.clear()
    var depth = e.data.depth
    initDepth = depth
    var tempBoard = e.data.board
    var colLengths = e.data.colLengths
    var move = e.data.move
    try {
        tempBoard[colLengths[move]][move] = 2
        colLengths[move]--
    }
    catch (e) {
        this.self.postMessage(Number.MAX_SAFE_INTEGER)
    }

    self.postMessage(minimax(1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, depth, true, tempBoard, colLengths))
    console.log(move+": "+prunes)

})

function minimax(move, alpha, beta, depth, player1, board, columnLengths) {
    prunes++

    if (map.has(hash(board))) {
        return map.get(hash(board))
    }
    let maxVal;
    let minVal;
    var val = 0;
    if (decideGameState(board) === 1) {
        map.set(hash(board), 100 + depth)
        return 100 + depth
    }
    if (decideGameState(board) === 2) {
        map.set(hash(board), -100 - depth)
        return -100 - depth
    }
    if (decideGameState(board) === 0) {
        return 90
    }
    if (depth == 0) {
        return heuristicValue(1, board, depth) - heuristicValue(2, board, depth)//
    }
    if (player1) {
        maxVal = Number.MIN_SAFE_INTEGER
        let moves = orderMoves(1, columnLengths, board, depth)
        //console.log(moves)
        for (let i = 0; i < moves.length; i++) {
            let currentMove = moves[i].move
            if (columnLengths[currentMove] >= 0) {
                board[columnLengths[currentMove]][currentMove] = 1
                columnLengths[currentMove]--
                if (!mistake(2, board, columnLengths || !misssedWin(currentMove, 1, board, columnLengths))) {
                    val = minimax(i, alpha, beta, depth - 1, false, board, columnLengths)

                }
                else {
                    val = -100 - depth + 1
                }
                columnLengths[currentMove]++
                board[columnLengths[currentMove]][currentMove] = 0
                maxVal = max(maxVal, val)
                alpha = max(alpha, val)
                if (beta <= alpha) {

                    break
                }
            }
        }

        map.set(hash(board), maxVal)

        return maxVal
    }
    else {
        minVal = Number.MAX_SAFE_INTEGER
        let moves = orderMoves(2, columnLengths, board, depth).reverse()

        // console.log(moves)
        for (let i = 0; i < moves.length; i++) {
            let currentMove = moves[i].move
            if (columnLengths[currentMove] >= 0) {
                board[columnLengths[currentMove]][currentMove] = 2
                columnLengths[currentMove]--
                if (!mistake(1, board, columnLengths) || !misssedWin(currentMove, 2, board, columnLengths)) {
                    val = minimax(i, alpha, beta, depth - 1, true, board, columnLengths)

                }
                else {
                    val = 100 + depth - 1
                }

                columnLengths[currentMove]++
                board[columnLengths[currentMove]][currentMove] = 0
                minVal = min(minVal, val)
                beta = min(beta, val)
                if (beta <= alpha) {
                    break
                }
            }
        }
        map.set(hash(board), minVal)

        return minVal
    }
}


function hash(arr) {
    let str = ""
    for (let r = 0; r < arr.length; r++) {
        for (let c = 0; c < arr[r].length; c++) {
            str += "" + arr[r][c]
        }
    }
    return str
}


function mistake(player, board, columnLength) {//player is the opposition 
    for (let i = 0; i < columnLength.length; i++) {
        if (columnLength[i] >= 0) {
            board[columnLength[i]][i] = player
            if (decideGameState(board) === player) {
                board[columnLength[i]][i] = 0
                return true
            }
            board[columnLength[i]][i] = 0

        }

    }

    return false
}

function misssedWin(move, player, board, columnLengths) {//player is not the opposition
    columnLengths[move]++
    board[columnLengths[move]][move] = 0
    for (let i = 0; i < columnLengths.length; i++) {
        if (columnLengths[i] >= 0 && i != move) {
            board[columnLengths[i]][i] = player
            columnLengths[i]--
            if (decideGameState(board) === player) {
                return true
            }
            columnLengths[i]++
            board[columnLengths[i]][i] = 0
        }
    }
    board[columnLengths[move]][move] = player
    columnLengths[move]--
    return false
}
function orderMoves(player, columnLengths, board, depth) {
    let orderedMoves = []
    for (let i = 0; i < columnLengths.length; i++) {
        if (columnLengths[i] >= 0) {
            board[columnLengths[i]][i] = player
            columnLengths[i]--
            orderedMoves[i] = { move: i, value: heuristicValue(1, board, depth) - heuristicValue(2, board, depth) }//
            columnLengths[i]++
            board[columnLengths[i]][i] = 0
        }
        else {
            orderedMoves[i] = { move: i, value: -200 }
        }
    }
   

    orderedMoves = selectionSort(orderedMoves)
    return orderByCenter(orderedMoves)
}
function orderByCenter(arr) {
    let max = { move: -1, value: 0 }
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
        max = { move: -1, value: 0 }
    }
    return arr
}
function getDuplicates(arr, val) {
    let duplicates = []
    for (let i = 0; i < arr.length; i++) {
        if (val == arr[i].value) {
            duplicates.push(arr[i])
        }
    }
    return duplicates
}
function selectionSort(arr) {
    let max = { move: -1, value: Number.MIN_SAFE_INTEGER }
    let maxIndex
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            if (max.value < arr[j].value) {
                max = arr[j]
                maxIndex = j
            }
        }
        arr[maxIndex] = arr[i]
        arr[i] = max

        max = { move: -1, value: Number.MIN_SAFE_INTEGER }
    }
    return arr
}
function heuristicValue(player, board, depth) {
    let val = heuristicBackSlashSearch(player, board) + heuristicFowardSlashSearch(player, board) + heuristicHorizontalSearch(player, board) + heuristicVerticalSearch(player, board)
    if (val != Infinity) {
        return val
    }
    return 100 + depth
}
function countWinningPositions(player, board) {
    let count = 0
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] == 0) {
                board[r][c] = player
                if (decideGameState(board) == player) {
                    count++
                }
                board[r][c] = 0
            }
        }
    }
    return count
}

function heuristicBackSlashSearch(player, board) {
    let val = 0
    let topList = []
    let bottomList = []
    for (let r = board.length - 4; r >= 0; r--) {
        for (let c = 0; c < board[0].length - 1 - r; c++) {
            bottomList.push(board[r + c][c])
            topList.push(board[c][r + c + 1])
        }
        val += findConsecutives(player, topList)
        val += findConsecutives(player, bottomList)
        topList = []
        bottomList = []
    }
    return val;
}
function heuristicFowardSlashSearch(player, board) {
    let val = 0

    let topList = []
    let bottomList = []
    for (let r = board.length - 1; r > 2; r--) {
        for (let c = 0; c <= r; c++) {
            topList.push(board[r - c][c])
            bottomList.push(board[board.length - 1 - r + c][board[0].length - 1 - c])

        }
        val += findConsecutives(player, topList)
        val += findConsecutives(player, bottomList)

        topList = []
        bottomList = []
    }
    return val;
}

function heuristicVerticalSearch(player, board) {
    let val = 0
    let list = []
    for (let c = 0; c < board[0].length; c++) {
        for (let r = 0; r < board.length; r++) {
            list.push(board[r][c])
        }
        val += findConsecutives(player, list)
        list = []

    }
    return val
}

function heuristicHorizontalSearch(player, board) {
    let val = 0
    let list = []
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            list.push(board[r][c])
        }
        val += findConsecutives(player, list)
        list = []
    }
    return val
}


function findConsecutives(player, arr) {
    let zeroFound = false
    let pieceFound = false
    let consecutiveNums = 0
    let zeros = 0
    let score = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == player) {
            for (let z = i; z < arr.length; z++) {
                if (arr[z] == player) {
                    pieceFound = true
                    consecutiveNums += 1
                }
                if (arr[z] != player || z == arr.length - 1) {
                    if (consecutiveNums >= 4) {
                        return Infinity
                    }
                    if (zeroFound || arr[z] == 0) {
                        score += consecutiveNums * consecutiveNums
                        zeroFound = true
                    }

                    if (z == arr.length - 1 && arr[z] == player) {

                        return score
                    }
                    if (arr[z] != 0 && arr[z] != player) {
                        pieceFound = false
                    }
                    consecutiveNums = 0
                    i = z - 1
                    break
                }

            }
        }

        if (arr[i] == 0) {
            for (let z = i; z < arr.length; z++) {
                if (arr[z] == 0) {
                    zeroFound = true
                    zeros += 0.5
                }
                if (arr[z] != 0 || z == arr.length - 1) {
                    if (pieceFound || arr[z] == player) {
                        score += zeros
                    }

                    if (z == arr.length - 1 && arr[z] == 0) {
                        return score
                    }
                    if (arr[z] != 0 && arr[z] != player) {
                        zeroFound = false
                    }
                    zeros = 0
                    i = z - 1
                    break
                }

            }
        }
        if (arr[i] != 0 && arr[i] != player) {
            zeroFound = false
            pieceFound = false
        }
    }
    return score
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


function colValue(i) {
    let arr = [1, 2, 3, 4, 3, 2, 1]
    return arr[i] == undefined ? -1 : arr[i]

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
        if (searchForWinningLine(topList, num, board) || searchForWinningLine(bottomList, num, board)) {
            return true
        }
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
        if (searchForWinningLine(topList, num, board) || searchForWinningLine(bottomList, num, board)) {
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





function doubleWin(firstPlayer, secondPlayer, board, columnLength) {//firstplayer is the one who is supposed to be coming out on top. second player is opposition
    let numOfWins = 0
    for (let i = 0; i < columnLength.length; i++) {
        numOfWins = 0
        if (columnLength[i] >= 0) {
            board[columnLength[i]][i] = secondPlayer
            columnLength[i]--
            for (let j = 0; j < columnLength.length; j++) {
                if (columnLength[j] >= 0) {
                    board[columnLength[j]][j] = firstPlayer
                    if (decideGameState(board) === firstPlayer) {
                        numOfWins++
                        if (numOfWins == 2) {
                            board[columnLength[j]][j] = 0
                            columnLength[i]++
                            board[columnLength[i]][i] = 0
                            return true;
                        }
                    }
                    board[columnLength[j]][j] = 0
                }
            }
            columnLength[i]++
            board[columnLength[i]][i] = 0
        }

    }
    return false
}
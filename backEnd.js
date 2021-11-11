let winningLine = []
export function makeBoard() {
    let temp = []
    for (let i = 0; i < 6; i++) {
        temp[i] = []
        for (let c = 0; c < 7; c++) {
            temp[i][c] = 0;
        }
    }

    return temp
}
export function print(board) {
    let row = ""
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < 7; c++) {
            row += "" + board[r][c] + " "
        }
        console.log(row)
        row = ""
    }
}



export function calculateWin(num, board) {
    return backSlashSearch(num, board) || fowardSlashSearch(num, board) || horizontalSearch(num, board) || verticalSearch(num, board)
}
export function getWinningLine(){
    return winningLine
}
function backSlashSearch(num, board) {
    let topList = []
    let bottomList = []
    for (let r = board.length - 4; r >= 0; r--) {
        for (let c = 0; c < board[0].length - 1 - r; c++) {
            topList.push({row: r+c, col: c})
            bottomList.push({row: c, col: r+c+1})
        }
        if (searchForWinningLine(topList, num, board)){
            return true
        }
        if (searchForWinningLine(bottomList, num, board)){
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
            topList.push({row: r-c, col: c})
            bottomList.push({row: board.length - 1 - r + c, col: board[0].length - 1 - c})

        }
        if (searchForWinningLine(topList, num, board)){
            return true
        }
        if (searchForWinningLine(bottomList, num, board)){
            return true
        }
        topList = []
        bottomList = []
    }
    return false;
}
function searchForWinningLine(list, num, board){
    for (let i = 0; i < list.length - 3; i++) {
        if (getSpot(list[i], board) == num && getSpot(list[i + 1], board) == num && getSpot(list[i + 2], board) == num && getSpot(list[i + 3], board) == num) {
            for (let z=list.length-1;z>i+3;z++){
                list.pop()
            }
            winningLine = list
            return true
        }
        else{
            list.shift()
            i--;
        }
    }
    return false
}
function getSpot(object, board){
    return board[object.row][object.col]
}
function verticalSearch(num, board) {
    for (let c = 0; c < board[0].length; c++) {
        for (let r = 0; r < board.length - 3; r++) {
            if (board[r][c] == num && board[r + 1][c] == num && board[r + 2][c] == num && board[r + 3][c] == num) {
                winningLine = [{row: r, col: c}, {row: r+1, col: c}, {row: r+2, col: c}, {row: r+3, col: c}]
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
                winningLine = [{row: r, col: c}, {row: r, col:c+1}, {row: r, col: c+2}, {row: r, col: c+3}]
                return true
            }
        }
    }
    return false
}
function createObject(r, c){
    return {r, c}
}
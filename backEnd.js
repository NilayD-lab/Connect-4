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

function backSlashSearch(num, board) {
    let topList = []
    let bottomList = []
    for (let r = board.length - 4; r >= 0; r--) {
        for (let c = 0; c < board[0].length - 1 - r; c++) {
            topList.push(board[r + c][c])
            bottomList.push(board[c][r + c + 1])
        }
        for (let i = 0; i < topList.length - 3; i++) {
            if (topList[i] == num && topList[i + 1] == num && topList[i + 2] == num && topList[i + 3] == num) {
                return true
            }
        }
        for (let i = 0; i < bottomList.length - 3; i++) {
            if (bottomList[i] == num && bottomList[i + 1] == num && bottomList[i + 2] == num && bottomList[i + 3] == num) {
                return true
            }
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
            topList.push(board[r - c][c])
            bottomList.push(board[board.length - 1 - r + c][board[0].length - 1 - c])
        }
        for (let i = 0; i < topList.length - 3; i++) {
            if (topList[i] == num && topList[i + 1] == num && topList[i + 2] == num && topList[i + 3] == num) {
                return true
            }
        }
        for (let i = 0; i < bottomList.length - 3; i++) {
            if (bottomList[i] == num && bottomList[i + 1] == num && bottomList[i + 2] == num && bottomList[i + 3] == num) {
                return true
            }
        }
        topList = []
        bottomList = []
    }
    return false;
}

function verticalSearch(num, board) {
    for (let c = 0; c < board[0].length; c++) {
        for (let r = 0; r < board.length - 3; r++) {
            if (board[r][c] == num && board[r + 1][c] == num && board[r + 2][c] == num && board[r + 3][c] == num) {
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
                return true
            }
        }
    }
    return false
}
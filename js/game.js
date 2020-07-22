'use strict'

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';
//const BLOCK;


var gBoard;
var gLevel = { SIZE: 4, MINES: 4 };
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



function initGame() {
    gBoard = buildBoard(gLevel);
    console.log(gBoard);
    renderBoard(gBoard, '.board-container');
}

function renderBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var cellStr;
            // if (cell.isShown) {
            if (cell.isMine) {
                cellStr = MINE;
            }
            else if (cell.minesAroundCount !== 0) {
                cellStr = '' + cell.minesAroundCount;
            }

            else {
                cellStr = EMPTY;
            }

            // }
            var className = 'cell cell-' + i + '-' + j;
            strHTML += '<td class="' + className + '" data-i="' + i + '" data-j="' + j + '" onclick="cellClicked(this)" > <span>' + cellStr + '</span> </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


function buildBoard(gLevel) {
    var board = [];
    // TODO: Create the Matrix height * width 
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            // TODO: create a cell object for each cell
            var cell = { minesAroundCount: 0, isShown: true, isMine: false, isMarked: true, position: { i: i, j: j } };
            board[i][j] = cell;
        }
    }

    setRandomMines(board, gLevel);

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = board[i][j];
            var currPosition = { i: currCell.position.i, j: currCell.position.j };
            currCell.minesAroundCount = setMinesNegsCount(board, currPosition);
        }
    }
    return board;
}



function setMinesNegsCount(board, pos) {
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === pos.i && j === pos.j) continue;
            if (!checkIfInBoard(board, { i: i, j: j })) continue;
            if (board[i][j].isMine) count++;
        }
    }
    return count;
}




function setRandomMines(board, gLevel) {
    var countMines = 0;
    for (var i = 0; i < gLevel.SIZE * 4; i++) {
        var randomI = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var randomJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
        if (board[randomI][randomJ].isMine === false) {
            board[randomI][randomJ].isMine = true;
            countMines++;
        }
        else if (board[randomI][randomJ].isMine === true) {
            continue;
        }
        if (countMines === gLevel.MINES) {
            return;
        }

    }

}


function cellClicked(elCell) {

    console.log(elCell);
    var data = elCell.dataset;
    var i = +data.i;
    var j = +data.j;
    console.log(i, j);
    var clickedCell = gBoard[i][j];
    if (clickedCell.isMarked === true) return
    else {
        clickedCell.isShown = true;
        elCell.classList.add('visible');

    }

}

function cellMarked(elCell) { }

function checkGameOver() { }

function expandShown(board, elCell, i, j) { }



function checkIfInBoard(board, pos) {
    return (pos.i >= 0 && pos.i < board.length &&
        pos.j >= 0 && pos.j < board[pos.i].length);
}




// function renderCell(location, value) {
//     // Select the elCell and set the value
//     var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
//     elCell.innerHTML = value;
//   }
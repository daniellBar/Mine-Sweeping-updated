'use strict'

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';



var gBoard;
var gLevel = { SIZE: 4, MINES: 2 };
var gCellsType = { type1: 'mines', type2: 'others' };
var gGame;
var gTimerInterval;
var gHint = { isHintOn: false, hintCount: 3 }


function setLevel(size, mines) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    initGame();
}


function initGame() {
    handleTimer(false);
    gGame = {
        isOn: true,
        gIsFirstClick: true,
        shownCount: 0,
        markedCount: 0, //number of flags on board
        correctMarkedCount: 0, //number of matches between flags and mines 
        secsPassed: 0
    }
    gBoard = buildBoard(gLevel);
    console.log(gBoard);
    renderBoard(gBoard, '.board-container');
}



function buildBoard(gLevel) {
    var board = [];
    // Create the Matrix height * width  according to SIZE
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            // create a cell object for each cell
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false, position: { i: i, j: j } };
            board[i][j] = cell;
        }
    }


    
    setRandomMines(board, gLevel);
    addNeighbors(board, gLevel);
    // //  place the mines
    // setRandomMines(board, gLevel);

    // // count and add minesAroundCount to a cell
    // for (var i = 0; i < gLevel.SIZE; i++) {
    //     for (var j = 0; j < gLevel.SIZE; j++) {
    //         var currCell = board[i][j];
    //         var currPosition = { i: currCell.position.i, j: currCell.position.j };
    //         currCell.minesAroundCount = setMinesNegsCount(board, currPosition);
    //     }
    // }
    return board;
}

// this function add minesAroundCount to a cell
function addNeighbors(board, gLevel) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = board[i][j];
            var currPosition = { i: currCell.position.i, j: currCell.position.j };
            currCell.minesAroundCount = setMinesNegsCount(board, currPosition);
        }
    }
}

// this function counts the number of mines near a cell
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

function exposeNeighbors(board, pos) {
    var neighborCell;
    var cellStr;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === pos.i && j === pos.j) continue;
            if (!checkIfInBoard(board, { i: i, j: j })) continue;
            neighborCell = board[i][j];
            cellStr = buildCellStr(neighborCell);
            renderCell(neighborCell.position, getCellHTML(cellStr));
        }
    }
}


// this function creates mines on random cells
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



function setHint() {
    if (gHint.hintCount === 0) {
        console.log('no more hints');
        //do html stuff
        return;
    }
    gHint.isHintOn = true;
    gHint.hintCount--;
}



// this function handles left click
function cellClicked(elCell) {
    console.log(gGame.isOn);
    if (gGame.isOn === false) return
    else {
        console.log(elCell);
        if (gGame.gIsFirstClick === true) {
            console.log('lalalalalalalala');
           // setRandomMines(gBoard, gLevel);
            //console.log(gBoard);
            //addNeighbors(gBoard, gLevel);
           // renderBoard(gBoard, '.board-container');
            handleTimer();
            gGame.gIsFirstClick = false;
        }
        var elCellSpan = elCell.querySelector('span');
        console.log(elCellSpan);
        var data = elCell.dataset;
        var i = +data.i;
        var j = +data.j;
        console.log(i, j);
        var clickedCell = gBoard[i][j];
        if (clickedCell.isMarked === true) return
        else {
            clickedCell.isShown = true;
            elCellSpan.classList.remove('hidden');

            if(gHint.isHintOn){
                var currPosition = { i: clickedCell.position.i, j: clickedCell.position.j };
                exposeNeighbors(gBoard, currPosition);
                // setTimeout(function(){ 
                //     renderBoard(gBoard, '.board-container');
                //     gHint.isHintOn=false;
                // }, 1000)
            }
            if (clickedCell.isMine === true) {
                expandShown('mines')
                gameOver();
            } else if (clickedCell.minesAroundCount === 0) {
                expandShown('others');
            }
        }
    }
}



















// this function handles left click
function cellClicked(elCell) {
    console.log(gGame.isOn);
    if (gGame.isOn === false) return
    else {
        console.log(elCell);
        if (gGame.gIsFirstClick === true) {
            console.log('lalalalalalalala');
           // setRandomMines(gBoard, gLevel);
            //console.log(gBoard);
            //addNeighbors(gBoard, gLevel);
           // renderBoard(gBoard, '.board-container');
            handleTimer();
            gGame.gIsFirstClick = false;
        }
        var elCellSpan = elCell.querySelector('span');
        console.log(elCellSpan);
        var data = elCell.dataset;
        var i = +data.i;
        var j = +data.j;
        console.log(i, j);
        var clickedCell = gBoard[i][j];
        if (clickedCell.isMarked === true) return
        else {
            clickedCell.isShown = true;
            elCellSpan.classList.remove('hidden');

            // if(gHint.isHintOn){
            //     var currPosition = { i: clickedCell.position.i, j: clickedCell.position.j };
            //     exposeNeighbors(gBoard, currPosition);
            //     setTimeout(function(){ 
            //         renderBoard(gBoard, '.board-container');
            //         gHint.isHintOn=false;
            //     }, 1000)
            // }
            if (clickedCell.isMine === true) {
                expandShown('mines')
                gameOver();
            } else if (clickedCell.minesAroundCount === 0) {
                expandShown('others');
            }
        }
    }
}


// this function handles right click to mark/unmark flag
function cellMarked(elCell) {
    //disableContextMenu(elCell)

    if (gGame.isOn === false) return
    else {
        if (gGame.gIsFirstClick === true) {
            handleTimer();
            gGame.gIsFirstClick = false;
        }
    }
    var cellStr;
    var data = elCell.dataset;
    var i = +data.i;
    var j = +data.j;
    var clickedCell = gBoard[i][j];
    console.log(clickedCell.isMarked);
    if (clickedCell.isMarked === true) {
        clickedCell.isMarked = false;
        gGame.markedCount--;
        if (checkGameOver()) gameOver();
        console.log('flags on board: ', gGame.markedCount);
        if (clickedCell.isMine === true) {
            gGame.correctMarkedCount--;
            console.log('matches: ', gGame.correctMarkedCount);
        }
        cellStr = buildCellStr(clickedCell);
        renderCell(clickedCell.position, getCellHTML(cellStr));
    }

    else {
        clickedCell.isMarked = true;
        gGame.markedCount++;
        console.log('flags on board: ', gGame.markedCount);
        if (clickedCell.isMine === true) {
            gGame.correctMarkedCount++;
            console.log('matches: ', gGame.correctMarkedCount);
            if (checkGameOver()) gameOver()
        }

        cellStr = FLAG;
        renderCell(clickedCell.position, getCellHTML(cellStr));
        console.log(clickedCell.isMarked);
    }
}


function gameOver() {
    console.log('game over');
    gGame.isOn = false;
    handleTimer();
}

//this function checks if conditions for victory are true
function checkGameOver() {
    return (gGame.markedCount === gLevel.MINES) && (gGame.markedCount === gGame.correctMarkedCount);
}


// this function shows the content of the board
// its parameter decides if to expose mines or other cells
function expandShown(cellsToExpose) {
    var ellCells = document.querySelectorAll('.cell');
    console.log(ellCells);
    for (var ellCell of ellCells) {
        var data = ellCell.dataset;
        var i = +data.i;
        var j = +data.j;
        var cell = gBoard[i][j];
        if (cellsToExpose === gCellsType.type2) {
            if (cell.isMine === false) {
                var ellCellSpan = ellCell.querySelector('span');
                ellCellSpan.classList.remove('hidden');
            }
        }

        else if (cellsToExpose === gCellsType.type1) {
            if (cell.isMine === true) {
                var ellCellSpan = ellCell.querySelector('span');
                ellCellSpan.classList.remove('hidden');
            }
        }
    }
}



function checkIfInBoard(board, pos) {
    return (pos.i >= 0 && pos.i < board.length &&
        pos.j >= 0 && pos.j < board[pos.i].length);
}


'use strict'

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';



var gBoard;
var gLevel = { SIZE: 4, MINES: 2 };
var gCellsType = { type1: 'mines', type2: 'others' };
var gGame;
var gTimerInterval;
var gHint;
var gLives;


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
        secsPassed: 0,
        gIsFirstMarked: false
    };
    gBoard = buildBoard(gLevel);
    console.log(gBoard);
    renderBoard(gBoard, '.board-container');
    setSmiley();
    gHint = { isHintOn: false, hintCount: 3 };
    gLives = { isLivesOn: false, livesCount: 3 };
    resetHints();
    resetLives();
    resetSafeClicks();
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
    var ellNeighborCell;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === pos.i && j === pos.j) continue;
            if (!checkIfInBoard(board, { i: i, j: j })) continue;
            neighborCell = board[i][j];
            if (neighborCell.isShown) continue;
            var cellName = `.cell-${neighborCell.position.i}-${neighborCell.position.j}`;
            ellNeighborCell = document.querySelector(cellName + ' span');
            ellNeighborCell.classList.toggle('hidden');
        }
    }
}


// this function creates mines on random cells
function setRandomMines(board, gLevel, position) {
    var countMines = 0;
    for (var i = 0; i < gLevel.SIZE * 4; i++) {
        var randomI = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var randomJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
        if ((randomI === position.i) && (randomJ === position.j)) continue
        // if(board[randomI][randomJ].isMarked===true) continue
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


//this function returns all hints to be visible. called on init
function resetHints() {
    var ellHints = document.querySelectorAll('.hint');
    console.log(ellHints);
    for (var ellHint of ellHints) {
        ellHint.classList.remove('hidden');
    }
}

function resetLives() {
    var ellLives = document.querySelectorAll('.life');
    console.log(ellLives);
    for (var elllife of ellLives) {
        elllife.classList.remove('hidden');
    }
}

function resetSafeClicks(){
    var ellSafeClicks = document.querySelectorAll('.safe');
    console.log(ellSafeClicks);
    for (var ellSafeClick of ellSafeClicks) {
        ellSafeClick.classList.remove('hidden');
    }
}


//handles hints
function setHint(ellHint) {
    if (gHint.hintCount === 0) {
        alert('no more hints');
        return;
    }
    console.log('hint was clicked');
    gHint.isHintOn = true;
    gHint.hintCount--;
    ellHint.classList.add('hidden');
}

//handles lives
function setLives(ellLives) {
    if (gLives.livesCount === 0) {
        alert('no more hints');
        return;
    }
    console.log('lives was clicked');
    gLives.isLivesOn = true;
    gLives.livesCount--;
    ellLives.classList.add('hidden');
}

//handles safe click  //  half a bug because of the way i understood and implemented full extend.
// i thought all cells that are not mines or empty shoud open.
// safe click will show an empty cell
function safeClick(ellSafe,board=gBoard) {
    for (var i = 0; i < gLevel.SIZE * 4; i++) {
        var randomI = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var randomJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
        if (board[randomI][randomJ].isShown) continue;
        else if (board[randomI][randomJ].isMine) continue;
        else {
            console.log(`cell-${randomI}-${randomJ}`);
            var ellRandomCell = document.querySelector(`.cell-${randomI}-${randomJ}`);
            ellRandomCell.classList.toggle('safeClick');
            setTimeout(function () {
                ellRandomCell.classList.toggle('safeClick');
            }, 2000);
            break;
        }
    }
    ellSafe.classList.add('hidden');
}

// this function handles left click
function cellClicked(elCell) {
    console.log(gGame.isOn);
    if (gGame.isOn === false) return
    else {
        var elCellSpan = elCell.querySelector('span');
        console.log(elCellSpan);
        var data = elCell.dataset;
        var i = +data.i;
        var j = +data.j;
        console.log(i, j);
        var clickedCell = gBoard[i][j];
        var position = clickedCell.position;
        if (clickedCell.isMarked === true) return
        else {
            if ((gGame.gIsFirstClick === true) || (gGame.gIsFirstMarked === true)) {
                // var position = clickedCell.position;
                setRandomMines(gBoard, gLevel, position);
                addNeighbors(gBoard, gLevel);
                renderBoard(gBoard, '.board-container');
                handleTimer();
                gGame.gIsFirstClick = false;
                gGame.gIsFirstMarked = false;
            }

            if (gHint.isHintOn) {
                elCellSpan.classList.remove('hidden');
                exposeNeighbors(gBoard, position);
                setTimeout(function () {
                    exposeNeighbors(gBoard, position);
                    elCellSpan.classList.add('hidden');
                    gHint.isHintOn = false;
                }, 1000);
                return;
            }
            clickedCell.isShown = true;
            elCell.classList.add('revealed');
            elCellSpan.classList.remove('hidden');
            // elCellSpan.classList.add('revealed');

            if (clickedCell.isMine === true) {
                if (gLives.isLivesOn === true) {
                    console.log('you are not dead yet');
                    gLives.isLivesOn = false;
                } else {
                    expandShown('mines');
                    setSmiley('dead');
                    gameOver();
                }
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
            gGame.gIsFirstMarked = true;
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
        if (checkGameOver()) {
            setSmiley('win');
            gameOver();
        }
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
            if (checkGameOver()) {
                setSmiley('win');
                gameOver();
            }
        }

        cellStr = buildCellStr(clickedCell);
        renderCell(clickedCell.position, getCellHTML(cellStr));
        console.log(clickedCell.isMarked);
    }
}

//this function handles smiley
function setSmiley(mode = 'normal') {
    var ellSmiley = document.querySelector('.smiley');
    if (mode === 'normal') ellSmiley.innerHTML = '😀';
    else if (mode === 'dead') ellSmiley.innerHTML = '😞';
    else if (mode === 'win') ellSmiley.innerHTML = '😎';
}

//game over
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
            if (cell.isMine === false && cell.minesAroundCount!==0) {
                cell.isShown = true;
                var ellCellSpan = ellCell.querySelector('span');
                ellCellSpan.classList.remove('hidden');
                // ellCell.classList.add('revealed');
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


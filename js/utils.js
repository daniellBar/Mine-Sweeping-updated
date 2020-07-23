
// this function renders the board
function renderBoard(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
          var cell = mat[i][j];
          var cellStr = buildCellStr(cell);
          var className = 'cell cell-' + i + '-' + j;
          strHTML += '<td class="' + className + '" data-i="' + i + '" data-j="' + j + '" onclick="cellClicked(this)"  oncontextmenu="cellMarked(this)"> <span class="hidden">' + cellStr + '</span> </td>'
      }
      strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}


// this function build string content for innerHTML of each cell
function buildCellStr(cell) {
  var cellStr = '';
  if (cell.isMine) {
      cellStr = MINE;
  }
  else if (cell.minesAroundCount !== 0) {
      cellStr = '' + cell.minesAroundCount;
  }
  else {
      cellStr = EMPTY;
  }
  return cellStr;
}



function getCellHTML(cellStr) {
  if (cellStr === FLAG) {
      return `<span>${cellStr}</span>`;
  } else {
      return `<span class="hidden">${cellStr}</span>`;
  }
}

function renderCell(location, value) {
  // Select the elCell and set the value
  console.log(value);
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// this function shows browser contextMenu at first and then disable it. 
// need to fix this
function disableContextMenu(element) {
  element.oncontextmenu = function () {
      return false;
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//this function shows/unshows the timer
function handleTimer(mode=gGame.isOn) {
  var elTimer = document.querySelector('.timer');
  if (mode) {
      elTimer.style.display = 'block';
      gTimerInterval = setInterval(setTime, 1000);
  }
  else {
      elTimer.style.display = 'none';
      clearInterval(gTimerInterval);
  }
}

function setTime() {
  gGame.secsPassed++;
  var secondsText = pad(gGame.secsPassed % 60);
  var minutesText = pad(parseInt(gGame.secsPassed / 60));
  var eltimer = document.querySelector('.timer h3 span');
  eltimer.innerHTML = minutesText + ':' + secondsText;

}

function pad(val) {
  return val > 9 ? val : "0" + val;
}



function findEmptyCoord(){
	var empties = [];
	for (var i = 1; i < gBoard.length - 1; i++) {
		for (var j = 1; j < gBoard[i].length - 1; j++) {
      var cell = gBoard[i][j];
      console.log(cell);
			if (cell==='') {
        console.log(cell);
				var coord = { i: i, j: j };
				empties.push(coord);
			}
		}
	}
  var chosenCoord = empties[getRandomIntInclusive(0, empties.length-1)];
  console.log(chosenCoord.i);
	return chosenCoord;

}






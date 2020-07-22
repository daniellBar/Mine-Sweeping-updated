

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// function countNgs(board, pos) {
//   var count = 0;
//   for (var i = pos.i-1; i <= pos.i+1; i++) {
//       for (var j = pos.j-1; j <= pos.j+1; j++) {
//           if (i === pos.i && j === pos.j) continue;
//           if (!checkIfInBoard(board, {i:i,j:j})) continue;
//           if (board[i][j] !== EMPTY_CELL) count++;
//       }
//   }
//   return count;
// }

// function buildBoard(height = 4, width = 4) {
// 	var board = [];
// 	// TODO: Create the Matrix height * width 
// 	for (var i = 0; i < height; i++) {
// 		board[i] = [];
// 		for (var j = 0; j < width; j++) {
// 			// TODO: Put FLOOR everywhere and WALL at edges
// 			var cell = { type: FLOOR, gameElement: null };
// 			if (i === 0 || j === 0 || i === height - 1 || j === width - 1) cell.type = WALL;
// 			board[i][j] = cell;
// 		}
// 	}}


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






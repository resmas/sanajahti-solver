fs = require('fs');
lineReader = require('line-reader');

var data = fs.readFileSync('./dictionary', 'utf8');

var DICT = [];

var LETTERS = "<place letters here row by row>";

var grid = [['', '', '', ''],
 			['', '', '', ''],
  			['', '', '', ''],
   			['', '', '', '']];

var DIM = grid.length;

var found = [];

var initGrid = function () {
	for (var i = 0; i < LETTERS.length; i++) {
		grid[Math.floor(i/DIM)][i%DIM] = { letter: LETTERS.charAt(i), visit: false };
	}
};

var availableNeighbours = function (tile, newGrid) {
	var neighbours = [];
	var x = tile.x;
	var y = tile.y;

	for (var i = x-1; i < x+2; i++) {
		for (var j = y-1; j < y+2; j++) {
			if (i >= 0 && j >= 0 && i < DIM && j < DIM && !newGrid[j][i].visit) {
				neighbours.push( {x: i, y: j} );
			}
		}
	}

	return neighbours;
};

var copyGrid = function (grid) {
	var newGrid = [['', '', '', ''],
	 			   ['', '', '', ''],
	  			   ['', '', '', ''],
	   			   ['', '', '', '']];

	for (var i = 0; i < DIM; i++) {
		for (var j = 0; j < DIM; j++) {
			var cell = grid[j][i];
			newGrid[j][i] = {letter: cell.letter, visit: cell.visit};
		}
	}

	return newGrid;
};

var filterWords = function (wordsLeft, str, newPath) {
	var filteredWords = [];

	for (var i = 0; i < wordsLeft.length; i++) {
		var word = wordsLeft[i];
		if (word.substring(0, str.length) === str) {
			if (word.length === str.length) {
				var foundAlready = false;
				for (var j = 0; j < found.length; j++) {
					if (found[j] === word)
						foundAlready = true;
				}
				if (!foundAlready) {
					found.push(word);
				}
			}
			else {
				filteredWords.push(word);
			}
		}
	}

	return filteredWords;
}

var search = function (grid, wordsLeft, str, tile, path) {
	var newGrid = copyGrid(grid);
	newGrid[tile.y][tile.x].visit = true;

	var filteredWords = filterWords(wordsLeft, str);
	if (filteredWords.length === 0) {
		return;
	}

	var neighbours = availableNeighbours(tile, newGrid);

	for (var i = 0; i < neighbours.length; i++) {
		search(newGrid, filteredWords, str + newGrid[neighbours[i].y][neighbours[i].x].letter, neighbours[i]);
	}
};

var clearGrid = function () {
	for (var i = 0; i < DIM; i++) {
		for (var j = 0; j < DIM; j++) {
			grid[j][i].visit = false;
		}
	}
};

var searchFromAllLetters = function () {
	for (var i = 0; i < DIM; i++) {
		for (var j = 0; j < DIM; j++) {
			clearGrid();
			search(grid, DICT, grid[i][j].letter, {x: j, y: i});
		}
	}
}

lineReader.eachLine('dictionary', function(line, last) {
	DICT.push(line);
	if (last) {
		initGrid();
		searchFromAllLetters();
		console.log(found.join(", "));
	}
});
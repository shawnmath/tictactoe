;(function() {
	
	/*-----------------
	Game State
	------------------*/	
	var gameState = {
		player: 1,
		// Track total number of moves by both players
		playerMoves: 0,		
		// data-coord of selected square
		sel_coord: '',		
		// Symbol of selected square (X, O)
		sel_symbol: '',		
		// Class of the parent row selected square is in
		row: '',		
		// Values in same column as selected square
		col_vals: '',		
		// Values in same row as selected square
		row_vals: '',		
		// Values of diagonal squares		
		diag_vals: ''
	}


	/*-----------------
	Player Display
	------------------*/	
	function update_player() {		
		var player = document.querySelector('.player');		
		if( gameState.player === 1 ) {
			gameState.player = 2;
			player.innerHTML = '2'
				
		} else {
			gameState.player = 1;
			player.innerHTML = '1';
		}		
	}
	

	/*-----------------
	Add X's & O's
	-------------------*/
	function addSymbol(square) {
		var x = document.createElement('span');
		x.classList.add('Xsymbol');
		x.innerHTML = 'X';

		var o = document.createElement('span');
		o.classList.add('Osymbol');
		o.innerHTML = 'O';
		
		( gameState.player === 1 ) ? square.appendChild(x) : square.appendChild(o);				
	}


	/*------------------
	Add Symbol to Selected Gameboard Square, Update playerMoves Total
	-------------------*/
	function updateGame() {
		var squares = [...document.querySelectorAll('.square')];	
		squares.map( square => {		
			square.addEventListener('click', function(e) {				
				if( !this.hasChildNodes() ) {
					addSymbol(square);									
					update_player();

					gameState.playerMoves++;
					// Check Game Win Result after 5th player move
					if( gameState.playerMoves > 4 ) {
						checkWin(this);
					}
				}
				else {
					e.preventDefault();				
				}			
			});	
		});
	}	


	/*------------------
	Check for Win
	- check if sequential squares (rows, columns, diagonals) have
	  same symbol as selected square
	-------------------*/
	function checkWin(square) {		
		// Update state object w selected square data coordinate, symbol and parent row
		gameState.sel_coord = square.dataset.coord,
		gameState.sel_symbol = square.querySelector('span').classList.value,		
		gameState.row = square.parentNode.classList;

		// Add class to selected square to query adjacent squares excluding selected square
		// Remove class from previously selected square
		if( document.querySelector('.sel_square') !== null ) {
			document.querySelector('.sel_square').classList.remove('sel_square');
		}
		square.classList.add('sel_square');

		// Populate selected square adjacent square values
		gameState.col_vals = document.querySelectorAll(`[data-coord="${gameState.sel_coord}"]:not(.sel_square)`);		
		gameState.row_vals = document.querySelectorAll(`.${gameState.row} .square:not([data-coord="${gameState.sel_coord}"])`);			
		gameState.diag_vals = getDiagonalVals(square);

		console.log('Diagonal Values from FN:')
		console.log( getDiagonalVals(square) );
		console.log('------------------------');

		console.log(gameState.col_vals);	
		console.log(gameState.row_vals);		
		console.log(gameState.diag_vals);

		// Check adjacent square symbols
		switch(true) {
			case checkAdjacentSquares(gameState.col_vals):
				console.log('YOU WIN BY COLS');
				break;		
			case checkAdjacentSquares(gameState.row_vals):
				console.log('YOU WIN BY ROW');
				break;
			case checkAdjacentSquares(gameState.diag_vals, true):
				console.log('YOU WIN BY DIAGONALS');
				break;
			default:
				console.log('NO WINNER');
				break;		
		}	
	}

	function getDiagonalVals(square) {		
		if( square === document.querySelector('.middle .middle') ) {
			return document.querySelectorAll(`.gameboard > div:not(.${gameState.row}) .square:not([data-coord="${gameState.sel_coord}"])`);
		}

		let 
			middleDiagonal = document.querySelector('.middle .middle'),
			position = square.classList.contains('left') ? 'right' : 'left',
			position_row = gameState.row.value === 'top' ? 'bottom' : 'top';

		let cornerDiagonal = document.querySelector(`.${position_row} .${position}`);

		return [middleDiagonal, cornerDiagonal];					
	}

	/*------------------
	Check Symbol of given row/column/diagonal square DOM list
	-------------------*/
	function checkAdjacentSquares(elem_list, is_diagonal) {
		var is_diagonal = arguments[2] || false;
		let sameSymbol = null;
		// Check if selection is middle square
		let middleSquare = ( gameState.row.value === 'middle' && gameState.sel_coord === '2' ) ? true : false;
		// If middleSquare, keep track of true values for matching sel_symbol
		let trueVals = 0;
		
		for(let i = 0; i < elem_list.length; i++) {
			// If not middle square, only need to check squares that have a symbol, otherwise no win and break loop
			if( elem_list[i].hasChildNodes() && !middleSquare ) {								
				checkSymbol(elem_list[i]);
			} 
			// If middleSquare, loop thru all the diagonal squares, not just the ones that have a child element with a symbol
			else if( middleSquare ) {
				checkSymbol(elem_list[i]);	
			}
			// If no child elements, don't bother checking the rest (if not middle square)
			else {	
				sameSymbol = false;		
				break;
			}
		}

		// Check class of child element
		// declared in parent fn to use closure
		function checkSymbol(elem) {			
			elem.childNodes.forEach(child => {								
				if( child.className === gameState.sel_symbol ) {
					sameSymbol = sameSymbol === false ? false : true;
					if( middleSquare ) {
						trueVals++;					
					}
				}
				else {
					sameSymbol = false;
				}								
			});		

			if( trueVals > 2 ) {
				sameSymbol = true;
			}			
		}

		return sameSymbol;
	}
	

	// Init Game
	return {
		gameStart: updateGame()
	}

})();
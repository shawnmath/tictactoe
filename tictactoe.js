;(function() {
	
	/*-----------------
	Game State
	------------------*/	
	var gameState = {
		player: 1,
		playerMoves: 0		
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

	function checkWin(square) {
		// data-coord of selected square
		let sel_coord = square.dataset.coord;
		// Symbol of selected square (X, O)
		let sel_symbol = square.querySelector('span').classList.value;
		// Class of the parent row selected square is in
		let row = square.parentNode.classList;

		// Add class to selected square to query adjacent squares excluding selected square
		// Remove class from previously selected square
		if( document.querySelector('.sel_square') !== null ) {
			document.querySelector('.sel_square').classList.remove('sel_square');
		}
		square.classList.add('sel_square');

		// Get values in same column as selected square
		let col_vals = document.querySelectorAll(`[data-coord="${sel_coord}"]:not(.sel_square)`);
		// Get values in same row as selected square
		let row_vals = document.querySelectorAll(`.${row} .square:not([data-coord="${sel_coord}"])`);		

		// console.log(row);		
		console.log(col_vals);	
		console.log(row_vals);		

		console.log( 'COL VAL: ', checkSymbol(col_vals, sel_symbol) );
		console.log( 'ROW VAL: ', checkSymbol(row_vals, sel_symbol) );

		if( checkSymbol(col_vals, sel_symbol) === true ) {
			console.log('YOU WIN BY COLS');
			return;
		} 
		else if( checkSymbol(row_vals, sel_symbol) === true ) {
			console.log('YOU WIN BY ROW');
			return;	
		} 
		else {
			console.log('NO WINNER');
		}
	}

	function checkSymbol(elem_list, sel_symbol) {
		let sameSymbol = null;

		for(let i = 0; i < elem_list.length; i++) {
			let el = elem_list[i];
			
			if( el.hasChildNodes() ) {				
				el.childNodes.forEach(child => {
					if( child.className === sel_symbol ) {
						// console.log('TRUE DAT');
						sameSymbol = sameSymbol === false ? false : true;
					} else {
						// console.log('NOPE');
						sameSymbol = false;
					}
				});
			} 
			else {	
				sameSymbol = false;						
				break;
			}
		}

		return sameSymbol;
	}


	// Init Game
	return {
		gameStart: updateGame()
	}

})();
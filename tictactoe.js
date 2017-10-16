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
		x.classList.add('symbol', 'Xsymbol');
		x.innerHTML = 'X';

		var o = document.createElement('span');
		o.classList.add('symbol', 'Osymbol');
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
				if( this.querySelector('.symbol') === null ) {
					addSymbol(square);
					gameState.playerMoves++;				
					update_player();
				}
				else {
					e.preventDefault();				
				}			
			});	
		});
	}

	// Init Game
	return {
		gameStart: updateGame()
	}

})();
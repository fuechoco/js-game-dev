// console.log("Hello World");

// declare our variables for our 2d array, score, rows, columns.
let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// create a function to set the game
// start of setGame()
function setGame(){
	// initialize 4x4 gameboard with all tiles set to 0
	board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

	// create gameboard on the html document
	// 0 < 4 (Y)
	// 1 < 4 (Y)
	// 2 < 4 (Y)
	// 3 < 4 (Y)
	// 4 < 4 (N)

	// first loop to create rows, second loop to create columns
	// inner loop will be executed first before outer loop
	for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){
			// console.log(`[r${r}-c${c}]`);

			// create div elements representing a tile
			let tile= document.createElement("div");

			// set a unique id for each tile based on its coordinate
			// 2-3
			// "+" is used to concatenate values if dealing with String.
			tile.id = r.toString() + "-" + c.toString();
			// get the number from the board
			// wherein the board is currently set to 0
			let num = board[r][c];

			// update the tiles appearance based on the value
			updateTile(tile, num);

			// place the tile inside the board, in the right row and column
			document.getElementById("board").append(tile);
		}
	}
	// random tile
	setTwo();
	setTwo();
}

// function should be invoke to execute code
// setGame();
// end of setGame()


// start of updateTile()
function updateTile(tile, num){
	// clear the tile text
	tile.innerText = "";

	// clear the classlist to avoid multiple classes
	tile.classList.value = "";

	// add class named "tile" to the classlist of the tile for the styling
	tile.classList.add("tile");

	// to check if the current num is not 0
	if(num > 0){
		// set the tiles text to the number based o the num value
		tile.innerText = num.toString();

		// ex: num = 128, the class "x128" will be added to the tile.
		// 8192 <= 4096
		if(num<=4096){
			tile.classList.add("x"+num.toString());
		}
		else{
			// if number is greater than 4096, a special class "x8192" will be added.
			tile.classList.add("x8192");
		}
	}

}
// end of updateTile()


// start window.onload
// event that trigger when webpage finishes loading
window.onload = function(){
	setGame();
}
// end of window.onLoad


// start of handleSLide()
// "e" represents the event object which contains information about the event occured
function handleSlide(e){
	// check the keydown event.
	console.log(e.code);

	// check if the pressed keys code is one of the arrow keys
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		e.preventDefault();

		// (=) assignment operator (to assign/change value of a variable), (==) operator to compare if value from left to right are equal
		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}
		else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}
		else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}

		document.getElementById("score").innerText = score;

		setTimeout(()=>{
		if(hasLost()){
			alert("git gud");
			// reset the game to start over
			restartGame();
			alert("try again uwu");
		}
		checkWin();

	}, 100); //delay time in milliseconds

	}
}
// When any key is pressed, the handleSlide() is called to handle the key press
document.addEventListener("keydown", handleSlide);
// end of handleSlide()

// start of filterZero(tiles)
// removing empty tiles
function filterZero(tiles){
	// create new array by removing zeroes
	return tiles.filter(num => num != 0);
}
// end of filterZero(tiles)


// start of slide(tiles)
// function for sliding and merging tiles
function slide(tiles){
	// [0,2,2,2] --> [2,2,2]
	tiles = filterZero(tiles);

	for(let i = 0; i < tiles.length; i++){

		// if 2 adjacent numbers are equal
		// [2,2,2] --> [0,1,2]
		// tiles[0] == tiles[0+1]
		// 2 == 2
		if(tiles[i] == tiles[i+1]){
			// merge by doubling the first one
			tiles[i] *=2;
			// set the second to zero
			tiles[i+1] = 0;
			// result: [2,2,2] --> [4,0,2]
			// score = score + tiles[i]
			// shorthand version
			score += tiles[i];
		}
	}
	// [4,0,2] --> [4,2]
	tiles = filterZero(tiles);

	// add zeroes back
	while(tiles.length < 4){
		// add zeroes on the end of the array
		tiles.push(0);
		// [4,2,0,0]
	}

	// [4,2,0,0]
	return tiles;
}

// end of slide(tiles)


// start of slideLeft()
function slideLeft(){
	for(let r=0; r<rows; r++){

		// store current row in the row variable
		let row = board[r]; // 0:{0,2,2,2}

		// line for animation
		// copy content of original row
		let originalRow= row.slice();

		// slide() function returns a new value for a specific row
		row = slide(row);

		// updated value of the board
		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // line for animation
            // if current tile is != to original tile, apply the animation
            if(originalRow[c] !== num && num !== 0){
            	// specify the animation style and duration
            	tile.style.animation = "slide-from-right 0.3s";

            	// remove the animation after it finishes
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 300);
            }

            updateTile(tile, num);
		}
	}
}
// start of slideRight()
function slideRight(){
	for(let r=0; r<rows; r++){

		// store current row in the row variable
		let row = board[r]; // 0:{0,2,2,2}

		// original row for animation
		let originalRow = row.slice();

		// reverse the row array since it is sliding to right
		// r = [0,2,2,2] --> [2,2,2,0]
		row.reverse();

		// slide() function returns a new value for a specific row. (merging of tiles)
		row = slide(row);

		row.reverse();

		// updated value of the board
		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // line for animation
            // if current tile is != to original tile, apply the animation
            if(originalRow[c] !== num && num !== 0){
            	// specify the animation style and duration
            	tile.style.animation = "slide-from-left 0.3s";

            	// remove the animation after it finishes
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 300);

            }
            updateTile(tile, num);
		}
	}
}
// end of slideRight()


// start of slideUp()
function slideUp(){
	for(let c=0; c<columns; c++){

		// create a temporary array col that represents the column
		let col =[board[0][c], board[1][c], board[2][c], board[3][c]];

		// original copy for animation
		let originalCol = col.slice();

		col = slide(col);



		for(let r=0; r<rows; r++){
			// set the values of board array back to the values of the modified column
			board[r][c] = col[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // if statement for animation
            if(originalCol[r] !== num && num !== 0){
            	tile.style.animation = "slide-from-bottom 0.3s";
            	setTimeout(() =>{
            		tile.style.animation = "";
            	}, 300);
            }

            updateTile(tile, num);
		}
	}
}
// end of slideUp()


// start of slideDown()
function slideDown(){
	for(let c=0; c<columns; c++){

		// create a temporary array col that represents the column
		let col =[board[0][c], board[1][c], board[2][c], board[3][c]];

		// copy original row for animation
		let originalCol = col.slice();

		col.reverse();
		col = slide(col);
		col.reverse();

		for(let r=0; r<rows; r++){
			// set the values of board array back to the values of the modified column
			board[r][c] = col[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(originalCol[r] !== num && num !== 0){
            	tile.style.animation = "slide-from-top 0.3s";
            	setTimeout(() =>{
            		tile.style.animation = "";
            	}, 300);
	        }
            updateTile(tile, num);
		}
	}
}
// end of slideDown()

// start of hasEmptyTile



// check whether gameboard contains empty space ()
// return a boolean value (true or false)
function hasEmptyTile(){
	for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){
			// check if current tile is == 0, if yes it returns true
			if(board[r][c] == 0){
				return true;
			}

		}
	}

	// no tile == 0
	return false;
}

// end of hasEmptyTile


// start of setTwo()

// add a new random "2" tile in the board
function setTwo(){
	// check if hasEmptyTile is false.
	// ! - if opposite of boolean
	if(!hasEmptyTile()){
		return;
	}

	// declare a value found tile
	let found = false;

	// will run until random empty tile is found
	while(!found){

		// Math.random()- generates number based on the given condition
		// Math.floor()- rounds down to the nearest integer
		// To get a random value for r and c from 1 - 4.
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){
			board[r][c] = 2;
			let tile = document.getElementById(r.toString()+"-"+ c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");

			// set the found variable to tre
			found = true;
		}

	}

}

// end of setTwo()

// start of checkWin()
function checkWin(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			// check if the current tile is a winning tile
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("Panalo ka");
				is2048Exist = true; //once 2048 exists  the alert will only pop up once
			}
			else if(board[r][c] == 4096 && is4096Exist == false){
				alert("Kanina ka pa panalo bitch");
				is4096 = true;
			}
			else if(board[r][c] == 8192 && is8192Exist == false){
				alert("I hope you're happy for wasting my time");
				is8192Exist = true;
			}
		}
	}
}

// end of checkWin()


// start of hasLost()
function hasLost(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			// found an empty tile, user has not lost
			if(board[r][c] == 0){
				return false;
			}

			const currentTile = board[r][c];

			// check if adjacent cells have possible merges
			if(
				r > 0 && board[r-1][c] === currentTile || 
				r < rows - 1 && board [r+1][c] === currentTile ||
				c > 0 && board[c-1] === currentTile ||
				c < columns - 1 && board[r][c+1] === currentTile

				){
					// found adjacent cells with same value, user has not lost
					return false;
			}
		}
	}

	// No possible moves or empty tiles, user has lost
	return true;
}

// end of hasLost()

// restartGame()
function restartGame(){
	board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

	setTwo(); //new tile
	score = 0;
}

// end of restartGame()

// for mobile devices

// declare variable for touch input
let startX = 0;
let startY = 0;

// event listener to capture touch in the screen and assign the x and y coordinates in the startX and startY variables

document.addEventListener("touchstart", (e) =>{
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
})

// event listener to check where you touch the screen and prevents scrolling. input targets any element that includes the word tile
document.addEventListener("touchmove", (e) =>{
	if(!e.target.className.includes("tile")){
		return;
	}

	e.preventDefault(); //disables scrolling
}, {passive: false});

// listen for the touchend event on the entire document
document.addEventListener("touchend", (e) =>{
	if(!e.target.className.includes("tile")){
		return;
	}

	// calculate the difference between the initial and the final touch
	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	console.log(startX);
	console.log(startY);

	// check if swipe is horizontal or vertical
	// horizontal > vertical
	if(Math.abs(diffX) > Math.abs(diffY)){
		// horizontal swipe
		if(diffX > 0){
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	else{
		// vertical swipe
		if(diffY > 0){
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;
	setTimeout(()=>{
		if(hasLost()){
			alert("git gud");
			// reset the game to start over
			restartGame();
			alert("try again uwu");
		}
		checkWin();

	}, 100); //delay time in milliseconds
})

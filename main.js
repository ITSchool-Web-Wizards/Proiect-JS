const cardList = ["cut", "attribution", "home", "favorite", "grade", "bolt", "key", "token", "balance", "wb_sunny", "sports_baseball", "sports_tennis", "sports_bar", "motorcycle", "bomb", "chess", "cloud", "dark_mode", "local_fire_department", "flight", "public", "spa", "attach_money", "savings", "domino_mask", "music_note", "mic", "face_3", "joystick", "visibility"];
const board = document.querySelector(".game-board");
const form = document.getElementById("form");
const difficulties = document.querySelectorAll("input[name='difficulty']");
const timer = document.getElementById("timer");
const refresh = document.getElementById("refresh");
const replay = document.getElementById("replay");
const modal = document.querySelector(".modal");
let moveCount = 0;
let selectedCards = [];
let cardMatch, NumberOfCards, difficulty, sec, moves, correctMoves, setTimer;

//-----SHUFFLE FUNCTION
function shuffleCards(list) {
    for (let i = 0; i < list.length; i += 1) {
        let j = Math.floor(Math.random() * list.length);

        let temp = list[i];
        list[i] = list[j];
        list[j] = temp;
    }
}


function populate(num) {
	cardMatch = [];
	moveCount = 0;
	board.innerHTML = "";
	//shuffle (cardList) and take half the number of cards based on difficulty to get a random icons every game
	shuffleCards(cardList);
	let cards = cardList.slice(0, num/2);
	//duplicate the array values to make pairs and shuffle the new array to get random order of cards
	cards = cards.concat(cards);
	shuffleCards(cards);
	//populate HTML
	const fragment = document.createDocumentFragment();
	for (let x = 0; x < num; x += 1) {
		const cardContainer = document.createElement("div");
		cardContainer.classList.add("card-container", difficulty);
		const front = document.createElement("div");
		const back = document.createElement("div");
		front.classList.add("card", "front");
		back.classList.add("card", "back");
		const icon = document.createElement("span");
		icon.classList.add("icon", "material-symbols-outlined");
		icon.setAttribute("name", cards[x]);
		icon.innerText = cards[x];
		back.appendChild(icon);
		cardContainer.appendChild(front);
		cardContainer.appendChild(back);
		fragment.appendChild(cardContainer);
	}
	board.appendChild(fragment);
}


//-----CHOOSE DIFFICULTY
function chooseDifficulty(){
	[].forEach.call(difficulties, function(input){
		input.nextElementSibling.classList.remove("checked");
		console.log(input.nextElementSibling)
		if (input.checked) {
			switch(input.value) {
				case "easy":
					NumberOfCards = 12;
					input.nextElementSibling.classList.add("checked");
					board.classList.remove("normal-game", "hard-game");
					board.classList.add("easy-game");
					break;
				case "normal":
					NumberOfCards = 24;
					input.nextElementSibling.classList.add("checked");
					board.classList.remove("easy-game", "hard-game");
					board.classList.add("normal-game");
					break;
				case "hard":
					NumberOfCards = 36;
					input.nextElementSibling.classList.add("checked");
					board.classList.remove("easy-game", "normal-game");
					board.classList.add("hard-game");
					break;
				}
				difficulty = input.value;
			}});
		}

function stopwatch(){
	sec += 1;
	if (sec<10) {
		const minutes = Math.floor(sec/60);
		const seconds = sec % 60;
		timer.innerText = "00:0"+sec;
	}
	else if (sec<60) {
		timer.innerText = "00:"+sec;
	}
	else if (sec<3600) {
		timer.innerText = minutes+":"+seconds;
	}
}

// -----CHECK WIN AND DISPLAY MODAL
function checkwin(num) {
	let won;
	switch (difficulty) {
		case "easy" :
			if (num === 6) {
				won = true;
			};
			break;
		case "normal" :
			if (num === 12) {
				won = true;	
			};
			break;
		case "hard" :
			if (num === 18){
				won = true;
			};
			break;
	};
	if (won === true) {
		setTimeout(() => {
			//fill and show modal
			document.getElementById("final-time").innerText = timer.innerText;
			document.getElementById("final-moves").innerText = moves;
			modal.classList.remove("hide");
			//stop the stopwatch
			clearInterval(setTimer);
		}, 500);
	}
}


//-----CORE OF THE GAME - CHECKING CARDS AND COUNTING MOVES
function matchChecker(event){
	//making sure the clicked target is a card and prevent doubleclicking
	if (event.target.classList.contains("card") && !event.target.classList.contains("front-open")) {
		//flip the card on click
		event.target.classList.add("front-open");
		event.target.nextElementSibling.classList.add("back-open");
		//keep track of the attribute name (card name) of the clicked cards
		cardMatch.push(event.target.nextElementSibling.firstChild.getAttribute("name"));
		selectedCards.push(event.target);
		moveCount += 1;
		//allow only two cards to be selected, then verify if they match match
		if (moveCount === 2) {
			moveCount = 0;
			//2 clicks make move count go up by 1
			moves += 1;
			document.getElementById("moves").innerHTML = moves;
			//stop from clicking cards for 1 second while the 2 already clicked cards are checked
			board.removeEventListener("click", matchChecker);
			setTimeout(() => {
				board.addEventListener("click", matchChecker);
			}, 1000);
			if (cardMatch[0]===cardMatch[1]) {
				console.log("match");
				correctMoves += 1;
				//check if game is won
				checkwin(correctMoves);
				cardMatch = [];
				//keep the matched cards up byadding a class to them
				[].forEach.call(selectedCards, correct => {
					correct.classList.add("front-correct");
					correct.nextElementSibling.classList.add("back-correct");	
				});
			} else {
				console.log("not match");
				//wait before turning the cards that don"t match
				setTimeout(() => {
					cardMatch = [];
					[].forEach.call(selectedCards, c =>{
						c.classList.remove("front-open");
						c.nextElementSibling.classList.remove("back-open");
						selectedCards = [];
					});
				}, 750);
			}
		}
	}
}

// -----START GAME
function startGame() {
	//reset everything
	sec = 0; 
	moves = 0;
	correctMoves = 0;
	timer.innerText = "00:00";
	document.getElementById("moves").innerHTML = "0";
	modal.classList.add("hide");
	clearInterval(setTimer);
	//restart game
	chooseDifficulty();
	populate(NumberOfCards);
	//start the timer on first click
	board.addEventListener("click", function start() {
		clearInterval(setTimer);
		setTimer = setInterval(stopwatch, 1000);
		board.removeEventListener("click", start)
	});
}

refresh.addEventListener("click", startGame);
replay.addEventListener("click", startGame);
form.addEventListener("change", startGame);
window.addEventListener("click", (ev) => {
	if (ev.target === modal) {
		startGame();
	}
});
board.addEventListener("click", matchChecker);
window.addEventListener("load", startGame);
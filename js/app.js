/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Variables declared bellow are global and will be reassigned later inside functions
let cnt = 0, sec = 0, min = 0;
let i = 0, r = 0, w = 0;
let intervalObj;
let clickedCard;
let compareList = [];
let deckOfCards;
let cardsToShuffle = [];
let shuffledCards;
let finalStars;
let playerRecord = {
	name: 0,
	stars: 0,
	moves: 0,
	missed: 0,
	time: 0,
	date: 0
};
let rankPlayer;
let objectPlayer;

// Start Timer and display running timer at the score panel
function startTimer() {
	intervalObj = setInterval(function(){
		// cnt counts elapsed seconds and it is transformed to minutes and seconds
		cnt = cnt + 1;
		min = Math.floor(cnt / 60);
		sec = cnt - (min * 60);
		min = min.toString();
		sec = sec.toString();
		// Add leading zeros to minutes and seconds from 0 to 9
		if (min.length < 2) {
			min = "0" + min;
		}
		if (sec.length < 2) {
			sec = "0" + sec;
		}
		document.getElementById('timer').textContent = min + ":" + sec;
	}, 1000);
	// Call function to remove the banner and start the game
	startGame();
}

function startGame() {
	// Shuffle Cards before game starts
	deckOfCards = document.getElementsByClassName('card');
	for (let i = 0; i < 16; i++) {
		cardsToShuffle.push(deckOfCards[i].firstElementChild.getAttribute('class'));
	}
	// Shuffle function provided by Udacity
	shuffledCards = shuffle(cardsToShuffle);
	for (let i = 0; i < 16; i++) {
		deckOfCards[i].firstElementChild.setAttribute('class', shuffledCards[i]);
	}
	// End of shuffle commands
	// Remove the Click to Start banner
	startClick.remove();
	// Call function to turn cards when clicked
	cardClick.addEventListener('click', turnCards);
}

// turnCards receives the clicked HTML element and turn that specific card
function turnCards(elem) {
	clickedCard = elem.target;
	// The following if statement certifies that the card is closed before turning it
	if (clickedCard.getAttribute('class') === 'card') {
		clickedCard.setAttribute('class', 'card open show');
		// Next function will compare opened cards
		compareCards();
	}
}

// Compare and animate cards
function compareCards() {
	// Add opened cards to an array
	compareList.push(clickedCard.firstElementChild);
		// Add animation to turn the first card horizontally
		clickedCard.animate([
			{transform: 'scaleX(0)'},
			{transform: 'scaleX(1)'}
			],
			200
		);
		// End of turning cards animation
	// Global variable i, tracks opened cards and simultaneously number of moves
	i = compareList.length;
	// Compare after each two cards are opened
	if (i % 2 === 0) {
		// If cards are the same that is a match
		if (compareList[i - 1].getAttribute('class') === compareList[i - 2].getAttribute('class')) {
			compareList[i - 2].parentElement.setAttribute('class', 'card match');
			compareList[i - 1].parentElement.setAttribute('class', 'card match');
			// Add animation to turn the second card horizontally
			compareList[i - 1].parentElement.animate([
				{transform: 'scaleX(0)'},
				{transform: 'scaleX(1)'}
				],
				200
			);
			// End of turning cards animation
			setTimeout(function() {
				// Add animation to emphasize matched cards
				compareList[i - 2].parentElement.animate([
					{transform: 'scale(1.3, 1.3)'},
					{transform: 'scale(1, 1)'}
					],
					300
				);
				// Here I need to add animation to both cards
				compareList[i - 1].parentElement.animate([
					{transform: 'scale(1.3, 1.3)'},
					{transform: 'scale(1, 1)'}
					],
					300
				);
				// End of matching cards animation
			}, 200);
			// Increase the correct cards counter
			r = r + 1;
		}
		else {
			// If cards are not equal that is a missmatch
			compareList[i - 2].parentElement.setAttribute('class', 'card miss');
			compareList[i - 1].parentElement.setAttribute('class', 'card miss');
			// Add animation to turn the second card horizontally
			compareList[i - 1].parentElement.animate([
				{transform: 'scaleX(0)'},
				{transform: 'scaleX(1)'}
				],
				200
			);
			// End of turning cards animation
			cardClick.removeEventListener('click', turnCards);
			setTimeout(function() {
				// Add animation to emphasize mismatched cards
				compareList[i - 2].parentElement.animate([
					{transform: 'translateX(20%)'},
					{transform: 'translateX(-20%)'},
					{transform: 'translateX(0)'}
					],
					300
				);
				// Here I also have to add the animation to both cards
				compareList[i - 1].parentElement.animate([
					{transform: 'translateX(20%)'},
					{transform: 'translateX(-20%)'},
					{transform: 'translateX(0)'}
					],
					300
				);
				// End of mismatching cards animation
			}, 200);
			// This function sets a delay for cards being closed, otherwise you can't see which card was opened
			setTimeout(function() {
				compareList[i - 2].parentElement.setAttribute('class', 'card');
				compareList[i - 1].parentElement.setAttribute('class', 'card');
				cardClick.addEventListener('click', turnCards);
				// Add animation to turn the cards back to the table
				compareList[i - 2].parentElement.animate([
					{transform: 'scaleX(0)'},
					{transform: 'scaleX(1)'}
					],
					300
				);
				compareList[i - 1].parentElement.animate([
					{transform: 'scaleX(0)'},
					{transform: 'scaleX(1)'}
					],
					300
				);
				// End of turning cards animation
			}, 800);
			// This 800ms was increased from 500ms, to allow a 300ms animation pause, after the mismatched card animation
			// Increase incorrect cards counter
			w = w + 1;
		}
	}
	// Now we will update score panel move counter
	moveCounter();
}

// Update move counter
function moveCounter() {
	if (i === 1) {
		document.querySelector('.moves').textContent = i + " " + "Move";
	}
	// This else adds the "s" to the end of the word Move
	else {
		document.querySelector('.moves').textContent = i + " " + "Moves";
	}
	// After move counter is updated we need to update the star rating
	starGrader();
}

// Calculate and update player star rating
function starGrader() {
	// 5 Stars: 0 to 4 mistakes bellow 30 seconds
	if ((w >= 0) && (w <= 4) && (cnt < 30)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars gold');
		document.querySelector('.congrat-message').textContent = '"Astonishing!"';
	}
	// 4 Stars: 5 to 8 mistakes bellow 45 seconds
	else if ((w >= 0) && (w <= 8) && (cnt < 45)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars silver');
		document.querySelector('.congrat-message').textContent = '"Great!"';
	}
	// 3 Stars: 9 to 16 mistakes bellow 60 seconds
	else if ((w >= 0) && (w <= 16) && (cnt < 60)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars bronze');
		document.querySelector('.congrat-message').textContent = '"Good!"';
	}
	// 2 Stars: 17 to 32 mistakes bellow 1minute and 30 seconds
	else if ((w >= 0) && (w <= 32) && (cnt < 120)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars orange');
		document.querySelector('.congrat-message').textContent = '"You can do better"';
	}
	// 1 Star: more than 32 mistakes above 1 minute and 30 seconds
	else if ((w > 32) || (cnt >= 120)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars red');
		document.querySelector('.congrat-message').textContent = '"You definitely should try again..."';
	}
	// If all cards are matched, the game ends after updating score panel
	if (r === 8) {
		endGame();
	}
}

// End game and calls Congratulations Modal
function endGame() {
	// Stop timer
	clearInterval(intervalObj);
	// Show modal
	$('#congratulations').modal('show');
}

// Show modal and updates game statistics
$('#congratulations').on('show.bs.modal', function (e) {
	finalStars = $('.stars').html();
	$('.congrat-stars').html(finalStars);
	$('.congrat-moves').text(i + " " + "Moves");
	$('.congrat-errors').text(w + " " + "Missed");
	finalTime = min + ":" + sec;
	$('.congrat-timer').text(finalTime);
});

// Save current game data to local storage
function saveStorage() {
	saveButton.setAttribute('class', 'btn btn-primary saved');
	saveButton.textContent = 'Saved!';
	// Update playerRecord object with current game stats
	playerRecord.name = document.querySelector('.name-input').value;
	playerRecord.stars = finalStars;
	playerRecord.moves = i;
	playerRecord.missed = w;
	// Save time as elapsed seconds ir order to be compared between two players
	playerRecord.time = cnt;
	playerRecord.date = new Date().valueOf();
	// Turn playerRecord object into a string
	playerString = JSON.stringify(playerRecord);
	// Player data saved to local storage. Lower score ranks first, date is used as tiebreaker
	let score = (w * 10) + cnt;
	(score < 100) ? score = '0' + score : score;
	score = score + '-' + playerRecord.date;
	localStorage.setItem(score, playerString);
	saveButton.setAttribute('disabled', true);
}

// Creates and displays the Leaderboard using local storage data
function showLeaderboard() {
	$('h1').text('Leaderboard');
	// Remove game deck and score panel
	$('.score-panel').remove();
	$('.deck').remove();
	// Insert restart game option
	$('div.container').after('<section class="container rank-panel"></section>');
	$('.rank-panel').append('<div class="row"></div>');
	$('div.row').append('<p class="restart">Restart Game</p>');
	$('div.row').append('<button onclick="location.reload(true)" class="restart-button"></button>');
	$('.restart-button').append('<span class="fa fa-repeat"></span>');
	// Insert Leaderboard
	$('.rank-panel').after('<table class="leaderboard"></table>');
	$('.leaderboard').append('<thead class="rank-head"></thead>');
	$('.rank-head').append('<tr></tr>');
	// Leaderboard table heading
	$('.rank-head:first-child').append('<th>Rank</th>');
	$('.rank-head:first-child').append('<th>Player</th>');
	$('.rank-head:first-child').append('<th>Stars</th>');
	$('.rank-head:first-child').append('<th>Moves</th>');
	$('.rank-head:first-child').append('<th>Missed</th>');
	$('.rank-head:first-child').append('<th>Time</th>');
	$('.rank-head:first-child').append('<th>Date</th>');
	// Leaderboard table body
	$('.leaderboard').append('<tbody class="rank-body"></tbody>');
	for (let i = 0; i < localStorage.length; ++i) {
		let j = i + 1;
		rankPlayer = localStorage.getItem(localStorage.key(i));
		objectPlayer = JSON.parse(rankPlayer);
		// Build the date in a readable format
		let playerDate = new Date(objectPlayer.date);
		let dd = playerDate.getDate();
		(dd < 10) ? dd = '0' + dd : dd;
		let mm = playerDate.getMonth() + 1;
		(mm < 10) ? mm = '0' + mm : mm;
		let yyyy = playerDate.getFullYear();
		let hh = playerDate.getHours();
		(hh < 10) ? hh = '0' + hh : hh;
		let mn = playerDate.getMinutes();
		(mn < 10) ? mn = '0' + mn : mn;
		let sc = playerDate.getSeconds();
		(sc < 10) ? sc = '0' + sc : sc;
		let formatDate = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + mn + ':' + sc;
		// Print every player info from the local storage to the Leaderboard
		$('.rank-body').append('<tr></tr>');
		$('.rank-body tr:last-child').append('<td>' + j + '</td>');
		$('.rank-body tr:last-child').append('<td>' + objectPlayer.name + '</td>');
		$('.rank-body tr:last-child').append('<td class="rank-stars"><ul class="stars">' + objectPlayer.stars + '</ul></td>');
		$('.rank-body tr:last-child').append('<td>' + objectPlayer.moves + '</td>');
		$('.rank-body tr:last-child').append('<td>' + objectPlayer.missed + '</td>');
		$('.rank-body tr:last-child').append('<td>' + objectPlayer.time + 's' + '</td>');
		$('.rank-body tr:last-child').append('<td>' + formatDate  + '</td>');
		// Highlight current player
		if (objectPlayer.date === playerRecord.date) {
			$('.rank-body tr:last-child td').addClass('player');
		}
	}
}

// Constants declared bellow are global
const startClick = document.getElementById('start');
const cardClick = document.querySelector('.deck');
const saveButton = document.getElementById('save-record');
const viewLeaderboard = document.getElementById('view-leaderboard');

// Start the game after the banner is clicked
startClick.addEventListener('click', startTimer);
// Save player name to the Leaderboard
saveButton.addEventListener('click', saveStorage);
// Open Leaderboard through Congratulations Modal
viewLeaderboard.addEventListener('click', showLeaderboard)


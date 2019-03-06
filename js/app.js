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

let cnt = 0, sec = 0, min = 0;
let i = 0, r = 0, w = 0;
let intervalObj;
let clickedCard;
let compareList = [];
let finalStars;
function startTimer() {
	intervalObj = setInterval(function(){
		cnt = cnt + 1;
		min = Math.floor(cnt / 60);
		sec = cnt - (min * 60);
		min = min.toString();
		sec = sec.toString();
		if (min.length < 2) {
			min = "0" + min;
		}
		if (sec.length < 2) {
			sec = "0" + sec;
		}
		document.getElementById('timer').textContent = min + ":" + sec;
	}, 1000);
	startGame();
}

function startGame() {
	startClick.remove();
	cardClick.addEventListener('click', turnCards);
}

function turnCards(elem) {
	clickedCard = elem.target;
	if (clickedCard.getAttribute('class') === 'card') {
		clickedCard.setAttribute('class', 'card open show');
		compareCards();
	}
}

function compareCards() {
	compareList.push(clickedCard.firstElementChild);
	i = compareList.length;
	if (i % 2 === 0) {
		if (compareList[i - 1].getAttribute('class') === compareList[i - 2].getAttribute('class')) {
			compareList[i - 2].parentElement.setAttribute('class', 'card match');
			compareList[i - 1].parentElement.setAttribute('class', 'card match');
			r = r + 1;
		}
		else {
			setTimeout(function(){
				compareList[i - 2].parentElement.setAttribute('class', 'card');
				compareList[i - 1].parentElement.setAttribute('class', 'card');
			}, 300);
			w = w + 1;
		}
	}
	moveCounter();
}

function moveCounter() {
	if (i === 1) {
		document.querySelector('.moves').textContent = i + " " + "Move";
	}
	else {
		document.querySelector('.moves').textContent = i + " " + "Moves";
	}
	starGrader();
}

function starGrader() {
	if ((w >= 0) && (w <= 4) && (cnt < 30)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars gold');
		document.querySelector('.congrat-message').textContent = '"Astonishing!"';
	}
	else if ((w >= 0) && (w <= 8) && (cnt < 45)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars silver');
		document.querySelector('.congrat-message').textContent = '"Great!"';
	}
	else if ((w >= 0) && (w <= 16) && (cnt < 60)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars bronze');
		document.querySelector('.congrat-message').textContent = '"Good!"';
	}
	else if ((w >= 0) && (w <= 32) && (cnt < 120)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars orange');
		document.querySelector('.congrat-message').textContent = '"You can do better"';
	}
	else if ((w > 32) || (cnt >= 120)) {
		document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>';
		document.querySelector('.congrat-stars').setAttribute('class', 'congrat-stars red');
		document.querySelector('.congrat-message').textContent = '"You definitely should try again..."';
	}
	if (r === 8) {
		endGame();
	}
}

function endGame() {
	clearInterval(intervalObj);
	$('#congratulations').modal('show');
}

$('#congratulations').on('show.bs.modal', function (e) {
	finalStars = $('.stars').html();
	$('.congrat-stars').html(finalStars);
	$('.congrat-moves').text(i + " " + "Moves");
	$('.congrat-errors').text(w + " " + "Missed");
	$('.congrat-timer').text(min + ":" + sec);
})

const startClick = document.getElementById('start');
const cardClick = document.querySelector('.deck');
startClick.addEventListener('click', startTimer);


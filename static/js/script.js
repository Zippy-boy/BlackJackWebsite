let blackjackGame = {
    'you': { 'scoreSpan': '#your-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-result', 'div': '#dealer-box', 'score': 0 },
    'suites': ['Hearts', 'Diamonds', 'Spades', 'Clubs'],
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/won.mp3');
const loseSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click', blackjackHit);
document.querySelector('#stand').addEventListener('click', dealerLogic);
document.querySelector('#deal').addEventListener('click', blackjackDeal);


function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let ranCard = randomCard();
        let cardPath = ranCard[1];
        let card = ranCard[0];
        showCard(cardPath, YOU);
        updateScore(card, YOU)
        showScore(YOU);
    }
}

function randomCard() {
    let randomSuite = blackjackGame['suites'][Math.floor(Math.random() * 4)];
    let randomCard = blackjackGame['cards'][Math.floor(Math.random() * 13)];
    return [randomCard, randomSuite + '\\' + randomCard + '.png'];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardimage = document.createElement('img');
        cardimage.src = `static/images/${card}`;
        //cardimage.style.height = '120px'; cardimage.style.margin = '5px';
        document.querySelector(activePlayer['div']).appendChild(cardimage);
        hitSound.play();
    }

}

function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {
        let yourImages = document.querySelector('#your-box')
        let dealerImages = document.querySelector('#dealer-box')
        let yourScore = document.querySelector('#your-result')
        let dealerScore = document.querySelector('#dealer-result')
        let result = document.querySelector('#result')

        if (yourImages != null) {
            yourImages = yourImages.querySelectorAll('img');
            for (i = 0; i < yourImages.length; i++) { yourImages[i].remove(); }
        }
        if (dealerImages != null) {
            dealerImages = dealerImages.querySelectorAll('img');
            for (i = 0; i < dealerImages.length; i++) { dealerImages[i].remove(); }
        }

        yourScore.textContent = 0;
        dealerScore.textContent = 0;
        yourScore.style.color = 'white';
        dealerScore.style.color = 'white';
        result.textContent = 'Play';
        result.style.color = 'white';
        YOU['score'] = 0;
        DEALER['score'] = 0;
        blackjackGame['isStand'] = false;
        blackjackGame['turnsOver'] = false;
    }
}

function updateScore(card, activePlayer) {
    if (activePlayer['score'] > 21) { return; } else {
        // If adding 11 keeps me below 21, add 11. Otherwise, add 1.
        if (card === 'A') {
            if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
                activePlayer['score'] += blackjackGame['cardsMap'][card][1];
            } else {
                activePlayer['score'] += blackjackGame['cardsMap'][card][0];
            }
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card];
        }
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = `${activePlayer['score']} Bust`;
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else { document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']; }
}

function dealerLogic() {
    // wait 2 seconds before showing dealer's cards
    if (blackjackGame['turnsOver'] !== true) {
        blackjackGame['isStand'] = true;
        setTimeout(function () {
            let rancard = randomCard();
            let cardPath = rancard[1];
            let card = rancard[0];
            showCard(cardPath, DEALER);
            updateScore(card, DEALER);
            showScore(DEALER);

            if (YOU['score'] > 21) {
                blackjackGame['turnsOver'] = true;
                let winner = computeWinner()
                showResult(winner);
            } else if (DEALER['score'] > YOU['score'] && DEALER['score'] <= 21) {
                blackjackGame['turnsOver'] = true;
                let winner = computeWinner();
                showResult(winner);
            } else if (DEALER['score'] === 21) {
                blackjackGame['turnsOver'] = true;
                let winner = computeWinner();
                showResult(winner);
            } else if (DEALER['score'] > 21) {
                blackjackGame['turnsOver'] = true;
                let winner = computeWinner();
                showResult(winner);
            } else {
                dealerLogic();
            }
        }, 500);
    }

}

function computeWinner() {
    let winner;
    let wins = document.querySelector('#wins')
    let losses = document.querySelector('#losses')
    let draws = document.querySelector('#draws')

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) { winner = YOU; winSound.play(); wins.textContent = parseInt(wins.textContent) + 1; }
        else if (YOU['score'] < DEALER['score']) { winner = DEALER; loseSound.play(); losses.textContent = parseInt(losses.textContent) + 1; }
        else if (YOU['score'] === DEALER['score']) { winner = 'Tie'; draws.textContent = parseInt(draws.textContent) + 1; }
    }
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) { winner = DEALER; losses.textContent = parseInt(losses.textContent) + 1; }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) { winner = 'Tie'; draws.textContent = parseInt(draws.textContent) + 1; }

    return winner;
}

function showResult(winner) {
    let message, messageColor;
    if (winner === YOU) {
        message = 'You Win!';
        messageColor = 'green';
    } else if (winner === DEALER) {
        message = 'Dealer Wins!';
        messageColor = 'red';
    } else {
        message = 'Tie!';
        messageColor = 'white';
    }
    document.querySelector('#result').textContent = message;
    document.querySelector('#result').style.color = messageColor;
}

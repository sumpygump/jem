/**
 * ready
 *
 * Function to call when the DOM is ready
 * Example: ready(() => { do_stuff() });
 */
const ready = (fn) => {
    if (document.readyState != 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
};

function shuffle(array) {
    let i = array.length;
    while (i != 0) {
        let r = Math.floor(Math.random() * i);
        i--;
        [array[i], array[r]] = [array[r], array[i]];
    }
}

const App = {
    cardData: {},
    selectedCard: 0,
    deckCursor: 0,
    deck: [], // Shuffled list of cards
    init: function() {
        this.card = document.querySelector('.card-contain');
        this.drawButton = document.querySelector('.js-draw');

        this.loadCards();

        this.drawButton.addEventListener('click', (e) => {
            this.drawCard(true);
        });

    },
    loadCards: function() {
        console.log("Loading idea cards");
        fetch("ideas.json")
            .then(response => response.json())
            .then(json => {
                this.cardData = json
                console.log(`Loaded ${this.cardData.length} cards`);
                this.onCardsLoaded();
            });
    },
    onCardsLoaded: function() {
        this.shuffleCards();
        if (window.location.hash) {
            targetCardId = window.location.hash.replace('#', '');
            this.findCard(targetCardId);
            this.drawCard();
        }
    },
    shuffleCards: function() {
        this.deck = [];
        this.cardData.forEach((v, i) => {
            this.deck.push(i);
        });
        shuffle(this.deck);
        console.log("Shuffled deck");
    },
    nextCard: function() {
        this.selectedCard = this.deck[this.deckCursor++];
        if (this.deckCursor > this.deck.length - 1) {
            this.shuffleCards();
            this.deckCursor = 0;
        }
    },
    drawCard: function(selectRandom) {
        this.hideCard();
        if (selectRandom) {
            this.nextCard();
        }
        setTimeout(this.showCard.bind(this), 200);
    },
    findCard: function(cardId) {
        this.cardData.forEach((v, i) => {
            if (v.id == cardId) {
                this.selectedCard = i;
            }
        });
    },
    hideCard: function() {
        this.card.classList.add('flipped');
    },
    showCard: function() {
        const cardInfo = this.cardData[this.selectedCard];
        const cardElement = this.card.querySelector('.card_front');
        cardElement.querySelector('.card-id').textContent = `#${cardInfo.id}`;
        cardElement.querySelector('.card-name').textContent = cardInfo.name;
        cardElement.querySelector('.card-body').textContent = cardInfo.description;
        cardElement.querySelector('.card-suggested-module').innerHTML = '';
        const libraryBase = 'https://library.vcvrack.com/';
        if (cardInfo.suggestedModules) {
            cardInfo.suggestedModules.forEach(m => {
                cardElement.querySelector('.card-suggested-module').innerHTML += `<a href="${libraryBase}${m}" target="_blank">${m}</a> `;
            });
        }

        this.card.classList.remove('flipped');
        this.updateHash(cardInfo.id);
    },
    updateHash: function(text) {
        window.location.hash = `#${text}`;
    }
}

ready(() => {
    App.init();
});

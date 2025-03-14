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

const App = {
    cardData: {},
    selectedCard: 0,
    init: function() {
        this.card = document.querySelector('.card-contain');
        this.drawButton = document.querySelector('.js-draw');

        this.loadCards();

        this.drawButton.addEventListener('click', (e) => {
            this.drawCard(true);
        });

    },
    loadCards: function() {
        fetch("ideas.json")
            .then(response => response.json())
            .then(json => {
                this.cardData = json
                this.onCardsLoaded();
            });
    },
    onCardsLoaded: function() {
        if (window.location.hash) {
            targetCardId = window.location.hash.replace('#', '');
            console.log(targetCardId);
            this.findCard(targetCardId);
            this.drawCard();
        }
    },
    drawCard: function(selectRandom) {
        this.hideCard();
        if (selectRandom) {
            this.selectedCard = Math.floor(Math.random() * this.cardData.length);
        }
        setTimeout(this.showCard.bind(this), 500);
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
        cardElement.querySelector('.card-id').textContent = '#' + cardInfo.id;
        cardElement.querySelector('.card-name').textContent = cardInfo.name;
        cardElement.querySelector('.card-body').textContent = cardInfo.description;
        if (cardInfo.suggestedModule) {
            console.log(cardInfo.suggestedModule);
            cardElement.querySelector('.card-suggested-module').innerHTML = `<a href="${cardInfo.suggestedModule}" target="_blank">🔌 Suggested module</a>`;
        } else {
            cardElement.querySelector('.card-suggested-module').innerHTML = "";
        }

        this.card.classList.remove('flipped');
    }
}

ready(() => {
    App.init();
});

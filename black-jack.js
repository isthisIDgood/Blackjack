//Create Deck
const deck = [
    { number: 1, suit: 'Diamonds', value: 11 }, { number: 2, suit: 'Diamonds', value: 2 }, { number: 3, suit: 'Diamonds', value: 3 }, { number: 4, suit: 'Diamonds', value: 4 }, { number: 5, suit: 'Diamonds', value: 5 }, { number: 6, suit: 'Diamonds', value: 6 }, { number: 7, suit: 'Diamonds', value: 7 }, { number: 8, suit: 'Diamonds', value: 8 }, { number: 9, suit: 'Diamonds', value: 9 }, { number: 10, suit: 'Diamonds', value: 10 }, { number: 11, suit: 'Diamonds', value: 10 }, { number: 12, suit: 'Diamonds', value: 10 }, { number: 13, suit: 'Diamonds', value: 10 },      //Diamonds
    { number: 1, suit: 'Spades', value: 11 }, { number: 2, suit: 'Spades', value: 2 }, { number: 3, suit: 'Spades', value: 3 }, { number: 4, suit: 'Spades', value: 4 }, { number: 5, suit: 'Spades', value: 5 }, { number: 6, suit: 'Spades', value: 6 }, { number: 7, suit: 'Spades', value: 7 }, { number: 8, suit: 'Spades', value: 8 }, { number: 9, suit: 'Spades', value: 9 }, { number: 10, suit: 'Spades', value: 10 }, { number: 11, suit: 'Spades', value: 10 }, { number: 12, suit: 'Spades', value: 10 }, { number: 13, suit: 'Spades', value: 10 },                                //Spades
    { number: 1, suit: 'Hearts', value: 11 }, { number: 2, suit: 'Hearts', value: 2 }, { number: 3, suit: 'Hearts', value: 3 }, { number: 4, suit: 'Hearts', value: 4 }, { number: 5, suit: 'Hearts', value: 5 }, { number: 6, suit: 'Hearts', value: 6 }, { number: 7, suit: 'Hearts', value: 7 }, { number: 8, suit: 'Hearts', value: 8 }, { number: 9, suit: 'Hearts', value: 9 }, { number: 10, suit: 'Hearts', value: 10 }, { number: 11, suit: 'Hearts', value: 10 }, { number: 12, suit: 'Hearts', value: 10 }, { number: 13, suit: 'Hearts', value: 10 },                                //Hearts
    { number: 1, suit: 'Clubs', value: 11 }, { number: 2, suit: 'Clubs', value: 2 }, { number: 3, suit: 'Clubs', value: 3 }, { number: 4, suit: 'Clubs', value: 4 }, { number: 5, suit: 'Clubs', value: 5 }, { number: 6, suit: 'Clubs', value: 6 }, { number: 7, suit: 'Clubs', value: 7 }, { number: 8, suit: 'Clubs', value: 8 }, { number: 9, suit: 'Clubs', value: 9 }, { number: 10, suit: 'Clubs', value: 10 }, { number: 11, suit: 'Clubs', value: 10 }, { number: 12, suit: 'Clubs', value: 10 }, { number: 13, suit: 'Clubs', value: 10 }                                              //Clubs
]

//Shuffle Deck
function shuffleDeck() {
    const deckCopy = Array.from(deck, (card) => card)   //uses global scope for deck*
    const shuffledDeck = []
    while (deckCopy.length > 0) {
        let randomCard = Math.floor((Math.random() * ((deckCopy.length - 1) - 0 + 1)) + 0)
        //Add random card to shuffledDeck
        shuffledDeck.push(deckCopy[randomCard])
        //Remove card from deck
        deckCopy.splice(randomCard, 1)
    }
    return shuffledDeck
}

//Messing around with Classes

//To do:
//Flip Ace value when total exceeds 21

//BlackJack Participant 
class Player {
    constructor(deck) {
        this.deck = deck
        this.bet = 0
        this.hand = []
        this.handTotal = 0
        this.payout = 0
        this.isPlaying = true
        this.isStand = false
        this.isDealer = false
    }
    checkStatus() {
        this.handTotal >= 21 || this.isStand ? this.isPlaying = false : this.isPlaying = true
    }
    placeBet(betValue) {
        this.bet = betValue
    }
    stand() {
        this.isStand = true
        this.checkStatus()
    }
    hit() {
        if (this.isPlaying) {
            this.hand.push(this.deck.pop())     //add card to hand from deck
            this.updateHandValue()
            this.checkStatus()
        }
    }
    updateHandValue() {
        this.handTotal = 0                      //always reset total
        for (let card of this.hand) {
            this.handTotal += card.value
        }
        // Check for aces
        if (this.handTotal > 21) {
            for (let card of this.hand) {
                if (card.value === 11) {
                    card.value = 1              //set value to 1 if handTotal > 21
                    this.updateHandValue()
                }
            }
        }
    }
}

//BlackJack Game
class BlackJack {
    constructor(deck, numberOfPlayers) {
        this.deck = deck
        this.numberOfPlayers = numberOfPlayers
        this.dealer = new Player(this.deck)
        this.dealer.isDealer = true
        this.players = []
        this.players.push(this.dealer)  //dealer is always players[0]
    }
    addPlayers() {
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.players.push(new Player(this.deck))
        }
    }
    deal() {
        for (let i = 0; i <= 1; i++) {
            for (let player of this.players) {
                player.hand.push(this.deck.pop())
                player.updateHandValue()
            }
        }
    }
    dealerTurn() {
        while (this.dealer.isPlaying) {
            this.dealer.handTotal <= 16 ? this.dealer.hit() : this.dealer.stand()
        }
    }
    endRound() {
        for (let player of this.players) {
            if (player.handTotal > 21 || (player.handTotal < this.dealer.handTotal && this.dealer.handTotal <= 21)) {
                player.payout = 0                                   //Too many!  Or lost to dealer
            } else if (player.handTotal === 21 && this.dealer.handTotal !== 21) {
                console.log('BlackJack!')
                player.payout = player.bet + (player.bet * 1.5)     //Blackjack!
            } else if (player.handTotal === this.dealer.handTotal) {
                player.payout = player.bet                          //push
            } else {
                player.payout = player.bet * 2
            }
            console.log(`IsPlaying: ${player.isPlaying}.  Hand total: ${player.handTotal}.  Number of cards: ${player.hand.length}. Earnings: ${player.payout}`)
        }
    }
}

//start game
const game = new BlackJack(shuffleDeck(), 2)
game.addPlayers()

//place bets
game.players[1].placeBet(10)
game.players[2].placeBet(50)

//deal
game.deal()

//simulate play
game.players[1].hit()
game.players[1].hit()
game.players[2].stand()
game.dealerTurn()

//Review
game.endRound()

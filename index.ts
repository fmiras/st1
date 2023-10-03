const SUITS = ['♠', '♣', '♥', '♦']
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

class Card {
  constructor(public readonly suit: string, public readonly rank: string) {}
  greaterThan(card: Card | null) {
    return (
      card === null ||
      SUITS.indexOf(this.suit) > SUITS.indexOf(card.suit) ||
      (SUITS.indexOf(this.suit) === SUITS.indexOf(card.suit) &&
        RANKS.indexOf(this.rank) > RANKS.indexOf(card.rank))
    )
  }
  toString() {
    return `${this.rank}${this.suit}`
  }
}

class Player {
  public hand: Card[] = []

  constructor(public name: string) {}

  public playCard(lastCard: Card | null = null) {
    const card = this.hand.find((card) => card.greaterThan(lastCard))
    if (card) {
      return this.hand.splice(this.hand.indexOf(card!), 1)[0]
    }

    return this.shiftRandomCard()
  }

  private shiftRandomCard() {
    const index = Math.floor(Math.random() * this.hand.length)
    return this.hand.splice(index, 1)[0]
  }

  public sortHand() {
    this.hand = this.hand.sort((a, b) => {
      if (a.greaterThan(b)) {
        return 1
      }

      return -1
    })
    console.log(`${this.name} sorted hand: ${this.hand}`)
  }
}

class Deck {
  private cards: Card[] = []

  constructor() {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        this.cards.push(new Card(suit, rank))
      }
    }
  }

  public size() {
    return this.cards.length
  }

  public shuffle() {
    this.cards.sort(() => Math.random() - 0.5)
  }

  public draw() {
    return this.cards.pop()
  }
}

class Game {
  private turn = 0

  constructor(public players: Player[]) {
    const deck = new Deck()
    deck.shuffle()

    while (deck.size() > 0) {
      for (const player of this.players) {
        if (deck.size() === 0) {
          break
        }

        player.hand.push(deck.draw()!)
      }
    }

    for (const player of this.players) {
      player.sortHand()
    }
  }

  public play() {
    let winner: Player | null = null
    let winnerCard: Card | null = null

    while (!this.isFinished()) {
      const player = this.players[this.turn % this.players.length]
      const card = player.playCard(winnerCard)
      console.log(`${player.name} plays ${card!.rank}${card!.suit}`)

      if (winnerCard === null || card.greaterThan(winnerCard)) {
        winner = player
        winnerCard = card
      }

      if (this.trickFinished()) {
        console.log(`${winner!.name} wins!`)
        winner = null
        winnerCard = null
      }

      this.turn++
    }
  }

  private isFinished() {
    return this.players.every((player) => player.hand.length === 0)
  }

  private trickFinished() {
    return (this.turn + 1) % this.players.length === 0
  }
}

const game = new Game([
  new Player('Fefo'),
  new Player('Siri'),
  new Player('Mati'),
  new Player('Nico')
])
game.play()

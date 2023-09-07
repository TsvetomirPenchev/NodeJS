/* eslint-disable */
class TicTacToeGame {
  constructor() {
    this.socket = io.connect();
    this.isMyTurn = undefined;
    this.symbol = undefined;

    this.initSocketListeners();

    document.addEventListener('DOMContentLoaded', () => {
      this.elements = {
        boardHolder: document.getElementById('board-holder'),
        cells: document.querySelectorAll('.cell'),
        goToLobbyBtn: document.getElementById('go-to-lobby'),
        lobbyHolder: document.getElementById('lobby-holder'),
        message: document.getElementById('message'),
        opponentSymbol: document.getElementById('opponent-symbol'),
        playAgainBtn: document.getElementById('play-again'),
        playBtn: document.getElementById('play'),
        playerList: document.getElementById('player-list'),
        symbol: document.getElementById('symbol'),
        waitingMsg: document.getElementById('waiting-msg'),
      };

      this.initDOMListeners();
    });
  }

  initSocketListeners() {
    this.socket.on('updatePlayerList', (players) => {
      this.elements.playerList.innerHTML = '';

      if (players.length > 1) {
        Object.values(players).forEach((player) => {
          if (player.id !== this.socket.id) {
            const listItem = document.createElement('li');
            listItem.textContent = player.name;
            this.elements.playerList.appendChild(listItem);
          }
        });

        this.toggleWaitingMsg(false);
      } else {
        this.toggleWaitingMsg(true);
      }
    });

    this.socket.on('moveMade', (data) => {
      document.getElementById(data.position).textContent = data.symbol;

      if (this.symbol === undefined) {
        this.symbol = 'O';
        this.renderSymbolMessages();
      }

      this.isMyTurn = this.symbol !== data.symbol;

      const isGameOver = this.isGameOver();

      if (!isGameOver) {
        return this.renderTurnMessage();
      }

      this.elements.playAgainBtn.hidden = false;

      if (isGameOver === true) {
        this.showMsg("It's a draw!");
      } else {
        this.showMsg(`You ${isGameOver === this.symbol ? 'win' : 'lost'}!`);
      }

      this.toggleBoardState();
    });

    this.socket.on('gameStarted', (players) => {
      if (players) {
        players.forEach((player) => {
          if (player.id === this.socket.id) {
            document.getElementById('player-name').textContent = player.name;
          } else {
            document.getElementById('opponent-name').textContent = player.name;
          }
        });
      }

      this.resetBoard();
    });

    this.socket.on('opponentLeft', () => {
      this.showMsg('Your opponent left the game.');
      this.toggleBoardState();
    });
  }

  initDOMListeners() {
    this.elements.playBtn.addEventListener('click', () => {
      this.socket.emit('joinRoom');
    });

    this.elements.playAgainBtn.addEventListener('click', () => {
      this.socket.emit('playAgain');
    });

    this.elements.cells.forEach((cell) => {
      cell.addEventListener('click', this.makeMove.bind(this));
    });

    this.elements.goToLobbyBtn.addEventListener('click', () => {
      this.socket.emit('leaveRoom');
      this.toggleLobby(true);
    });
  }

  checkForWinner() {
    const winCombinations = [
      ['a0', 'a1', 'a2'],
      ['b0', 'b1', 'b2'],
      ['c0', 'c1', 'c2'],
      ['a0', 'b1', 'c2'],
      ['a2', 'b1', 'c0'],
      ['a0', 'b0', 'c0'],
      ['a1', 'b1', 'c1'],
      ['a2', 'b2', 'c2'],
    ];

    let winner;

    winCombinations.forEach((row) => {
      const [a, b, c] = row.map((id) => document.getElementById(id).textContent);

      if (a && a === b && a === c) {
        return (winner = a);
      }
    });

    return winner;
  }

  checkForFreeCells() {
    let freeCells = false;
    this.elements.cells.forEach(function (cell) {
      if (cell.textContent === '') return (freeCells = true);
    });
    return freeCells;
  }

  isGameOver() {
    const winner = this.checkForWinner();
    if (winner) return winner;

    return !this.checkForFreeCells();
  }

  makeMove(e) {
    e.preventDefault();
    if (this.isMyTurn === undefined) {
      this.isMyTurn = true;
      this.symbol = 'X';
      this.renderSymbolMessages();
    }

    if (!this.isMyTurn || e.target.textContent) {
      return;
    }

    this.socket.emit('makeMove', {
      symbol: this.symbol,
      position: e.target.id,
    });
  }

  toggleBoardState(disabled = true) {
    this.elements.cells.forEach((cell) => {
      cell.disabled = disabled;
    });
  }

  showMsg(msg) {
    this.elements.message.textContent = msg;
  }

  renderTurnMessage() {
    if (this.isMyTurn === undefined) {
      return;
    }

    this.showMsg(`Your ${!this.isMyTurn ? "opponent's" : ''} turn.`);
    this.toggleBoardState(!this.isMyTurn);
  }

  renderSymbolMessages() {
    this.elements.symbol.textContent = this.symbol;
    this.elements.opponentSymbol.textContent = this.symbol === 'X' ? 'O' : 'X';
  }

  toggleLobby(isActive = true) {
    this.elements.boardHolder.hidden = isActive;
    this.elements.lobbyHolder.hidden = !isActive;
  }

  toggleWaitingMsg(isActive = true) {
    this.elements.waitingMsg.hidden = !isActive;
    this.elements.playBtn.hidden = isActive;
  }

  resetBoard() {
    this.symbol = undefined;
    this.isMyTurn = undefined;
    this.elements.symbol.textContent = '';
    this.elements.opponentSymbol.textContent = '';
    this.showMsg('');
    this.elements.cells.forEach((cell) => {
      cell.textContent = '';
    });
    this.toggleBoardState(false);
    this.toggleLobby(false);
    this.elements.playAgainBtn.hidden = true;
  }
}

new TicTacToeGame();

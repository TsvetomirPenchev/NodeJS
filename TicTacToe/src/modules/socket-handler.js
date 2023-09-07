const { Server } = require('socket.io');
const { events } = require('../data/events');
const PlayersManager = require('./players-manager');

module.exports = class SocketHandler {
  constructor(httpServer) {
    this.io = new Server(httpServer);
    this.playersManager = new PlayersManager();
  }

  listen() {
    this.io.on(events.CONNECTION, this.onConnect.bind(this));
  }

  getSocket(socketId) {
    return this.io.sockets.sockets.get(socketId);
  }

  onConnect(socket) {
    this.connected(socket);

    socket.onAny((eventName, data) => {
      if (typeof this[eventName] === 'function') {
        const player = this.playersManager.get(socket.id);
        this[eventName](player, data);
      } else {
        console.log(`Unhandled event: ${eventName}`);
      }
    });

    socket.on(events.DISCONNECT, () => {
      const player = this.playersManager.get(socket.id);
      this.disconnect(player);
    });
  }

  setAvailablePlayers() {
    this.io.emit(events.UPDATE_PLAYER_LIST, this.playersManager.getAvailablePlayers());
  }

  connected(socket) {
    this.playersManager.create(socket.id);
    this.setAvailablePlayers();
  }

  leaveRoom(player) {
    this.getSocket(player.id).leave(player.roomId);
    this.io.to(player.roomId).emit(events.OPPONENT_LEFT);
    this.playersManager.update(player, { roomId: undefined });
    this.setAvailablePlayers();
  }

  joinRoom(player) {
    const availablePlayers = this.playersManager
      .getAvailablePlayers()
      .filter((p) => p.id !== player.id);

    if (availablePlayers.length === 0) {
      throw Error('No available players!');
    }

    const opponent = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    const roomId = `${player.id}-${opponent.id}`;

    this.getSocket(player.id).join(roomId);
    this.getSocket(opponent.id).join(roomId);

    this.playersManager.update(player, { roomId });
    this.playersManager.update(opponent, { roomId });

    this.io.to(roomId).emit(events.GAME_STARTED, [opponent, player]);

    this.setAvailablePlayers();
  }

  playAgain(player) {
    this.io.to(player.roomId).emit(events.GAME_STARTED);
  }

  makeMove(player, data) {
    this.io.to(player.roomId).emit(events.MOVE_MADE, data);
  }

  gameOver(player, data) {
    this.io.to(player.roomId).emit(events.GAME_OVER, data);
  }

  disconnect(player) {
    if (player.roomId) {
      this.io.to(player.roomId).emit(events.OPPONENT_LEFT);
    }

    this.playersManager.delete(player.id);
    this.setAvailablePlayers();
  }
};

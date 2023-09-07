const { faker } = require('@faker-js/faker');

module.exports = class PlayersManager {
  constructor() {
    this.players = new Map();
  }

  join(player) {
    this.players.set(player.id, player);
  }

  create(id) {
    const player = {
      id,
      name: faker.person.fullName(),
    };

    this.join(player);

    return player;
  }

  get(id) {
    return this.players.get(id);
  }

  update(player, data) {
    const playerData = this.players.get(player.id);
    return this.players.set(player.id, { ...playerData, ...data });
  }

  delete(id) {
    return this.players.delete(id);
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  getAvailablePlayers() {
    return this.getPlayers().filter((player) => player.roomId === undefined);
  }
};

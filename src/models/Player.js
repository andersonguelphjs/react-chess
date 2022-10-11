export class Player {
  constructor(options = {}) {
    this.color = options.color || "white";
    this.name = options.name || "Player";
    this.points = options.points || 0;
  }
}

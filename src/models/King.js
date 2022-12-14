import { Piece } from "./Piece";
export class King extends Piece {
  constructor(options = {}) {
    super(options);

    this._letter = "K";
    this._code = this.letter + (this.isWhite ? "l" : "d");
    this._value = 99;
  }
}

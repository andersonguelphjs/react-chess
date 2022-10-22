import { Piece } from "./Piece";
export class Rook extends Piece {
  constructor(options = {}) {
    super(options);

    this._letter = "R";
    this._code = this.letter + (this.isWhite ? "l" : "d");
    this._value = 5;
  }
}

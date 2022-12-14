import { Piece } from "./Piece";
export class Pawn extends Piece {
  constructor(options = {}) {
    super(options);

    this._letter = "P";
    this._code = this.letter + (this.isWhite ? "l" : "d");
    this._value = 1;
  }
}

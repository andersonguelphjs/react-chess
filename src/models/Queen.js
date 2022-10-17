import { Piece } from "./Piece";
export class Queen extends Piece {
  constructor(options = {}) {
    super(options);

    this._letter = "Q";
    this._code = this.letter + (this.isWhite ? "l" : "d");
    this._value = 9;
  }

}
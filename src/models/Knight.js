import { Piece } from "./Piece";
export class Knight extends Piece {
  constructor(options = {}) {
    super(options);

    this._letter = "n"
    this._code = this.letter + (this.isWhite ? "l" : "d");
    this._value = 3;
  }

}

  
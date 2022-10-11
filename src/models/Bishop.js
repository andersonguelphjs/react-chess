
import { Piece } from "./Piece";
export class Bishop extends Piece {
  constructor(options = {}) {
    super(options);

    this._letter = "b";
    this._code = this.letter + (this.isWhite ? "l" : "d");
    this._value = 3.5;
  }


}

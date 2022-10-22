export class Piece {
  constructor(options = {}) {
    this._isWhite = options.isWhite || false;
    this._isCaptured = options.isCaptured || false;
    this._numberOfTimesMoved = options.numberOfTimesMoved || 0;
    this._moveHistory = options.moveHistory || [];
  }

  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }

  get code() {
    return this._code;
  }
  set code(code) {
    this._code = code;
  }

  get letter() {
    return this._letter;
  }
  set letter(letter) {
    this._letter = letter;
  }

  get isWhite() {
    return this._isWhite;
  }
  set isWhite(isWhite) {
    this._isWhite = isWhite;
  }

  get isCaptured() {
    return this._isCaptured;
  }
  set isCaptured(isCaptured) {
    this._isCaptured = isCaptured;
  }

  get numberOfTimesMoved() {
    return this._numberOfTimesMoved;
  }
  set numberOfTimesMoved(numberOfTimesMoved) {
    this._numberOfTimesMoved = numberOfTimesMoved;
  }

  get moveHistory() {
    return this._moveHistory;
  }
  set moveHistory(moveHistory) {
    this._moveHistory = moveHistory;
  }
}

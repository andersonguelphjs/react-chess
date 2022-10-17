import { Player } from "./Player";
import { Board } from "./Board";

export class Game {
  constructor(options = {}) {
    this._event = options.events || "";
    this._site = options.site || "";
    this._date = options.date || new Date();
    this._round = options.round || 1;
    this._white = options.white || new Player();
    this._black = options.black || new Player({ color: "black" });
    this._whiteElo = options.whiteElo || "";
    this._blackElo = options.blackElo || "";
    this._ECO = options.ECO || "";
    this._result = options.result || "";
    this._pgn = options.pgn || "";

    this._board = new Board();
    this._whiteMove = options.whiteMove || true;
    this._moveHistory = [];
    this._capturedPieces = options.capturedPieces || [];
    this._turn = options.turn || 1;

    //https://chess.stackexchange.com/questions/1817/how-are-pgn-ambiguities-handled
  }

  get capturedPieces() {
    return this._capturedPieces;
  }
  set capturedPieces(capturedPieces) {
    this._capturedPieces = capturedPieces;
  }

  get turn() {
    return this._turn;
  }
  set turn(turn) {
    this._turn = turn;
  }

  get event() {
    return this._event;
  }
  set event(event) {
    this._event = event;
  }

  get site() {
    return this._site;
  }
  set site(site) {
    this._site = site;
  }

  get date() {
    return this._date;
  }
  set date(date) {
    this._date = date;
  }

  get round() {
    return this._round;
  }
  set round(round) {
    this._round = round;
  }

  get whiteElo() {
    return this._whiteElo;
  }
  set whiteElo(whiteElo) {
    this._whiteElo = whiteElo;
  }

  get blackElo() {
    return this._blackElo;
  }
  set blackElo(blackElo) {
    this._blackElo = blackElo;
  }

  get ECO() {
    return this.ECO;
  }
  set ECO(ECO) {
    this._ECO = ECO;
  }

  get white() {
    return this._white;
  }
  set white(white) {
    this._white = white;
  }

  get black() {
    return this._black;
  }
  set black(black) {
    this._black = black;
  }

  get whiteMove() {
    return this._whiteMove;
  }
  set whiteMove(whiteMove) {
    this._whiteMove = whiteMove;
  }

  get result() {
    return this._result;
  }
  set result(result) {
    this._result = result;
  }

  get moveHistory() {
    return this._moveHistory;
  }
  set moveHistory(moveHistory) {
    this._moveHistory = moveHistory;
  }

  get board() {
    return this._board;
  }
  set board(board) {
    this._board = board;
  }

  get pgn() {
    return this._pgn;
  }
  set pgn(pgn) {
    this._pgn = pgn;
  }

  switchMoves(whiteMove) {
    if (whiteMove) this.turn++;
    this._whiteMove = whiteMove;
  }

  addMove(move) {
    this._moveHistory.push(move);
  }
}

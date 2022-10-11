import { Square } from "./Square";
import { Pawn } from "./Pawn";
import { Knight } from "./Knight";
import { Bishop } from "./Bishop";
import { Rook } from "./Rook";
import { Queen } from "./Queen";
import { King } from "./King";
import { DEFAULT_SCALE_PX } from "../assets/constants";
export class Board {
  constructor(options = {}) {
    this._flipped = options.flipped || false;
    this._colorScheme = options.colorScheme || {
      light: "#FFCC99",
      dark: "#b58863",
    };
    this._scale = options.scale || DEFAULT_SCALE_PX;
    this._squares = options.squares;
    if (!this.squares) this.createNewBoard();
  }

  get colorScheme() {
    return this._colorScheme;
  }
  set colorScheme(colorScheme) {
    this._colorScheme = colorScheme;
  }

  get squares() {
    return this._squares;
  }
  set squares(squares) {
    this._squares = squares;
  }

  get scale() {
    return this._scale;
  }
  set scale(scale) {
    this._scale = scale;
  }

  get flipped() {
    return this._flipped;
  }
  set flipped(flipped) {
    this._flipped = flipped;
  }

  flipBoard() {
    this.flipped = !this._flipped;
  }
  //Square(x, y, piece, isWhite)

  createNewBoard() {
    console.log("Creating new game.board...");
    let squares = [];
    for (let i = 0; i < 64; i++) {
      
      const isWhite = Math.floor(i / 8) % 2 === 0 ? i % 2 === 0 : i % 2 !== 0;

      const x = i % 8;
      const y = Math.floor(i / 8);
      squares.push(
        new Square({
          x: x,
          y: y,
          colorChar: isWhite ? "l" : "d",
          isWhite: isWhite,
          piece: this.getStartPiece(x, y),
        })
      );
    }
    this.squares = squares;

  }

  getStartPiece = (x, y) => {
    switch (y) {
      case 0:
        switch (x) {
          case 0:
          case 7:
            return new Rook();
          case 1:
          case 6:
            return new Knight();
          case 2:
          case 5:
            return new Bishop();
          case 3:
            return new Queen();
          case 4:
            return new King();
          default:
            return "";
        }

      case 1:
        return new Pawn();

      case 6:
        return new Pawn({ isWhite: true });
      case 7:
        switch (x) {
          case 0:
          case 7:
            return new Rook({ isWhite: true });
          case 1:
          case 6:
            return new Knight({ isWhite: true });
          case 2:
          case 5:
            return new Bishop({ isWhite: true });
          case 3:
            return new Queen({ isWhite: true });
          case 4:
            return new King({ isWhite: true });

          default:
            return "";
        }
      default:
        return null;
    }
  };
}

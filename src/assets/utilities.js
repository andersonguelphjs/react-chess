import { Pawn } from "../models/Pawn";
import { Knight } from "../models/Knight";
import { Bishop } from "../models/Bishop";
import { Rook } from "../models/Rook";
import { Queen } from "../models/Queen";
import { King } from "../models/King";
import { DEFAULT_SCALE_PX } from "./constants";

export const getStartPiece = (x, y) => {
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
          return null;
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
          return null;
      }
    default:
      return null;
  }
};

export const getStartSquares = () => {
  console.log("Creating squares...");
  let squares = [];
  for (let i = 0; i < 64; i++) {
    const isWhite = Math.floor(i / 8) % 2 === 0 ? i % 2 === 0 : i % 2 !== 0;
    const x = i % 8;
    const y = Math.floor(i / 8);
    const rank = 8 - y;
    const column = String.fromCharCode(x + 65).toLowerCase();
    squares.push({
      x: x,
      y: y,
      colorChar: isWhite ? "l" : "d",
      isWhite: isWhite,
      piece: getStartPiece(x, y),
      rank: rank,
      column: column,
      code: column + rank,
      scale: DEFAULT_SCALE_PX,
      draggedY: 0,
      draggedX: 0,
    });
  }
  return squares;
};

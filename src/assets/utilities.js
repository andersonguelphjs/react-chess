import { Pawn } from "../models/Pawn";
import { Knight } from "../models/Knight";
import { Bishop } from "../models/Bishop";
import { Rook } from "../models/Rook";
import { Queen } from "../models/Queen";
import { King } from "../models/King";
import { DEFAULT_SCALE_PX } from "./constants";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from "./constants";
export const getStartPiece = (x, y) => {
  switch (y) {
    case 0:
      switch (x) {
        case 0:
        case 7:
          return {
            name: "Rook",
            isWhite: false,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "R",
            code: "Rd",
            value: 5,
          };
        case 1:
        case 6:
          return {
            name: "Knight",
            isWhite: false,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "N",
            code: "Nd",
            value: 3,
          };
        case 2:
        case 5:
          return {
            name: "Bishop",
            isWhite: false,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "B",
            code: "Bd",
            value: 3.5,
          };
        case 3:
          return {
            name: "Queen",
            isWhite: false,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "Q",
            code: "Qd",
            value: 9,
          };
        case 4:
          return {
            name: "King",
            isWhite: false,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "K",
            code: "Kd",
            value: 99,
          };
        default:
          return null;
      }

    case 1:
      return {
        name: "Pawn",
        isWhite: false,
        //isCaptured: false,
        numberOfTimesMoved: 0,
        //moveHistory: [],
        letter: "P",
        code: "Pd",
        value: 1,
      };

    case 6:
      return {
        name: "Pawn",
        isWhite: true,
        //isCaptured: false,
        numberOfTimesMoved: 0,
        //moveHistory: [],
        letter: "P",
        code: "Pl",
        value: 1,
      };
    case 7:
      switch (x) {
        case 0:
        case 7:
          return {
            name: "Rook",
            isWhite: true,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "R",
            code: "Rl",
            value: 5,
          };
        case 1:
        case 6:
          return {
            name: "Knight",
            isWhite: true,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "N",
            code: "Nl",
            value: 3,
          };
        case 2:
        case 5:
          return {
            name: "Bishop",
            isWhite: true,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "B",
            code: "Bl",
            value: 3.5,
          };
        case 3:
          return {
            name: "Queen",
            isWhite: true,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "Q",
            code: "Ql",
            value: 9,
          };
        case 4:
          return {
            name: "King",
            isWhite: true,
            //isCaptured: false,
            numberOfTimesMoved: 0,
            //moveHistory: [],
            letter: "K",
            code: "Kl",
            value: 99,
          };

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

export const getSquare = (config) => {
  const { data, x, y, squares, board } = config;
  data.x = board.flipped ? data.x * -1 : data.x;
  data.y = board.flipped ? data.y * -1 : data.y;
  const movedXSquares = Math.round(data.x / board.scale);
  const movedYSquares = Math.round(data.y / board.scale);

  let newSquare;
  if (
    (Math.abs(movedXSquares) || Math.abs(movedYSquares)) > 0 &&
    y + movedYSquares > -1 &&
    y + movedYSquares < 8 &&
    x + movedXSquares > -1 &&
    x + movedXSquares < 8
  ) {
    const newXCoordinate = x + movedXSquares;
    const newYCoordinate = y + movedYSquares;
    newSquare = squares.find(
      (square) => square.x === newXCoordinate && square.y === newYCoordinate
    );
  }

  return newSquare;
};

export const getFlippedBoard = (config) => {
  const { squares } = config;
  let flippedBoard = [];
  for (let i = 0; i < 64; i++) {
    flippedBoard.push(squares[63 - i]);
  }
  return flippedBoard;
};

export const getPossibleSquare = (config) => {
  const { x, y, squares } = config;
  return squares.find((square) => square.x === x && square.y === y);
};

export const isSquareOccupied = (square) => {
  return square.piece ? true : false;
};

export const isCapturableSquare = (config) => {
  const { x, y, attackingColorIsWhite, squares } = config;
  const capturableSquare = getPossibleSquare({
    x: x,
    y: y,
    squares: squares,
  });

  if (capturableSquare?.piece)
    return capturableSquare?.piece?.isWhite !== attackingColorIsWhite;
  return false;
};

export const isValidSquare = (x, y) => {
  return x >= 0 && y >= 0 && x <= 7 && y <= 7;
};

export const getXYSquares = (config = {}) => {
  const XYsquares = [];
  const { isPawn, x, y, isKing, isWhite, hasMoved, squares } = config;
  if (isPawn) {
    //console.log("hasMoved", hasMoved);
    if (isValidSquare(x, isWhite ? y - 1 : y + 1)) {
      const oneAhead = getPossibleSquare({
        x: x,
        y: isWhite ? y - 1 : y + 1,
        squares: squares,
      });
      if (!isSquareOccupied(oneAhead)) {
        XYsquares.push(oneAhead);
        // console.log(
        //   "hasMoved2",
        //   hasMoved,
        //   isValidSquare(x, isWhite ? y - 2 : y + 2)
        // );
        if (!hasMoved && isValidSquare(x, isWhite ? y - 2 : y + 2)) {
          const twoAhead = getPossibleSquare({
            x: x,
            y: isWhite ? y - 2 : y + 2,
            squares: squares,
          });
          if (!isSquareOccupied(twoAhead)) XYsquares.push(twoAhead);
        }
      }
    }
  } else {
    const max = isKing ? 1 : 7;
    const xyDelta = [
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ];
    xyDelta.forEach((d) => {
      let blocked = false;
      for (let i = 1; i <= max; i++) {
        if (blocked) break;
        const deltaX = x + d[0] * i;
        const deltaY = y + d[1] * i;
        if (isValidSquare(deltaX, deltaY)) {
          const square = getPossibleSquare({
            x: deltaX,
            y: deltaY,
            squares: squares,
          });
          if (!isSquareOccupied(square)) {
            XYsquares.push(square);
          } else {
            if (
              config.isOppositeKingCheck ||
              isCapturableSquare({
                x: deltaX,
                y: deltaY,
                attackingColorIsWhite: isWhite,
                squares: squares,
              })
            ) {
              XYsquares.push(square);
            }
            blocked = true;
          }
        } else {
          blocked = true;
        }
      }
    });
  }

  return XYsquares;
};

export const getDiagonalSquares = (config = {}) => {
  let diagonalSquares = [];
  const { x, y, isPawn, isKing, isWhite, squares } = config;
  if (isPawn) {
    const topLeftCaptureSqaureX = x - 1;
    const captureSqaureY = isWhite ? y - 1 : y + 1;
    if (
      isValidSquare(topLeftCaptureSqaureX, captureSqaureY) &&
      (config.isOppositeKingCheck ||
        isCapturableSquare({
          x: topLeftCaptureSqaureX,
          y: captureSqaureY,
          attackingColorIsWhite: isWhite,
          squares: squares,
        }))
    ) {
      diagonalSquares.push(
        getPossibleSquare({
          x: topLeftCaptureSqaureX,
          y: captureSqaureY,
          squares: squares,
        })
      );
    }
    const topRightCaptureSqaureX = x + 1;
    if (
      isValidSquare(topRightCaptureSqaureX, captureSqaureY) &&
      (config.isOppositeKingCheck ||
        isCapturableSquare({
          x: topRightCaptureSqaureX,
          y: captureSqaureY,
          attackingColorIsWhite: isWhite,
          squares: squares,
        }))
    ) {
      diagonalSquares.push(
        getPossibleSquare({
          x: topRightCaptureSqaureX,
          y: captureSqaureY,
          squares: squares,
        })
      );
    }
  } else {
    const max = isKing ? 1 : 7;
    const xyDelta = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];
    xyDelta.forEach((d) => {
      let blocked = false;
      for (let i = 1; i <= max; i++) {
        if (blocked) break;
        const deltaX = x + d[0] * i;
        const deltaY = y + d[1] * i;
        if (isValidSquare(deltaX, deltaY)) {
          const square = getPossibleSquare({
            x: deltaX,
            y: deltaY,
            squares: squares,
          });
          if (!isSquareOccupied(square)) {
            diagonalSquares.push(square);
          } else {
            if (
              config.isOppositeKingCheck ||
              isCapturableSquare({
                x: deltaX,
                y: deltaY,
                attackingColorIsWhite: isWhite,
                squares: squares,
              })
            ) {
              diagonalSquares.push(square);
            }
            blocked = true;
          }
        } else {
          blocked = true;
        }
      }
    });
  }

  return diagonalSquares;
};

export const getKnightSquares = (config = {}) => {
  let knightMoves = [];
  const { x, y, isWhite, squares } = config;
  const coordinates = [
    [x - 1, y - 2],
    [x + 1, y - 2],
    [x + 2, y - 1],
    [x + 2, y + 1],
    [x + 1, y + 2],
    [x - 1, y + 2],
    [x - 2, y + 1],
    [x - 2, y - 1],
  ];
  coordinates.forEach((c) => {
    if (isValidSquare(c[0], c[1])) {
      const square = getPossibleSquare({
        x: c[0],
        y: c[1],
        squares: squares,
      });
      if (
        config.isOppositeKingCheck ||
        isCapturableSquare({
          x: c[0],
          y: c[1],
          attackingColorIsWhite: isWhite,
          squares: squares,
        }) ||
        !isSquareOccupied(square)
      )
        knightMoves.push(square);
    }
  });
  // console.log("knight moves: " + knightMoves.map((km) => km.code).join(";"));

  return knightMoves;
};

export const getCastlingSquares = (config) => {
  const { originSquare, squaresOppositionCanAttack, squares } = config;
  const queenSideCastleSquare = squares.find(
    (s) =>
      (originSquare.piece.isWhite && s.code === "c1") ||
      (!originSquare.piece.isWhite && s.code === "c8")
  );
  const kingSideCastleSquare = squares.find(
    (s) =>
      (originSquare.piece.isWhite && s.code === "g1") ||
      (!originSquare.piece.isWhite && s.code === "g8")
  );
  const queenSideRook = squares.find((s) =>
    s.code === originSquare.piece.isWhite ? "a1" : "a8"
  );
  const kingSideRook = squares.find((s) =>
    s.code === originSquare.piece.isWhite ? "a1" : "a8"
  );
  const queenSideInterval = squares.filter((s) =>
    originSquare.piece.isWhite
      ? s.code === "d1" || s.code === "c1"
      : s.code === "d8" || s.code === "c8"
  );
  const kingSideInterval = squares.filter((s) =>
    originSquare.piece.isWhite
      ? s.code === "f1" || s.code === "g1"
      : s.code === "f8" || s.code === "g8"
  );
  const castlingSquares = [];
  if (
    squaresOppositionCanAttack.filter((s) => s.code === originSquare.code)
      .length > 0
  )
    return [];

  const queenSideRookIsMoved =
    !queenSideRook?.piece ||
    queenSideRook?.piece?.letter !== "R" ||
    queenSideRook?.piece?.numberOfTimesMoved > 0;
  const queenSideCastleSquareIsChecked =
    squaresOppositionCanAttack.filter(
      (s) => s.code === queenSideCastleSquare.code
    ).length > 0;
  const queenSideIntervalIsChecked =
    queenSideInterval.filter(
      (qsi) =>
        squaresOppositionCanAttack.filter((s) => s.code === qsi.code).length > 0
    ).length > 0;
  const queenSideIntervalIsEmpty =
    queenSideInterval.filter((qsi) => isSquareOccupied(qsi)).length === 0;

  const kingSideRookIsMoved =
    !kingSideRook?.piece ||
    kingSideRook?.piece?.letter !== "R" ||
    kingSideRook?.piece?.numberOfTimesMoved > 0;
  const kingSideCastleSquareIsChecked =
    squaresOppositionCanAttack.filter(
      (s) => s.code === kingSideCastleSquare.code
    ).length > 0;
  const kingSideIntervalIsChecked =
    kingSideInterval.filter(
      (ksi) =>
        squaresOppositionCanAttack.filter((s) => s.code === ksi.code).length > 0
    ).length > 0;
  const kingSideIntervalIsEmpty =
    kingSideInterval.filter((ksi) => isSquareOccupied(ksi)).length === 0;

  if (
    !queenSideRookIsMoved &&
    !queenSideCastleSquareIsChecked &&
    !queenSideIntervalIsChecked &&
    queenSideIntervalIsEmpty
  ) {
    castlingSquares.push(queenSideCastleSquare);
  }
  if (
    !kingSideRookIsMoved &&
    !kingSideCastleSquareIsChecked &&
    !kingSideIntervalIsChecked &&
    kingSideIntervalIsEmpty
  ) {
    castlingSquares.push(kingSideCastleSquare);
  }
  //console.log("castlingSquares", castlingSquares);
  return castlingSquares;
};

export const getPawnMoves = (config) => {
  let possibleSquares = [];
  const { originSquare, isOppositeKingCheck = false, squares } = config;
  const { piece, x, y } = originSquare;
  const _config = {
    isPawn: true,
    hasMoved: piece.numberOfTimesMoved > 0,
    x: x,
    y: y,
    isWhite: piece.isWhite,
    isOppositeKingCheck: isOppositeKingCheck,
    squares: squares,
  };
  const XYsquares = !isOppositeKingCheck && getXYSquares(_config);

  possibleSquares = possibleSquares.concat(XYsquares);
  const diagonalSquares = getDiagonalSquares(_config);
  possibleSquares = possibleSquares.concat(diagonalSquares);

  return possibleSquares;
};

export const getRookMoves = (config) => {
  let possibleSquares = [];
  const { originSquare, isOppositeKingCheck = false, squares } = config;
  // console.log("getRookMoves isCheckOwnColor", isCheckOwnColor);
  const { x, y, piece } = originSquare;
  const _config = {
    hasMoved: piece.numberOfTimesMoved > 0,
    x: x,
    y: y,
    isWhite: piece.isWhite,
    isOppositeKingCheck: isOppositeKingCheck,
    squares: squares,
  };
  const XYsquares = getXYSquares(_config);

  possibleSquares = possibleSquares.concat(XYsquares);

  return possibleSquares;
};

export const getKnightMoves = (config) => {
  const { originSquare, isOppositeKingCheck = false, squares } = config;
  const { x, y, piece } = originSquare;
  const _config = {
    x: x,
    y: y,
    isWhite: piece.isWhite,
    isOppositeKingCheck: isOppositeKingCheck,
    squares: squares,
  };

  return getKnightSquares(_config);
};

export const getBishopMoves = (config) => {
  let possibleSquares = [];
  const { originSquare, isOppositeKingCheck = false, squares } = config;
  const { x, y, piece } = originSquare;
  const _config = {
    x: x,
    y: y,
    isWhite: piece.isWhite,
    isOppositeKingCheck: isOppositeKingCheck,
    squares: squares,
  };

  const diagonalSquares = getDiagonalSquares(_config);
  possibleSquares = possibleSquares.concat(diagonalSquares);

  return possibleSquares;
};

export const getQueenMoves = (config) => {
  let possibleSquares = [];
  const { originSquare, isOppositeKingCheck = false, squares } = config;
  const { x, y, piece } = originSquare;
  const _config = {
    x: x,
    y: y,
    isWhite: piece.isWhite,
    isOppositeKingCheck: isOppositeKingCheck,
    squares: squares,
  };
  const XYsquares = getXYSquares(_config);

  possibleSquares = possibleSquares.concat(XYsquares);
  const diagonalSquares = getDiagonalSquares(_config);
  possibleSquares = possibleSquares.concat(diagonalSquares);

  return possibleSquares;
};

export const getEnPassantSquares = (config = {}) => {};

export const getSquaresOppositionCanAttack = (config) => {
  const { isWhite, squares } = config;
  let opponentSquares = squares.filter(
    (s) => s.piece && s.piece?.isWhite === !isWhite
  );

  let allPossibleAttacks = [];
  let uniqueSquares = [];

  opponentSquares.forEach(
    (s) =>
      (allPossibleAttacks = allPossibleAttacks.concat(
        getPossibleSquaresToMoveTo({
          originSquare: s,
          isOppositeKingCheck: true,
          squares: [...squares],
        })
      ))
  );

  allPossibleAttacks.forEach((s) => {
    if (!uniqueSquares.find((u) => u.code === s.code)) {
      uniqueSquares.push(s);
    }
  });

  //console.log("uniqueSquares", uniqueSquares);
  return uniqueSquares;
};

export const getKingMoves = (config) => {
  let possibleSquares = [];
  const { originSquare, isOppositeKingCheck = false, squares } = config;
  const { x, y, piece } = originSquare;
  const _config = {
    isKing: true,
    x: x,
    y: y,
    isWhite: piece.isWhite,
    isOppositeKingCheck: isOppositeKingCheck,
    squares: squares,
  };

  const XYsquares = getXYSquares(_config);

  possibleSquares = possibleSquares.concat(XYsquares);
  const diagonalSquares = getDiagonalSquares(_config);
  possibleSquares = possibleSquares.concat(diagonalSquares);
  const squaresOppositionCanAttack =
    !isOppositeKingCheck &&
    getSquaresOppositionCanAttack({
      isWhite: piece.isWhite,
      squares: squares,
    });

  const castlingSquares =
    piece.numberOfTimesMoved === 0 &&
    !isOppositeKingCheck &&
    getCastlingSquares({
      originSquare: originSquare,
      squaresOppositionCanAttack: squaresOppositionCanAttack,
      squares: squares,
    });
  possibleSquares = possibleSquares.concat(castlingSquares);

  if (squaresOppositionCanAttack)
    possibleSquares = possibleSquares.filter(
      (p) => !squaresOppositionCanAttack.find((s) => p.code === s.code)
    );

  return possibleSquares;
};

export const getPossibleSquaresToMoveTo = (config) => {
  const { originSquare, isOppositeKingCheck = false } = config;
  const pieceName = originSquare?.piece?.name;
  // console.log(
  //   "originSquare.piece.letter code",
  //   originSquare.code,
  //   originSquare?.piece?.constructor?.name
  // );
  if (!pieceName) return [];
  switch (originSquare.piece.name) {
    case PAWN:
      return getPawnMoves(config);
    case ROOK:
      return getRookMoves(config);
    case KNIGHT:
      return getKnightMoves(config);
    case BISHOP:
      return getBishopMoves(config);
    case QUEEN:
      return getQueenMoves(config);
    case KING:
      return getKingMoves(config);
    default:
      return [];
  }
};

export const getHypotheticalBoard = (config) => {
  const { squares, x, y, fromX, fromY, piece } = config;
  const newSquares = [...squares];

  const index = squares.findIndex((square) => {
    return square.x === x && square.y === y;
  });

  const newSquare = { ...squares[index] };
  newSquare.piece = piece;
  newSquares[index] = newSquare;
  //empty 'from '
  const fromIndex = squares.findIndex((square) => {
    return square.x === fromX && square.y === fromY;
  });
  const fromSquare = { ...squares[fromIndex] };
  fromSquare.piece = null;
  newSquares[fromIndex] = fromSquare;
  //console.log("index, fromIndex: ", index, fromIndex, fromX, fromY);
  return newSquares;
};

export const isKingInCheckAfterMove = (config) => {
  const { hypotheticalBoard, whiteMove } = config;
  const kingSquare = hypotheticalBoard.find(
    (s) => s.piece && s.piece.isWhite === whiteMove && s.piece.letter === "K"
  );
  const attackedSquares = getSquaresOppositionCanAttack({
    isWhite: kingSquare.piece.isWhite,
    squares: hypotheticalBoard,
  });
  return (
    attackedSquares.filter((nas) => nas.code === kingSquare.code).length > 0
  );
};

export const isPlayerCheckMated = (config) => {
  let isCheckmate = true;
  const { hypotheticalBoard, whiteMove } = config;
  const kingSquare = hypotheticalBoard.find(
    (s) => s.piece && s.piece.isWhite === whiteMove && s.piece.letter === "K"
  );
  const occupiedSquares = hypotheticalBoard.filter(
    (s) => s.piece && s.piece.isWhite === whiteMove
  );
  //console.log("isPlayerCheckMated king is on ", kingSquare.code);
  occupiedSquares.forEach((s) => {
    if (!isCheckmate) return false;
    // console.log("checking ", s.code, s.piece.letter);
    const possibleSquaresToMoveTo = getPossibleSquaresToMoveTo({
      originSquare: s,
      squares: [...hypotheticalBoard],
    });
    // console.log(
    //   "poss ",
    //   possibleSquaresToMoveTo.map((ps) => ps.code).join(";")
    // );
    const filteredPossibleSquaresToMoveTo = [...possibleSquaresToMoveTo];
    filteredPossibleSquaresToMoveTo.every((ps) => {
      const _hypotheticalBoard = getHypotheticalBoard({
        x: ps.x,
        y: ps.y,
        piece: s.piece,
        fromX: s.x,
        fromY: s.y,
        squares: [...hypotheticalBoard],
      });

      // const kingSquare = hypotheticalBoard.find(
      //   (s) =>
      //     s.piece &&
      //     s.piece.isWhite === game.whiteMove &&
      //     s.piece.letter === "K"
      // );
      // console.log(
      //   "hypotheticalBoard moving to",
      //   ps.code,
      //   hypotheticalBoard
      // );
      // const attackedSquares = getSquaresOppositionCanAttack({
      //   isWhite: kingSquare.piece.isWhite,
      //   squares: hypotheticalBoard,
      // });
      // const _isKingInCheck =
      //   attackedSquares.filter((nas) => nas.code === kingSquare.code)
      //     .length > 0;
      const _isKingInCheck = isKingInCheckAfterMove({
        hypotheticalBoard: _hypotheticalBoard,
        whiteMove: whiteMove,
      });
      const goingToSquare = hypotheticalBoard.find((square) => {
        return square.x === ps.x && square.y === ps.y;
      });
      const fromSquare = hypotheticalBoard.find((square) => {
        return square.x === s.x && square.y === s.y;
      });
      if (_isKingInCheck) {
        console.log(
          `King is still in check after move :${s.piece.letter} from ${fromSquare.code} to ${goingToSquare.code}`
        );
      } else {
        console.log(
          `King is not in check after move :${s.piece.letter} from ${fromSquare.code} to ${goingToSquare.code}`
        );
        console.log("breaking loop");
        isCheckmate = false;
        return false;
      }
      return true;
    });
    return true;
  });
  /*
  get all occupiedSquares;
  for each piece in occupiedSquares
    get all possibleSquaresToMoveTo
      for each possibleSquaresToMoveTo
         get hypotheticalBoard
          if this King in not Check
             break and return false

  */

  return isCheckmate;
};

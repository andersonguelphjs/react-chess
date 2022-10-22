import {
  FLIP_BOARD,
  SET_SCALE,
  SET_SQAURE_TO_MOVE_TO,
  SET_SQUARES_TO_MOVE_FROM,
  SET_MOVE_SQUARES_TO_EMPTY_OBJECTS,
  SET_POSSIBLE_SQUARES_TO_MOVE_TO,
  MOVE_PIECE_TO_SQUARE,
  MAKE_SQUARE_EMPTY,
  SWITCH_MOVE,
  DEFAULT_SCALE_PX,
} from "../assets/constants";
import { getStartSquares } from "../assets/utilities";

export const defaultState = {
  squareToMoveTo: {},
  squareToMoveFrom: {},
  possibleSquaresToMoveTo: [],
  game: {
    event: "",
    site: "",
    date: new Date(),
    round: 1,
    white: { name: "White", points: 0 },
    black: { name: "Black", points: 0 },
    whiteElo: "",
    blackElo: "",
    ECO: "",
    result: "",
    pgn: "",
    whiteMove: true,
    moveHistory: [],
    capturedPieces: [],
    isKingInCheck: false,
  },
  board: {
    flipped: false,
    colorScheme: {
      light: "#FFCC99",
      dark: "#b58863",
    },
    scale: DEFAULT_SCALE_PX,
    squares: getStartSquares(),
  },
};

export const getPGNFromMove = (config = {}) => {
  const { square, action } = config;
  const isPawn = action.piece.letter === "P";
  const isCapture = square.piece?.letter ? true : false;
  if (action.isCastle) {
    if (action.piece.letter === "K") return action.isCastle;
    return "";
  }
  if (isPawn) {
    if (isCapture) {
      return `${action.fromSquareCode.substring(0, 1)}x${square.code}`;
    }
    return square.code;
  }
  if (isCapture) {
    return `${action.piece.letter}x${square.code}`;
  }
  return `${action.piece.letter}${square.code}`;
};

export const formReducer = (state, action) => {
  let index;
  let newSquares;
  let newSquare;
  let newMoveHistory;
  //console.log("formReducer", action);
  switch (action.type) {
    case FLIP_BOARD:
      return {
        ...state,
        board: { ...state.board, ...{ flipped: !state.board.flipped } },
      };
    case SET_SCALE:
      return {
        ...state,
        board: { ...state.board, ...{ scale: action.scale } },
      };
    case SET_SQAURE_TO_MOVE_TO:
      return { ...state, ...{ squareToMoveTo: action.squareToMoveTo } };
    case SET_SQUARES_TO_MOVE_FROM:
      return {
        ...state,
        ...{
          squareToMoveFrom: action.squareToMoveFrom,
          possibleSquaresToMoveTo: action.possibleSquaresToMoveTo,
        },
      };
    case SET_MOVE_SQUARES_TO_EMPTY_OBJECTS:
      return {
        ...state,
        ...{
          squareToMoveTo: {},
          squareToMoveFrom: {},
          possibleSquaresToMoveTo: [],
        },
      };
    case SET_POSSIBLE_SQUARES_TO_MOVE_TO:
      return {
        ...state,
        ...{ possibleSquaresToMoveTo: action.possibleSquaresToMoveTo },
      };
    case MAKE_SQUARE_EMPTY:
      index = state.board.squares.findIndex((square) => {
        return square.x === action.x && square.y === action.y;
      });
      newSquare = { ...state.board.squares[index] };
      newSquare.draggedX = 0;
      newSquare.draggedY = 0;
      newSquare.piece = null;
      newSquares = [...state.board.squares];
      newSquares[index] = newSquare;
      return {
        ...state,
        ...{ board: { ...state.board, ...{ squares: newSquares } } },
      };
    case MOVE_PIECE_TO_SQUARE:
      // const wrongTurnError =
      //   (state.game.whiteMove && action.piece.code.substring(1, 2) === "d") ||
      //   (!state.game.whiteMove && action.piece.code.substring(1, 2) === "l");
      // console.log(
      //   MOVE_PIECE_TO_SQUARE,
      //   action.piece.code,
      //   state.game.whiteMove,
      //   action.piece.code.substring(1, 2) || "n",
      //   action.piece.code.substring(1, 2) === "d"
      // );
      // console.log("wrongTurnError ", wrongTurnError);
      // if (wrongTurnError) {
      //   state.game.switchMoves(!state.game.whiteMove);
      //   console.log(SWITCH_MOVE);
      //   return { ...state, ...{ game: state.game } };
      // }
      index = state.board.squares.findIndex((square) => {
        return square.x === action.x && square.y === action.y;
      });
      newMoveHistory = [...state.game.moveHistory];
      if (action.record) {
        newMoveHistory.push({
          turn: state.game.turn,
          move: state.game.whiteMove,
          pieceMoved: action.piece.letter,
          capturedPiece: state.board.squares[index].piece?.letter || "",
          x: action.x,
          y: action.y,
          pgn: getPGNFromMove({
            action: action,
            square: state.board.squares[index],
          }),
        });
      }
      newSquare = { ...state.board.squares[index] };
      newSquare.draggedX = 0;
      newSquare.draggedY = 0;
      newSquare.piece = action.piece;
      newSquare.numberOfTimesMoved++;

      newSquares = [...state.board.squares];
      newSquares[index] = newSquare;

      return {
        ...state,
        ...{ game: { ...state.game, ...{ moveHistory: newMoveHistory } } },
        ...{ board: { ...state.board, ...{ squares: newSquares } } },
      };

    case SWITCH_MOVE:
      //console.log(state);
      //console.log("whiteMove", state.game.whiteMove, !state.game.whiteMove);
      return {
        ...state,
        ...{ game: { ...state.game, ...{ whiteMove: !state.game.whiteMove } } },
      };
    default:
      return { ...state };
  }
};

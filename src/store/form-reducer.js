import { createContext } from "react";
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
} from "../assets/constants";

import { Game } from "../models/Game";

export const defaultState = {
  squareToMoveTo: {},
  squareToMoveFrom: {},
  possibleSquaresToMoveTo: [],
  game: new Game(),
};

export const getPGNFromMove = (config = {}) => {
  const { square, action } = config;
  const isPawn = action.piece.letter === "P";
  const isCapture = square.piece?.letter ? true : false;
  if (action.isCastle){
    if (action.piece.letter === "K") return action.isCastle
    return ""
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

  switch (action.type) {
    case FLIP_BOARD:
      console.log(FLIP_BOARD);
      state.game.board.flipBoard();
      return { ...state, game: state.game };
    case SET_SCALE:
      if (action.scale > 30 && action.scale < 100)
        state.game.board.scale = action.scale;
      return {
        ...state,
        ...{
          game: state.game,
        },
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
      index = state.game.board.squares.findIndex((square) => {
        return square.x === action.x && square.y === action.y;
      });
      state.game.board.squares[index].draggedX = 0;
      state.game.board.squares[index].draggedY = 0;
      state.game.board.squares[index].piece = null;
      return { ...state, ...{ game: state.game } };
    case MOVE_PIECE_TO_SQUARE:
      const wrongTurnError = ((state.game.whiteMove && action.piece.code.substring(1,2) === "d")) || (!state.game.whiteMove && action.piece.code.substring(1,2) === "l")
      console.log(MOVE_PIECE_TO_SQUARE, action.piece.code, state.game.whiteMove, (action.piece.code.substring(1,2) || "n"), action.piece.code.substring(1,2) === "d");
      console.log("wrongTurnError ", wrongTurnError );
      if (wrongTurnError) {
        state.game.switchMoves(!state.game.whiteMove);
        console.log(SWITCH_MOVE)
        return { ...state, ...{ game: state.game } };
      }
      index = state.game.board.squares.findIndex((square) => {
        return square.x === action.x && square.y === action.y;
      });
      if (action.record) {
        state.game.addMove({
          turn: state.game.turn,
          move: state.game.whiteMove,
          pieceMoved: action.piece.letter,
          capturedPiece: state.game.board.squares[index].piece?.letter || "",
          x: action.x,
          y: action.y,
          pgn: getPGNFromMove({
            action: action,
            square: state.game.board.squares[index],
          }),
        });
      }
      state.game.board.squares[index].draggedX = 0;
      state.game.board.squares[index].draggedY = 0;
      state.game.board.squares[index].piece = action.piece;
      state.game.board.squares[index].piece.numberOfTimesMoved++;

      return { ...state, ...{ game: state.game } };
    case SWITCH_MOVE:
      state.game.switchMoves(!state.game.whiteMove);
      console.log(SWITCH_MOVE)
      return { ...state, ...{ game: state.game } };
    default:
      return state;
  }
};

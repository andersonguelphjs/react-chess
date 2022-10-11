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
  SWITCH_TURN
} from "../assets/constants";

import { Game } from "../models/Game";

export const defaultState = {
  squareToMoveTo: {},
  squareToMoveFrom: {},
  possibleSquaresToMoveTo: [],
  game : new Game(),
};

export const formReducer = (state, action) => {

  let index;

  switch (action.type) {
    case FLIP_BOARD:
      console.log(FLIP_BOARD);
      state.game.board.flipBoard();
      return { ...state, game:state.game };
    case SET_SCALE:
      if (action.scale > 30 && action.scale < 100) state.game.board.scale = action.scale
      return {
        ...state,
        ...{
          game:state.game
        }, 
      };
    case SET_SQAURE_TO_MOVE_TO:
      return { ...state, ...{ squareToMoveTo: action.squareToMoveTo } };
    case SET_SQUARES_TO_MOVE_FROM:
        return { ...state, ...{ squareToMoveFrom: action.squareToMoveFrom, possibleSquaresToMoveTo : action.possibleSquaresToMoveTo } };
    case SET_MOVE_SQUARES_TO_EMPTY_OBJECTS:
      return { ...state, ...{ squareToMoveTo: {}, squareToMoveFrom: {}, possibleSquaresToMoveTo:[]} };
    case SET_POSSIBLE_SQUARES_TO_MOVE_TO:
      return { ...state, ...{ possibleSquaresToMoveTo : action.possibleSquaresToMoveTo } };
    case MAKE_SQUARE_EMPTY:
        index = state.game.board.squares.findIndex(square => {
          return square.x === action.x && square.y === action.y;
        });
        state.game.board.squares[index].draggedX = 0;
        state.game.board.squares[index].draggedY = 0;
        state.game.board.squares[index].piece = null;
        return { ...state, ...{ game: state.game } };
    case MOVE_PIECE_TO_SQUARE:
      console.log("acttion", action.x, action.y, state.game.board.squares)
        index = state.game.board.squares.findIndex(square => {
          return square.x === action.x && square.y === action.y;
        });
        state.game.board.squares[index].draggedX = 0;
        state.game.board.squares[index].draggedY = 0;
        state.game.board.squares[index].piece = action.piece;
        state.game.board.squares[index].piece.numberOfTimesMoved++
        return { ...state, ...{ game: state.game } };
    case SWITCH_TURN:
      state.game.switchTurns() 
      return { ...state, ...{game: state.game} };
    default:
      return state;
  }
};

import {
  FLIP_BOARD,
  DEFAULT_SCALE_PX,
  SET_SCALE,
  SET_SQAURE_TO_MOVE_TO,
  SET_SQAURE_TO_MOVE_FROM,
  SET_MOVE_SQUARES_TO_EMPTY_OBJECTS,
  UPDATE_DRAGGED_COORDINATES,
  MOVE_PIECE_TO_SQUARE,
  MAKE_SQUARE_EMPTY,
  SWITCH_TURN
} from "../assets/constants";

const getStartPiece = (x, y) => {
  switch (y) {
    case 0:
      switch (x) {
        case 0:
          return "rd";
        case 1:
          return "nd";
        case 2:
          return "bd";
        case 3:
          return "qd";
        case 4:
          return "kd";
        case 5:
          return "bd";
        case 6:
          return "nd";
        case 7:
          return "rd";
        default:
          return "";
      }

    case 1:
      return "pd";

    case 6:
      return "pl";

    case 7:
      switch (x) {
        case 0:
          return "rl";
        case 1:
          return "nl";
        case 2:
          return "bl";
        case 3:
          return "ql";
        case 4:
          return "kl";
        case 5:
          return "bl";
        case 6:
          return "nl";
        case 7:
          return "rl";

        default:
          return "";
      }
    default:
      return null;
  }
};

function Square(x, y, piece, isWhite) {
  this.x = x;
  this.y = y;
  this.piece = getStartPiece(x, y);
  this.isWhite = isWhite || false;
  this.isLast = x === 7;
  this.column = String.fromCharCode(x + 65);
  this.code = String.fromCharCode(x + 65) + (8 - y);
  this.draggedX = 0;
  this.draggedY = 0;
}

let board = [];

for (let i = 0; i < 64; i++) {
  board.push(
    new Square(
      i % 8,
      Math.floor(i / 8),
      null,
      Math.floor(i / 8) % 2 === 0 ? i % 2 === 0 : i % 2 !== 0
    )
  );
}

export const defaultState = {
  whiteTurn: true,
  board: board,
  whiteOnTop: true,
  scale: DEFAULT_SCALE_PX,
  squareToMoveTo: {},
  squareToMoveFrom: {}
};

export const formReducer = (state, action) => {

  let oldBoard;
  let newBoard;
  let index;

  switch (action.type) {
    case FLIP_BOARD:
      console.log(FLIP_BOARD);
      oldBoard = [...state.board];
      newBoard = [];
      for (let i = 0; i < 64; i++) {
        newBoard.push({
          ...state.board[i],
          ...{ piece: oldBoard[63 - i].piece },
        });
      }
      console.log(newBoard);
      return { ...state, ...{ board: newBoard } };
    case SET_SCALE:
      return {
        ...state,
        ...{
          scale:
            action.scale > 30 && action.scale < 100
              ? action.scale
              : state.scale,
        },
      };
    case SET_SQAURE_TO_MOVE_TO:
      return { ...state, ...{ squareToMoveTo: action.squareToMoveTo } };
    case SET_SQAURE_TO_MOVE_FROM:
        return { ...state, ...{ squareToMoveFrom: action.squareToMoveFrom } };
    case SET_MOVE_SQUARES_TO_EMPTY_OBJECTS:
      return { ...state, ...{ squareToMoveTo: {}, squareToMoveFrom: {}} };
    case UPDATE_DRAGGED_COORDINATES:
      newBoard = [...state.board];
      index = newBoard.findIndex(square => {
        return square.x === action.x && square.y === action.y;
      });
      newBoard[index].draggedX = action.draggedX;
      newBoard[index].draggedY = action.draggedY;

      return { ...state, ...{ board: newBoard } };
    case MAKE_SQUARE_EMPTY:
        newBoard = [...state.board];
        index = newBoard.findIndex(square => {
          return square.x === action.x && square.y === action.y;
        });
        newBoard[index].draggedX = 0;
        newBoard[index].draggedY = 0;
        newBoard[index].piece = null;
        return { ...state, ...{ board: newBoard } };
    case MOVE_PIECE_TO_SQUARE:
        newBoard = [...state.board];
        index = newBoard.findIndex(square => {
          return square.x === action.x && square.y === action.y;
        });
        newBoard[index].draggedX = 0;
        newBoard[index].draggedY = 0;
        newBoard[index].piece = action.piece;
        return { ...state, ...{ board: newBoard } };
    case SWITCH_TURN:
      return { ...state, ...{whiteTurn: !state.whiteTurn} };
    default:
      return state;
  }
};

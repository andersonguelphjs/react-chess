import {
  FLIP_BOARD,
  SET_SCALE,
 // SET_SQAURE_TO_MOVE_TO,
  SET_POSSIBLE_SQUARES_TO_MOVE_TO,
  SET_MOVE_SQUARES_TO_EMPTY_OBJECTS,
  SET_CURRENT_MOVE,
  MOVE_PIECE_TO_SQUARE,
 // MAKE_SQUARE_EMPTY,
 // SWITCH_MOVE,
  DEFAULT_SCALE_PX,
 // SET_IS_KING_IN_CHECK,
} from "../assets/constants";
import {
  getStartSquares,
  isKingInCheckAfterMove,
  isPlayerCheckMated,
} from "../assets/utilities";

export const defaultState = {
  // squareToMoveTo: {},
  // squareToMoveFrom: {},
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
    isCheckmate: false,
    turn: 0,
    totalMoves: 0,
    currentMove: 0,
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
  console.log("getPGNFromMove", square);
  const isPawn = action.piece.letter === "P";
  const isCapture = square.piece?.letter ? true : false;
  if (action.isCastle) return action.isCastle;
  if (isPawn) {
    if (isCapture) {
      return `${action.fromCode.substring(0, 1)}x${square.code}`;
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
  let newMove;
  let newMoveHistory;
  let isKingInCheck;
  let isCheckmate = false;
  let newTurn;
  let newTotalMoves;

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
    // case SET_SQAURE_TO_MOVE_TO:
    //   return { ...state, ...{ squareToMoveTo: action.squareToMoveTo } };
    case SET_MOVE_SQUARES_TO_EMPTY_OBJECTS:
      return {
        ...state,
        ...{
          // squareToMoveTo: {},
          // squareToMoveFrom: {},
          possibleSquaresToMoveTo: [],
        },
      };
    case SET_POSSIBLE_SQUARES_TO_MOVE_TO:
      return {
        ...state,
        ...{ possibleSquaresToMoveTo: action.possibleSquaresToMoveTo },
      };
    // case MAKE_SQUARE_EMPTY:
    //   index = state.board.squares.findIndex((square) => {
    //     return square.x === action.x && square.y === action.y;
    //   });
    //   newSquare = { ...state.board.squares[index] };
    //   newSquare.draggedX = 0;
    //   newSquare.draggedY = 0;
    //   newSquare.piece = null;
    //   newSquares = [...state.board.squares];
    //   newSquares[index] = newSquare;
    //   return {
    //     ...state,
    //     ...{ board: { ...state.board, ...{ squares: newSquares } } },
    //   };
    case MOVE_PIECE_TO_SQUARE:
      newTurn = state.game.whiteMove ? state.game.turn + 1 : state.game.turn;
      console.log("newTurn: " + newTurn);
      newSquares = [...state.board.squares];
      newMoveHistory = [...state.game.moveHistory];
      //console.log("moveArray", action.moveArr)
      action.moveArr.forEach((a) => {
        index = state.board.squares.findIndex((square) => {
          return square.x === a.x && square.y === a.y;
        });
        if (a.record) {
          newMove = {
            ...a,
            ...{
              turn: newTurn,
              move: state.game.whiteMove,
              pieceMoved: a.piece.letter,
              capturedPiece: state.board.squares[index]?.piece
                ? { ...state.board.squares[index].piece }
                : null,
              pgn: getPGNFromMove({
                action: a,
                square: state.board.squares[index],
              }),
            },
          };
        }
        newSquare = { ...state.board.squares[index] };
        console.log("a.piece.numberOfTimesMove", a.piece.numberOfTimesMoved);

        newSquare.draggedX = 0;
        newSquare.draggedY = 0;
        newSquare.piece = { ...a.piece };
        newSquare.piece.numberOfTimesMoved =
          newSquare.piece.numberOfTimesMoved + 1;
        newSquares[index] = newSquare;
        //empty 'from '
        const fromIndex = state.board.squares.findIndex((square) => {
          return square.x === a.fromX && square.y === a.fromY;
        });
        const fromSquare = { ...state.board.squares[fromIndex] };
        fromSquare.draggedX = 0;
        fromSquare.draggedY = 0;
        fromSquare.piece = null;
        newSquares[fromIndex] = fromSquare;
      });
      isKingInCheck = isKingInCheckAfterMove({
        hypotheticalBoard: newSquares,
        whiteMove: !state.game.whiteMove,
      });
      if (isKingInCheck) {
        isCheckmate = isPlayerCheckMated({
          hypotheticalBoard: newSquares,
          whiteMove: !state.game.whiteMove,
        });
      }
      if (isKingInCheck) newMove.pgn += "+";
      if (isCheckmate) newMove.pgn += "+";
      newMoveHistory.push(newMove);
      newTotalMoves = state.game.totalMoves + 1;
      return {
        ...state,
        ...{
          // squareToMoveTo: {},
          // squareToMoveFrom: {},
          possibleSquaresToMoveTo: [],
        },
        ...{
          game: {
            ...state.game,
            ...{
              moveHistory: newMoveHistory,
              whiteMove: !state.game.whiteMove,
              isKingInCheck: isKingInCheck,
              isCheckmate: isCheckmate,
              turn: newTurn,
              totalMoves: newTotalMoves,
              currentMove: newTotalMoves,
            },
          },
        },
        ...{ board: { ...state.board, ...{ squares: newSquares } } },
      };
    // case SWITCH_MOVE:
    //   //console.log(state);
    //   //console.log("whiteMove", state.game.whiteMove, !state.game.whiteMove);
    //   return {
    //     ...state,
    //     ...{ game: { ...state.game, ...{ whiteMove: !state.game.whiteMove } } },
    //   };
    // case SET_IS_KING_IN_CHECK:
    //   return {
    //     ...state,
    //     ...{
    //       game: { ...state.game, ...{ isKingInCheck: action.isKingInCheck } },
    //     },
    //   };
    case SET_CURRENT_MOVE:
      console.log(
        `going from ${state.game.currentMove} to ${action.currentMove} `
      );
      const currentMoveIndex = state.game.currentMove - 1;
      const actionMoveIndex = action.currentMove - 1;
      let tempBoard = {...state.board, ...{squares : [...state.board.squares]}}
     // console.log("tempBoard: ", tempBoard.squares)
      if (action.currentMove < state.game.currentMove) {
        console.log("going to go back ");
        for (let i = currentMoveIndex; i >= actionMoveIndex+1; i--) {
          console.log("processing back index: ", i, state.game.moveHistory[i]);
          //get the moveHistory at index i
          const move = {...state.game.moveHistory[i]}
          const movedPiece = {...move.piece}
          const capturedPiece = move.capturedPiece ? {...move.capturedPiece} : null;
          const fromSquare = tempBoard.squares.find(s => s.code === move.fromCode)
          const toSquare = tempBoard.squares.find(s => s.code === move.toCode)
          fromSquare.piece = movedPiece;
          if (capturedPiece) {
            toSquare.piece = capturedPiece;
          }
          else{
            toSquare.piece = null;
          }
          //put the piece to fromCode
          //if captured piece then put the captured piece in toCode
          if (i === -1) {
            console.log("at start", i);
            break;
          }
          if (i < -1) {
            console.log("fucked up", i);
            break;
          }
        }
      } else if (action.currentMove > state.game.currentMove) {
        console.log("going fwd");
        for (let i = currentMoveIndex + 1; i < actionMoveIndex + 1; i++) {
          console.log("processing fwd index: ", i);
          const move = {...state.game.moveHistory[i]}
          const movedPiece = {...move.piece}
          //const capturedPiece = move.capturedPiece ? {...move.capturedPiece} : null;
          const fromSquare = tempBoard.squares.find(s => s.code === move.fromCode);
          const toSquare = tempBoard.squares.find(s => s.code === move.toCode);
          toSquare.piece = movedPiece;
          fromSquare.piece = null;
          if (i > 200) {
            console.log("fucked up", i);
            break;
          }
        }
      } else {
        return { ...state, ...{board : {...state.board, ...{squares : tempBoard.squares}}} };
      }
      return {
        ...state,
        ...{ game: { ...state.game, ...{ currentMove: action.currentMove } } },
      };
    default:
      return { ...state };
  }
};

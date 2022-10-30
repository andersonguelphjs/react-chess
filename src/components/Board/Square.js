import React, { useContext } from "react";
import { ChessContext } from "../../store/chess-context";
import styles from "./Square.module.css";
import Pawn from "../Pieces/Pawn/Pawn";
import Knight from "../Pieces/Knight/Knight";
import Bishop from "../Pieces/Bishop/Bishop";
import Rook from "../Pieces/Rook/Rook";
import Queen from "../Pieces/Queen/Queen";
import King from "../Pieces/King/King";
import Draggable from "react-draggable";

import {
  SET_SQAURE_TO_MOVE_TO,
  SET_POSSIBLE_SQUARES_TO_MOVE_TO,
  SET_MOVE_SQUARES_TO_EMPTY_OBJECTS,
  MOVE_PIECE_TO_SQUARE,
} from "../../assets/constants";
import {
  getSquare,
  getPossibleSquaresToMoveTo,
  getHypotheticalBoard,
  isKingInCheckAfterMove,
} from "../../assets/utilities";

const getPiece = (i) => {
  switch (i) {
    case "Pd":
      return <Pawn isWhite={false} />;
    case "Pl":
      return <Pawn isWhite={true} />;
    case "Nd":
      return <Knight isWhite={false} />;
    case "Nl":
      return <Knight isWhite={true} />;
    case "Bd":
      return <Bishop isWhite={false} />;
    case "Bl":
      return <Bishop isWhite={true} />;
    case "Rd":
      return <Rook isWhite={false} />;
    case "Rl":
      return <Rook isWhite={true} />;
    case "Qd":
      return <Queen isWhite={false} />;
    case "Ql":
      return <Queen isWhite={true} />;
    case "Kd":
      return <King isWhite={false} />;
    case "Kl":
      return <King isWhite={true} />;
    default:
      return "";
  }
};

const Square = (props) => {
  const ctx = useContext(ChessContext);
  const {
    game,
    board,
    possibleSquaresToMoveTo,
    // squareToMoveFrom,
    // squareToMoveTo,
  } = ctx;
  const { squares } = ctx.board;
  const { isKingInCheck, currentMove, totalMoves } = ctx.game;
  const { x, y, code, draggedX, draggedY, isWhite, piece } = props.square;

  //console.log("square", props, isWhite, x, y, code, colorChar, column, rank, draggedX, draggedY, scale, piece, scale);
  const style = [
    styles.square,
    possibleSquaresToMoveTo?.length > 0 &&
    possibleSquaresToMoveTo.find((s) => s.code === code)
      ? styles.possibleSquare
      : isWhite
      ? styles.whiteSquare
       : styles.blackSquare
    // (squareToMoveFrom?.code && code === squareToMoveFrom?.code) ||
    // (squareToMoveTo?.code && code === squareToMoveTo?.code)
    //   ? styles.glowBorder
    //   : "",
  ];
  const nodeRef = React.useRef(null);

  const onStartEventHandler = (e, data) => {
    // if (
    //   !squareToMoveFrom.hasOwnProperty("code") ||
    //   squareToMoveFrom["code"] !== code
    // ) {
      let possibleSquaresToMoveTo = getPossibleSquaresToMoveTo({
        originSquare: props.square,
        squares: [...squares],
      });
      console.log(
        "isKingInCheck",
        isKingInCheck,
        possibleSquaresToMoveTo.map((ps) => ps.code).join(";")
      );
      const filteredPossibleSquaresToMoveTo = [...possibleSquaresToMoveTo];
      //console.log("before possibleSquaresToMoveTo ", possibleSquaresToMoveTo);
      if (isKingInCheck) {
        // console.log(
        //   "#possibleSquaresToMoveTo from:",
        //   possibleSquaresToMoveTo.length
        // );
        filteredPossibleSquaresToMoveTo.forEach((ps) => {
          const hypotheticalBoard = getHypotheticalBoard({
            x: ps.x,
            y: ps.y,
            piece: props.square.piece,
            fromX: props.square.x,
            fromY: props.square.y,
            squares: [...squares],
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
            hypotheticalBoard: hypotheticalBoard,
            whiteMove: game.whiteMove,
          });
          if (_isKingInCheck)
            possibleSquaresToMoveTo = possibleSquaresToMoveTo.filter(
              (pm) => pm.code !== ps.code
            );
          console.log("ps ", ps.code, _isKingInCheck);
        });
      }
      //console.log("after possibleSquaresToMoveTo ", possibleSquaresToMoveTo);
      ctx.dispatchAction({
        type: SET_POSSIBLE_SQUARES_TO_MOVE_TO,
        //squareToMoveFrom: props.square,
        possibleSquaresToMoveTo: [...possibleSquaresToMoveTo],
      });
   // }
  };

  const onStopEventHandler = (e, data) => {
    const squareToMoveTo = getSquare({
      data: data,
      x: x,
      y: y,
      squares: [...squares],
      board: board,
    });

    // ctx.dispatchAction({
    //   type: SET_SQAURE_TO_MOVE_TO,
    //   squareToMoveTo: squareToMoveTo ? squareToMoveTo : {},
    // });

    const squareIsNotPossible =
      squareToMoveTo &&
      !possibleSquaresToMoveTo.find(
        (p) => p.x === squareToMoveTo.x && p.y === squareToMoveTo.y
      );
    //console.log("doubleMove", doubleMove);
    //console.log("squareToMoveTo", squareToMoveTo);
    //console.log("squareIsNotPossible ", squareIsNotPossible);

    if (!squareToMoveTo || squareIsNotPossible) {
      ctx.dispatchAction({ type: SET_MOVE_SQUARES_TO_EMPTY_OBJECTS });
      return;
    }

    const castleQueenSideRook =
    props.square.piece.letter === "K" &&
      ((props.square.piece.isWhite &&
        props.square.code === "e1" &&
        squareToMoveTo.code === "c1") ||
        (!props.square.piece.isWhite &&
          props.square.code === "e8" &&
          squareToMoveTo.code === "c8"))
        ? props.square.piece.isWhite
          ? squares.find((s) => s.code === "a1")
          : squares.find((s) => s.code === "a8")
        : null;
    const castleKingSideRook =
      props.square.piece.letter === "K" &&
      ((props.square.piece.isWhite &&
        props.square.code === "e1" &&
        squareToMoveTo.code === "g1") ||
        (!props.square.piece.isWhite &&
          props.square.code === "e8" &&
          squareToMoveTo.code === "g8"))
        ? props.square.piece.isWhite
          ? squares.find((s) => s.code === "h1")
          : squares.find((s) => s.code === "h8")
        : null;

    const moveArr = [
      {
        x: squareToMoveTo.x,
        y: squareToMoveTo.y,
        fromX: props.square.x,
        fromY: props.square.y,
        piece: {...props.square.piece},
        record: !castleQueenSideRook && !castleKingSideRook,
        fromCode: props.square.code,
        toCode: squareToMoveTo.code,
        
      },
    ];

    if (castleQueenSideRook) {
      moveArr.push({
        x: 3,
        y: props.square.piece.isWhite ? 7 : 0,
        fromX: 0,
        fromY: props.square.piece.isWhite ? 7 : 0,
        piece: {...castleQueenSideRook.piece},
        record: true,
        isCastle: "O-O-O",
        fromCode: castleQueenSideRook.square.code,
        toCode: squares.find((s) => s.x === 0 && s.y=== (props.square.piece.isWhite ? 7 : 0)).code,
      });
    }

    if (castleKingSideRook) {
      moveArr.push({
        x: 5,
        y: props.square.piece.isWhite ? 7 : 0,
        fromX: 7,
        fromY: props.square.piece.isWhite ? 7 : 0,
        piece: {...castleKingSideRook.piece},
        record: true,
        isCastle: "O-O",
        fromCode: castleKingSideRook.square.code,
        toCode: squares.find((s) => s.x === 5 && s.y=== (props.square.piece.isWhite ? 7 : 0)).code,
      });
    }

    ctx.dispatchAction({
      type: MOVE_PIECE_TO_SQUARE,
      moveArr: moveArr,
    });
  };

  const onDragEventHandler = (e, data) => {
    const square = getSquare({
      data: data,
      x: x,
      y: y,
      squares: [...squares],
      board: board,
    });
    ctx.dispatchAction({
      type: SET_SQAURE_TO_MOVE_TO,
      squareToMoveTo: square ? square : {},
    });
  };

  let dynamicStyle = {
    width: board.scale + "px",
    height: board.scale + "px",
  };

  let square = "";

  if (piece) {
    const icon = getPiece(piece.code);
    square = (
      <Draggable
        nodeRef={nodeRef}
        defaultPosition={{ x: 0, y: 0 }}
        // onMouseDown={onMouseDownEventHandler}
        onStart={onStartEventHandler}
        onStop={onStopEventHandler}
        position={{ x: draggedX, y: draggedY }}
        onDrag={onDragEventHandler}
        disabled={
          (currentMove !== totalMoves) ||
          (piece.code.includes("l") && !game.whiteMove) ||
          (piece.code.includes("d") && game.whiteMove)
        }
      >
        <div ref={nodeRef}>{icon}</div>
      </Draggable>
    );
  }
  return (
    <div className={style.join(" ")} style={dynamicStyle}>
      {square}
    </div>
  );
};

export default Square;

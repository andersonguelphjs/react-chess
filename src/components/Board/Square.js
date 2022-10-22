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
  SET_SQUARES_TO_MOVE_FROM,
  SET_MOVE_SQUARES_TO_EMPTY_OBJECTS,
  SET_IS_KING_IN_CHECK,
  MOVE_PIECE_TO_SQUARE,
  MAKE_SQUARE_EMPTY,
  SWITCH_MOVE,
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
  
} from "../../assets/constants";

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
  const { game,board, possibleSquaresToMoveTo, squareToMoveFrom, squareToMoveTo } = ctx;
  const { squares } = ctx.board;
  const {
    x,
    y,
    code,
    draggedX,
    draggedY,
    isWhite,
    piece
  } = props.square;

  //console.log("square", props, isWhite, x, y, code, colorChar, column, rank, draggedX, draggedY, scale, piece, scale);
  const style = [
    styles.square,
    possibleSquaresToMoveTo?.length > 0 &&
    possibleSquaresToMoveTo.find((s) => s.code === code)
      ? styles.possibleSquare
      : isWhite
      ? styles.whiteSquare
      : styles.blackSquare,
    (squareToMoveFrom?.code && code === squareToMoveFrom?.code) ||
    (squareToMoveTo?.code && code === squareToMoveTo?.code)
      ? styles.glowBorder
      : "",
  ];
  const nodeRef = React.useRef(null);

  const getSquare = (data) => {
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
    ctx.dispatchAction({
      type: SET_SQAURE_TO_MOVE_TO,
      squareToMoveTo: newSquare ? newSquare : {},
    });
    return newSquare;
  };

  const onMouseDownEventHandler = (e, data) => {
    // console.log("MouseDowwn")
    // console.log({ e, data });
    // console.log(props);
  };

  const getPossibleSquare = (x, y) => {
    return squares.find((square) => square.x === x && square.y === y);
  };

  const isSquareOccupied = (square) => {
    return square.piece ? true : false;
  };

  const isCapturableSquare = (x, y, attackingColorIsWhite) => {
    const capturableSquare = getPossibleSquare(x, y);

    if (capturableSquare?.piece)
      return capturableSquare?.piece?.isWhite !== attackingColorIsWhite;
    return false;
  };

  const getXYSquares = (config = {}) => {
    const XYsquares = [];
    const { isPawn, x, y, isKing, isWhite, hasMoved } = config;
    if (isPawn) {
      if (isValidSquare(x, isWhite ? y - 1 : y + 1)) {
        const oneAhead = getPossibleSquare(x, isWhite ? y - 1 : y + 1);
        if (!isSquareOccupied(oneAhead)) {
          XYsquares.push(oneAhead);
          if (!hasMoved && isValidSquare(x, isWhite ? y - 2 : y + 2)) {
            const twoAhead = getPossibleSquare(x, isWhite ? y - 2 : y + 2);
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
            const square = getPossibleSquare(deltaX, deltaY);
            if (!isSquareOccupied(square)) {
              XYsquares.push(square);
            } else {
              if (
                config.isOppositeKingCheck ||
                isCapturableSquare(deltaX, deltaY, isWhite)
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

  const getDiagonalSquares = (config = {}) => {
    let diagonalSquares = [];
    const { x, y, isPawn, isKing, isWhite } = config;
    if (isPawn) {
      const topLeftCaptureSqaureX = x - 1;
      const captureSqaureY = isWhite ? y - 1 : y + 1;
      if (
        isValidSquare(topLeftCaptureSqaureX, captureSqaureY) &&
        (config.isOppositeKingCheck ||
          isCapturableSquare(topLeftCaptureSqaureX, captureSqaureY, isWhite))
      ) {
        diagonalSquares.push(
          getPossibleSquare(topLeftCaptureSqaureX, captureSqaureY)
        );
      }
      const topRightCaptureSqaureX = x + 1;
      if (
        isValidSquare(topRightCaptureSqaureX, captureSqaureY) &&
        (config.isOppositeKingCheck ||
          isCapturableSquare(topRightCaptureSqaureX, captureSqaureY, isWhite))
      ) {
        diagonalSquares.push(
          getPossibleSquare(topRightCaptureSqaureX, captureSqaureY)
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
            const square = getPossibleSquare(deltaX, deltaY);
            if (!isSquareOccupied(square)) {
              diagonalSquares.push(square);
            } else {
              if (
                config.isOppositeKingCheck ||
                isCapturableSquare(deltaX, deltaY, isWhite)
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

  const getKnightSquares = (config = {}) => {
    let knightMoves = [];
    const { x, y, isWhite } = config;
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
        const square = getPossibleSquare(c[0], c[1]);
        if (
          config.isOppositeKingCheck ||
          isCapturableSquare(c[0], c[1], isWhite) ||
          !isSquareOccupied(square)
        )
          knightMoves.push(square);
      }
    });
    // if (isValidSquare(config.x - 1, config.y - 2))
    //   knightMoves.push(getPossibleSquare(config.x - 1, config.y - 2));
    // if (isValidSquare(config.x + 1, config.y - 2))
    //   knightMoves.push(getPossibleSquare(config.x + 1, config.y - 2));

    // if (isValidSquare(config.x + 2, config.y - 2))
    //   knightMoves.push(getPossibleSquare(config.x + 2, config.y - 1));
    // if (isValidSquare(config.x + 2, config.y + 1))
    //   knightMoves.push(getPossibleSquare(config.x + 2, config.y + 1));

    // if (isValidSquare(config.x + 1, config.y + 2))
    //   knightMoves.push(getPossibleSquare(config.x + 1, config.y + 2));
    // if (isValidSquare(config.x - 1, config.y + 2))
    //   knightMoves.push(getPossibleSquare(config.x - 1, config.y + 2));

    // if (isValidSquare(config.x - 2, config.y + 1))
    //   knightMoves.push(getPossibleSquare(config.x - 2, config.y + 1));
    // if (isValidSquare(config.x - 2, config.y - 1))
    //   knightMoves.push(getPossibleSquare(config.x - 2, config.y - 1));

    return knightMoves;
  };

  const getCastlingSquares = (originSquare, squaresOppositionCanAttack) => {

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
      queenSideRook?.piece.letter !== "R" ||
      queenSideRook?.piece.numberOfTimesMoved > 0;
    const queenSideCastleSquareIsChecked =
      squaresOppositionCanAttack.filter(
        (s) => s.code === queenSideCastleSquare.code
      ).length > 0;
    const queenSideIntervalIsChecked =
      queenSideInterval.filter(
        (qsi) =>
          squaresOppositionCanAttack.filter((s) => s.code === qsi.code).length >
          0
      ).length > 0;
    const queenSideIntervalIsEmpty =
      queenSideInterval.filter((qsi) => isSquareOccupied(qsi)).length === 0;

    const kingSideRookIsMoved =
      kingSideRook?.piece.letter !== "R" ||
      kingSideRook?.piece.numberOfTimesMoved > 0;
    const kingSideCastleSquareIsChecked =
      squaresOppositionCanAttack.filter(
        (s) => s.code === kingSideCastleSquare.code
      ).length > 0;
    const kingSideIntervalIsChecked =
      kingSideInterval.filter(
        (ksi) =>
          squaresOppositionCanAttack.filter((s) => s.code === ksi.code).length >
          0
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

  const getEnPassantSquares = (config = {}) => {};

  const getPawnMoves = (originSquare, isOppositeKingCheck) => {
    let possibleSquares = [];
    const { piece, x, y } = originSquare;
    const config = {
      isPawn: true,
      hasMoved: piece.numberOfTimesMoved > 0,
      x: x,
      y: y,
      isWhite: piece.isWhite,
      isOppositeKingCheck: isOppositeKingCheck,
    };
    const XYsquares = !isOppositeKingCheck && getXYSquares(config);

    possibleSquares = possibleSquares.concat(XYsquares);
    const diagonalSquares = getDiagonalSquares(config);
    possibleSquares = possibleSquares.concat(diagonalSquares);

    return possibleSquares;
  };

  const getRookMoves = (originSquare, isOppositeKingCheck) => {
    let possibleSquares = [];
    const { x, y, piece } = originSquare;
    const config = {
      hasMoved: piece.numberOfTimesMoved > 0,
      x: x,
      y: y,
      isWhite: piece.isWhite,
      isOppositeKingCheck: isOppositeKingCheck,
    };
    const XYsquares = getXYSquares(config);

    possibleSquares = possibleSquares.concat(XYsquares);

    return possibleSquares;
  };

  const getKnightMoves = (originSquare, isOppositeKingCheck) => {
    const { x, y, piece } = originSquare;
    const config = {
      x: x,
      y: y,
      isWhite: piece.isWhite,
      isOppositeKingCheck: isOppositeKingCheck,
    };

    return getKnightSquares(config);
  };

  const getBishopMoves = (originSquare, isOppositeKingCheck) => {
    let possibleSquares = [];
    const { x, y, piece } = originSquare;
    const config = {
      x: x,
      y: y,
      isWhite: piece.isWhite,
      isOppositeKingCheck: isOppositeKingCheck,
    };

    const diagonalSquares = getDiagonalSquares(config);
    possibleSquares = possibleSquares.concat(diagonalSquares);

    return possibleSquares;
  };

  const getQueenMoves = (originSquare, isOppositeKingCheck) => {
    let possibleSquares = [];
    const { x, y, piece } = originSquare;
    const config = {
      x: x,
      y: y,
      isWhite: piece.isWhite,
      isOppositeKingCheck: isOppositeKingCheck,
    };
    const XYsquares = getXYSquares(config);

    possibleSquares = possibleSquares.concat(XYsquares);
    const diagonalSquares = getDiagonalSquares(config);
    possibleSquares = possibleSquares.concat(diagonalSquares);

    return possibleSquares;
  };

  const getSquaresOppositionCanAttack = (isWhite) => {
    console.log("getSquaresOppositionCanAttack", isWhite);
    
    let opponentSquares = squares.filter(
      (s) => s.piece && s.piece?.isWhite === !isWhite
    );
    console.log("opponentSquares ", opponentSquares.map(os => os.code).join(";"));
    let allPossibleAttacks = [];
    let uniqueSquares = [];
    opponentSquares.forEach(
      (s) =>
        (allPossibleAttacks = allPossibleAttacks.concat(
          getPossibleSquaresToMoveTo(s, true)
        ))
    );
    opponentSquares.forEach((s) => {
      if (!uniqueSquares.find((u) => u.code === s.code)) {
        uniqueSquares.push(s);
      }
    });

    //console.log("uniqueSquares", uniqueSquares);
    return uniqueSquares;
  };

  const getKingMoves = (originSquare, isOppositeKingCheck) => {
    let possibleSquares = [];
    const { x, y, piece } = originSquare;
    const config = {
      isKing: true,
      x: x,
      y: y,
      isWhite: piece.isWhite,
      isOppositeKingCheck: isOppositeKingCheck,
    };

    const XYsquares = getXYSquares(config);

    possibleSquares = possibleSquares.concat(XYsquares);
    const diagonalSquares = getDiagonalSquares(config);
    possibleSquares = possibleSquares.concat(diagonalSquares);
    const squaresOppositionCanAttack =
      !isOppositeKingCheck && getSquaresOppositionCanAttack(piece.isWhite);

    const castlingSquares =
      piece.numberOfTimesMoved === 0 &&
      !isOppositeKingCheck &&
      getCastlingSquares(originSquare, squaresOppositionCanAttack);
    possibleSquares = possibleSquares.concat(castlingSquares);
  
    if (squaresOppositionCanAttack)
      possibleSquares = possibleSquares.filter(
        (p) => !squaresOppositionCanAttack.find((s) => p.code === s.code)
      );

    return possibleSquares;
  };

  const isValidSquare = (x, y) => {
    return x >= 0 && y >= 0 && x <= 7 && y <= 7;
  };

  const getPossibleSquaresToMoveTo = (
    originSquare,
    isOppositeKingCheck = false
  ) => {
    const pieceName = originSquare?.piece?.constructor?.name;
    if (!pieceName) return [];
    switch (originSquare.piece.constructor.name) {
      case PAWN:
        return getPawnMoves(originSquare, isOppositeKingCheck);
      case ROOK:
        return getRookMoves(originSquare, isOppositeKingCheck);
      case KNIGHT:
        return getKnightMoves(originSquare, isOppositeKingCheck);
      case BISHOP:
        return getBishopMoves(originSquare, isOppositeKingCheck);
      case QUEEN:
        return getQueenMoves(originSquare, isOppositeKingCheck);
      case KING:
        return getKingMoves(originSquare, isOppositeKingCheck);
      default:
        return [];
    }
    //if (square.)
  };

  const onStartEventHandler = (e, data) => {
    if (
      !squareToMoveFrom.hasOwnProperty("code") ||
      squareToMoveFrom["code"] !== code
    ) {
      const possibleSquaresToMoveTo = getPossibleSquaresToMoveTo(props.square);

      ctx.dispatchAction({
        type: SET_SQUARES_TO_MOVE_FROM,
        squareToMoveFrom: props.square,
        possibleSquaresToMoveTo: possibleSquaresToMoveTo,
      });
    }
  };

  const onStopEventHandler = (e, data) => {

    
    const squareToMoveTo = getSquare({
      x: data.x,
      y: data.y,
    });

   // const doubleMove = (game.whiteMove && squareToMoveFrom.piece.code.substring(1,2) === 'd') || (!game.whiteMove && squareToMoveFrom.piece.code.substring(1,2) === 'l')
    const squareIsNotPossible = squareToMoveTo && !possibleSquaresToMoveTo.find(
      (p) => p.x === squareToMoveTo.x && p.y === squareToMoveTo.y
    )
    //console.log("doubleMove", doubleMove);
    console.log("squareToMoveTo", squareToMoveTo);
    console.log("squareIsNotPossible ", squareIsNotPossible)

    if (
      !squareToMoveTo ||
      squareIsNotPossible )
     {
      ctx.dispatchAction({ type: SET_MOVE_SQUARES_TO_EMPTY_OBJECTS });
      // if (doubleMove)  ctx.dispatchAction({ type: SWITCH_MOVE });
      return;
    }
    //console.log("jere")
    const castleQueenSideRook =
      squareToMoveFrom.piece.letter === "K" &&
      ((squareToMoveFrom.piece.isWhite &&
        squareToMoveFrom.code === "e1" &&
        squareToMoveTo.code === "c1") ||
        (!squareToMoveFrom.piece.isWhite &&
          squareToMoveFrom.code === "e8" &&
          squareToMoveTo.code === "c8"))
        ? squareToMoveFrom.piece.isWhite
          ? squares.find((s) => s.code === "a1")
          : squares.find((s) => s.code === "a8")
        : null;
    const castleKingSideRook =
      squareToMoveFrom.piece.letter === "K" &&
      ((squareToMoveFrom.piece.isWhite &&
        squareToMoveFrom.code === "e1" &&
        squareToMoveTo.code === "g1") ||
        (!squareToMoveFrom.piece.isWhite &&
          squareToMoveFrom.code === "e8" &&
          squareToMoveTo.code === "g8"))
        ? squareToMoveFrom.piece.isWhite
          ? squares.find((s) => s.code === "h1")
          : squares.find((s) => s.code === "h8")
        : null;
    
    ctx.dispatchAction({
      type: MOVE_PIECE_TO_SQUARE,
      x: squareToMoveTo.x,
      y: squareToMoveTo.y,
      piece: squareToMoveFrom.piece,
      record:true,
      fromSquareCode: squareToMoveFrom.code,
      isCastle: castleQueenSideRook ? "O-O-O" : castleKingSideRook ? "O-O" : ""
    });

    ctx.dispatchAction({
      type: MAKE_SQUARE_EMPTY,
      x: squareToMoveFrom.x,
      y: squareToMoveFrom.y,
    });

    if (castleQueenSideRook) {
      ctx.dispatchAction({
        type: MOVE_PIECE_TO_SQUARE,
        x: 3,
        y: squareToMoveFrom.piece.isWhite ? 7 : 0,
        piece: castleQueenSideRook.piece,
        record:true,
        isCastle: "O-O-O"
      });
      ctx.dispatchAction({
        type: MAKE_SQUARE_EMPTY,
        x: 0,
        y: squareToMoveFrom.piece.isWhite ? 7 : 0,
      });
    }

    if (castleKingSideRook) {
      ctx.dispatchAction({
        type: MOVE_PIECE_TO_SQUARE,
        x: 5,
        y: squareToMoveFrom.piece.isWhite ? 7 : 0,
        piece: castleKingSideRook.piece,
        record:true,
        isCastle: "O-O"
      });
      ctx.dispatchAction({
        type: MAKE_SQUARE_EMPTY,
        x: 7,
        y: squareToMoveFrom.piece.isWhite ? 7 : 0,
      });
    }

    
    const newState = ctx.dispatchAction({ type: SET_MOVE_SQUARES_TO_EMPTY_OBJECTS });
    console.log("newState", newState);
    ctx.dispatchAction({ type: SWITCH_MOVE });
  };

  const onDragEventHandler = (e, data) => {
    const square = getSquare({
      x: data.x,
      y: data.y,
    });
  };

  let dynamicStyle = {
    width: board.scale + "px",
    height: board.scale + "px",
  };

  if (
    props.x === squareToMoveFrom.x &&
    props.y === squareToMoveFrom.y
  ) {
    //dynamicStyle.backGroundColor = ""}
  }

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

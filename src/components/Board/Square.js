import styles from "./Square.module.css";
import React, { useContext } from "react";
import Pawn from "../pieces/pawn/pawn";
import Knight from "../pieces/knight/knight";
import Bishop from "../pieces/bishop/bishop";
import Rook from "../pieces/Rook/Rook";
import Queen from "../pieces/Queen/Queen";
import King from "../pieces/King/King";
import Draggable from "react-draggable";
import { ChessContext } from "../../store/chess-context";
import {
  SET_SQAURE_TO_MOVE_TO,
  SET_SQUARES_TO_MOVE_FROM,
  SET_MOVE_SQUARES_TO_EMPTY_OBJECTS,
  SET_POSSIBLE_SQUARES_TO_MOVE_TO,
  MOVE_PIECE_TO_SQUARE,
  MAKE_SQUARE_EMPTY,
  SWITCH_TURN,
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
} from "../../assets/constants";

const getPiece = (i) => {
  switch (i) {
    case "pd":
      return <Pawn isWhite={false} />;
    case "pl":
      return <Pawn isWhite={true} />;
    case "nd":
      return <Knight isWhite={false} />;
    case "nl":
      return <Knight isWhite={true} />;
    case "bd":
      return <Bishop isWhite={false} />;
    case "bl":
      return <Bishop isWhite={true} />;
    case "rd":
      return <Rook isWhite={false} />;
    case "rl":
      return <Rook isWhite={true} />;
    case "qd":
      return <Queen isWhite={false} />;
    case "ql":
      return <Queen isWhite={true} />;
    case "kd":
      return <King isWhite={false} />;
    case "kl":
      return <King isWhite={true} />;
    default:
      return "";
  }
};

const Square = (props) => {
  const ctx = useContext(ChessContext);
  const { board } = ctx.game;
  const { squares } = ctx.game.board;
  const {
    x,
    y,
    code,
    colorChar,
    column,
    rank,
    draggedX,
    draggedY,
    isWhite,
    piece,
    scale,
  } = props.square;

  //console.log("square", props, isWhite, x, y, code, colorChar, column, rank, draggedX, draggedY, scale, piece, scale);
  const style = [
    styles.square,
    ctx?.possibleSquaresToMoveTo?.length > 0 &&
    ctx.possibleSquaresToMoveTo.find((s) => s.code === code)
      ? styles.possibleSquare
      : isWhite
      ? styles.whiteSquare
      : styles.blackSquare,
    (ctx.squareToMoveFrom?.code && code === ctx.squareToMoveFrom?.code) ||
    (ctx.squareToMoveTo?.code && code === ctx.squareToMoveTo?.code)
      ? styles.glowBorder
      : "",
  ];
  const nodeRef = React.useRef(null);

  const getSquare = (data) => {
    data.x = board.flipped ? data.x * -1 : data.x;
    data.y = board.flipped ? data.y * -1 : data.y;
    const movedXSquares = Math.round(data.x / board.scale);
    const movedYSquares = Math.round(data.y / board.scale);
    console.log("getSquare", ctx);
    let newSquare;
    if (
      (Math.abs(movedXSquares) || Math.abs(movedYSquares)) > 0 &&
      y + movedYSquares > -1 &&
      y + movedYSquares < 8 &&
      x + movedXSquares > -1 &&
      x + movedXSquares < 8
    ) {
      const xCoordinate = x + movedXSquares;
      const yCoordinate = y + movedYSquares;
      newSquare = squares.find(
        (square) => square.x === xCoordinate && square.y === yCoordinate
      );
      console.log("new square: ", newSquare);
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
    console.log(
      "get possible square: ",
      x,
      y,
      squares.find((square) => square.x === x && square.y === y)
    );
    return squares.find((square) => square.x === x && square.y === y);
  };
  const isSquareOccupied = (square) => {
    return square.piece ? true : false;
  };
  const isCapturableSquare = (x, y, attackingColorIsWhite) => {
    const capturableSquare = getPossibleSquare(x, y);
    console.log(
      "capturableSquare",
      capturableSquare,
      attackingColorIsWhite,
      capturableSquare?.piece?.isWhite !== attackingColorIsWhite
    );
    if (capturableSquare?.piece)
      return capturableSquare?.piece?.isWhite !== attackingColorIsWhite;
    return false;
  };
  const getXYSquares = (config = {}) => {
    console.log("getXYSquares", config);
    const XYsquares = [];
    const { isPawn, x, y, isKing, isWhite, hasMoved } = config;
    if (isPawn) {
      if (isValidSquare(x, isWhite ? y - 1 : y + 1)) {
        const oneAhead = getPossibleSquare(x, isWhite ? y - 1 : y + 1);
        if (!isSquareOccupied(oneAhead)) XYsquares.push(oneAhead);
      }
      if (!hasMoved && isValidSquare(x, isWhite ? y - 2 : y + 2)) {
        const twoAhead = getPossibleSquare(x, isWhite ? y - 2 : y + 2);
        if (!isSquareOccupied(twoAhead)) XYsquares.push(twoAhead);
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
        console.log(x, y);
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
              if (isCapturableSquare(deltaX, deltaY, isWhite)) {
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
    console.log("XYsquares", XYsquares);
    return XYsquares;
  };

  const getDiagonalSquares = (config = {}) => {
    console.log("getDiagonalSquares", config);
    let diagonalSquares = [];
    const { x, y, isPawn, isKing, isWhite } = config;
    if (isPawn) {
      const topLeftCaptureSqaureX = x - 1;
      const captureSqaureY = isWhite ? y - 1 : y + 1;
      if (
        isValidSquare(topLeftCaptureSqaureX, captureSqaureY) &&
        isCapturableSquare(topLeftCaptureSqaureX, captureSqaureY, isWhite)
      ) {
        diagonalSquares.push(
          getPossibleSquare(topLeftCaptureSqaureX, captureSqaureY)
        );
      }
      const topRightCaptureSqaureX = x + 1;
      if (
        isValidSquare(topRightCaptureSqaureX, captureSqaureY) &&
        isCapturableSquare(topRightCaptureSqaureX, captureSqaureY, isWhite)
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
        console.log(x, y);
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
              if (isCapturableSquare(deltaX, deltaY, isWhite)) {
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
    console.log("diagonalSquares", diagonalSquares);
    return diagonalSquares;
  };

  const getKnightSquares = (config = {}) => {
    let knightMoves = [];
    const { x, y, isWhite } = config;
    const coordinates = [
      [x - 1, y - 2],
      [x + 1, y - 2],
      [x + 2, y - 2],
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

  const getCastlingSquares = (config = {}) => {};

  const getEnPassantSquares = (config = {}) => {};

  const getPawnMoves = (originSquare) => {
    let possibleSquares = [];
    const { piece, x, y } = originSquare;
    const config = {
      isPawn: true,
      hasMoved: piece.numberOfTimesMoved > 0,
      x: x,
      y: y,
      isWhite: piece.isWhite,
    };
    const XYsquares = getXYSquares(config);

    possibleSquares = possibleSquares.concat(XYsquares);
    const diagonalSquares = getDiagonalSquares(config);
    possibleSquares = possibleSquares.concat(diagonalSquares);

    return possibleSquares;
  };

  const getRookMoves = (originSquare) => {
    let possibleSquares = [];
    const { x, y, piece } = originSquare;
    const config = {
      hasMoved: piece.numberOfTimesMoved > 0,
      x: x,
      y: y,
      isWhite: piece.isWhite,
    };
    const XYsquares = getXYSquares(config);

    possibleSquares = possibleSquares.concat(XYsquares);

    return possibleSquares;
  };

  const getKnightMoves = (originSquare) => {

    const { x, y, piece } = originSquare;
    const config = {
      x: x,
      y: y,
      isWhite: piece.isWhite,
    };

    return getKnightSquares(config);
  };

  const getBishopMoves = (originSquare) => {

    let possibleSquares = [];
    const { x, y, piece } = originSquare;
    const config = {
      x: x,
      y: y,
      isWhite: piece.isWhite,
    };

    const diagonalSquares = getDiagonalSquares(config);
    possibleSquares = possibleSquares.concat(diagonalSquares);

    return possibleSquares;
  };

  const getQueenMoves = (originSquare) => {

    let possibleSquares = [];
    const { x, y, piece} = originSquare;
    const config = {
      x: x,
      y: y,
      isWhite: piece.isWhite,
    };
    const XYsquares = getXYSquares(config);

    possibleSquares = possibleSquares.concat(XYsquares);
    const diagonalSquares = getDiagonalSquares(config);
    possibleSquares = possibleSquares.concat(diagonalSquares);

    return possibleSquares;
  };

  const getKingMoves = (originSquare) => {

    let possibleSquares = [];
    const { x, y, piece} = originSquare;
    const config = {
      isKing: true,
      x: x,
      y: y,
      isWhite: piece.isWhite,
    };
    const XYsquares = getXYSquares(config);

    possibleSquares = possibleSquares.concat(XYsquares);
    const diagonalSquares = getDiagonalSquares(config);
    possibleSquares = possibleSquares.concat(diagonalSquares);

    return possibleSquares;
  };

  const isValidSquare = (x, y) => {
    return x >= 0 && y >= 0 && x <= 7 && y <= 7;
  };

  const getPossibleSquaresToMoveTo = (originSquare) => {
    console.log(
      "get possible squares to move",
      originSquare,
      originSquare.piece.constructor.name
    );
    const pieceName = originSquare?.piece?.constructor?.name;
    if (!pieceName) return [];
    switch (originSquare.piece.constructor.name) {
      case PAWN:
        return getPawnMoves(originSquare);
      case ROOK:
        return getRookMoves(originSquare);
      case KNIGHT:
        return getKnightMoves(originSquare);
      case BISHOP:
        return getBishopMoves(originSquare);
      case QUEEN:
        return getQueenMoves(originSquare);
      case KING:
        return getKingMoves(originSquare);
      default:
        return [];
    }
    //if (square.)
  };
  const onStartEventHandler = (e, data) => {
    //console.log("Start", ctx.squareToMoveFrom, code)
    if (
      !ctx.squareToMoveFrom.hasOwnProperty("code") ||
      ctx.squareToMoveFrom["code"] !== code
    ) {
      const possibleSquaresToMoveTo = getPossibleSquaresToMoveTo(props.square);
      console.log("done possibleSquaresToMoveTo", possibleSquaresToMoveTo);
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
    console.log("Stop", squareToMoveTo);

    if (!squareToMoveTo) {
      ctx.dispatchAction({ type: SET_MOVE_SQUARES_TO_EMPTY_OBJECTS });
      return;
    }
    ctx.dispatchAction({
      type: MOVE_PIECE_TO_SQUARE,
      x: squareToMoveTo.x,
      y: squareToMoveTo.y,
      piece: ctx.squareToMoveFrom.piece,
    });
    ctx.dispatchAction({
      type: MAKE_SQUARE_EMPTY,
      x: ctx.squareToMoveFrom.x,
      y: ctx.squareToMoveFrom.y,
    });
    ctx.dispatchAction({ type: SET_MOVE_SQUARES_TO_EMPTY_OBJECTS });
    ctx.dispatchAction({ type: SWITCH_TURN });
  };

  const onDragEventHandler = (e, data) => {
    const square = getSquare({
      x: data.x,
      y: data.y,
    });
    // if (square) console.log("current square", square);
  };

  let dynamicStyle = {
    width: board.scale + "px",
    height: board.scale + "px",
  };

  if (
    props.x === ctx.squareToMoveFrom.x &&
    props.y === ctx.squareToMoveFrom.y
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
          (piece.code.includes("l") && !ctx.game.whiteTurn) ||
          (piece.code.includes("d") && ctx.game.whiteTurn)
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

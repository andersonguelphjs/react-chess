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
import { SET_SQAURE_TO_MOVE_TO, SET_SQAURE_TO_MOVE_FROM, SET_MOVE_SQUARES_TO_EMPTY_OBJECTS, UPDATE_DRAGGED_COORDINATES, MOVE_PIECE_TO_SQUARE, MAKE_SQUARE_EMPTY, SWITCH_TURN } from "../../assets/constants";

const getPiece = (i) => {
  switch (i.piece) {
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
  console.log("square", props);
const ctx = useContext(ChessContext);

  const style = [
    styles.square,
    props.isWhite ? styles.whiteSquare : styles.blackSquare,
    (ctx.squareToMoveFrom.hasOwnProperty('code') && props.code === ctx.squareToMoveFrom.code) || (ctx.squareToMoveTo.hasOwnProperty('code') && props.code === ctx.squareToMoveTo.code) ? styles.glowBorder : ""
  ];
  const nodeRef = React.useRef(null);
  const getSquare = (data) =>{

    const movedXSquares = Math.round(data.x / ctx.scale);
    const movedYSquares = Math.round(data.y / ctx.scale);
    let newSquare;
    if ((Math.abs(movedXSquares) || Math.abs(movedYSquares)) > 0 && 
    (props.y + movedYSquares > -1 && props.y + movedYSquares < 8) && 
    (props.x + movedXSquares > -1 && props.x + movedXSquares < 8)){
      console.log("valid  move x y: ", movedXSquares, movedYSquares)
      const xCoordinate = props.x + movedXSquares;
      const yCoordinate = props.y + movedYSquares
      newSquare = ctx.board.find(square => square.x === xCoordinate && square.y === yCoordinate)
      console.log("new square: ", newSquare);
    }
    ctx.dispatchAction({
      type: SET_SQAURE_TO_MOVE_TO,
      squareToMoveTo: newSquare ? newSquare : {}
    });
    return newSquare;

  }
  const onMouseDownEventHandler = (e, data) => {
    
    console.log("MouseDowwn")
    console.log({ e, data });
    console.log(props);
  };
  const onStartEventHandler = (e, data) => {
    console.log("Start", ctx.squareToMoveFrom, props.code)
    if (!ctx.squareToMoveFrom.hasOwnProperty('code') || ctx.squareToMoveFrom['code'] !== props.code)
    ctx.dispatchAction({type: SET_SQAURE_TO_MOVE_FROM, squareToMoveFrom: props})
  };
  const onStopEventHandler = (e, data) => {
    
    const squareToMoveTo = getSquare({
      x : data.x,
      y : data.y,
    })
    console.log("Stop", squareToMoveTo);

    
    if (!squareToMoveTo) {

      ctx.dispatchAction({type: SET_MOVE_SQUARES_TO_EMPTY_OBJECTS})
     // ctx.dispatchAction({type: UPDATE_DRAGGED_COORDINATES, x: props.x, y: props.y, draggedX: 0, draggedY: 0})
      return
    }
    ctx.dispatchAction({type: MOVE_PIECE_TO_SQUARE, x: ctx.squareToMoveTo.x, y: ctx.squareToMoveTo.y, piece: ctx.squareToMoveFrom.piece});
    ctx.dispatchAction({type: MAKE_SQUARE_EMPTY, x: ctx.squareToMoveFrom.x, y: ctx.squareToMoveFrom.y});
    ctx.dispatchAction({type: SET_MOVE_SQUARES_TO_EMPTY_OBJECTS})
    ctx.dispatchAction({type: SWITCH_TURN})
    //ctx.dispatchAction({type: UPDATE_DRAGGED_COORDINATES, x: props.x, y: props.y, draggedX: data.x, draggedY: data.y})
  };
  const onDragEventHandler = (e, data) => {

    
    const square = getSquare({
      x : data.x,
      y : data.y,
    })
    if (square) console.log("current square", square);
  };

  const dynamicStyle = {
    "width" : ctx.scale+"px",
    "height" : ctx.scale+"px"
  }
  const piece = props.piece ? getPiece(props) : "";
  let square = "";
  if (piece) {
    square = (
      <Draggable
        nodeRef={nodeRef}
        defaultPosition={{ x: 0, y: 0 }}
        // onMouseDown={onMouseDownEventHandler}
        onStart={onStartEventHandler}
        onStop={onStopEventHandler}
        position={{ x: props.draggedX, y: props.draggedY }}
        onDrag={onDragEventHandler}
        disabled={(props.piece.includes("l") && !ctx.whiteTurn) || (props.piece.includes("d") && ctx.whiteTurn)}
      >
        <div ref={nodeRef} >{piece}</div>
      </Draggable>
    );
  }
  return <div className={style.join(" ")} style={dynamicStyle}>{square}</div>;
};

export default Square;

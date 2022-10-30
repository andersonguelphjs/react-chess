import { useCallback, useContext, useEffect, useState } from "react";
import { ChessContext } from "../../store/chess-context";
import { SET_CURRENT_MOVE } from "../../assets/constants";
import ButtonNav from "./ButtonNav/ButtonNav";

const MoveHistory = (props) => {
  const ctx = useContext(ChessContext);
  const { moveHistory, currentMove } = ctx.game;

  const changeCurrentMoveHandler = useCallback((currentMove) => {
    ctx.dispatchAction({ type :SET_CURRENT_MOVE, currentMove: currentMove});

  },[])
  //console.log("MoveHistory", moveHistory);
  // useEffect(() =>{
  //   changeCurrentMoveHandler(moveHistory.length)
  // }, [moveHistory, changeCurrentMoveHandler])
  const history = moveHistory.map((m, index) => (
    <div key={`${m.x}${m.y}${index}`}>
      x {m.x} y {m.y} piece {m.pieceMoved} turn:{m.turn} player:{" "}
      {m.move ? "white" : "black"} captured: {m.capturedPiece?.letter} pgn:{" "}
      {m.pgn}
    </div>
  ));
  const currentMoveDiv = currentMove ? (
    <pre>
      <code>{JSON.stringify(moveHistory[currentMove - 1],null, 4)}</code>
    </pre>
  ) : (
    ""
  );
  return (
    <div>
      {history}
      <ButtonNav changeCurrentMoveHandler={changeCurrentMoveHandler} currentMove={currentMove} moveHistory={moveHistory}/>
      {currentMoveDiv}
    </div>
  );
};

export default MoveHistory;

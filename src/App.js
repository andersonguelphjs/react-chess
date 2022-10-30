import React, { useContext } from "react";
import { ChessContext } from "./store/chess-context";
import "./App.css";
import Board from "./components/Board/Board";
import MoveHistory from "./components/MoveHistory/MoveHistory";

import { Alert, Button, Slider  } from "@mui/material";
import {
  FLIP_BOARD,
  MIN_SCALE,
  MAX_SCALE,
  SET_SCALE,
} from "./assets/constants";


const App = () => {
  const ctx = useContext(ChessContext);
  const { board } = ctx;
  const { whiteMove, isKingInCheck, isCheckmate, currentMove, totalMoves } = ctx.game;
  
  const flipBoardClickHandler = (e, data) => {
    ctx.dispatchAction({
      type: FLIP_BOARD,
    });
  };

  const handleScaleChange = (e) => {
    if (e.target.value < MIN_SCALE || e.target.value > MAX_SCALE) return;
    ctx.dispatchAction({
      type: SET_SCALE,
      scale: e.target.value,
    });
  };
  
  
  const checkNotice = isCheckmate ? <Alert variant="outlined" severity="info">
  {whiteMove ? "White" : "Black"} has been checkmated!
</Alert> : isKingInCheck ? <Alert variant="outlined" severity="info">
  {whiteMove ? "White" : "Black"} King is in check!
</Alert> : "";

const turnInfo = currentMove === totalMoves ? <div>TURN : {whiteMove ? "WHITE" : "BLACK"}</div> : <div>SHOWING TURN : {currentMove} of {totalMoves}</div>
  return (
    <React.Fragment>
      <Board></Board>
      <Button variant="outlined" onClick={flipBoardClickHandler}>
        FLIP BOARD
      </Button>
      <Button variant="outlined" onClick={() => console.log(board)}>
        Model
      </Button>
      <Slider
        aria-label="Volume"
        value={ctx.board.scale}
        onChange={handleScaleChange}
        min={MIN_SCALE}
        max={MAX_SCALE}
      />
      {turnInfo}
      <br/>
      {checkNotice}
      <MoveHistory />

    </React.Fragment>
  );
};

export default App;

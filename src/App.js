import React, { useContext } from "react";
import { ChessContext } from "./store/chess-context";
import "./App.css";
import Board from "./components/Board/Board";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MoveHistory from "./components/MoveHistory/MoveHistory";
import ButtonNav from "./components/ButtonNav/ButtonNav";
import {
  FLIP_BOARD,
  MIN_SCALE,
  MAX_SCALE,
  SET_SCALE,
} from "./assets/constants";
import Slider from "@mui/material/Slider";

const App = () => {
  const ctx = useContext(ChessContext);

  const clickHandler = (e, data) => {
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

  const squareToMoveFrom = ctx.squareToMoveTo.hasOwnProperty("code") && (
    <Chip label={`From: ${ctx.squareToMoveFrom.code}`} variant="outlined" />
  );
  const squareToMoveTo = ctx.squareToMoveTo.hasOwnProperty("code") && (
    <Chip label={`To: ${ctx.squareToMoveTo.code}`} variant="outlined" />
  );
  const { board } = ctx;
  const { whiteMove } = ctx.game;
  return (
    <React.Fragment>
      <Board></Board>
      <Button variant="outlined" onClick={clickHandler}>
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
      <div>TURN : {whiteMove ? "WHITE" : "BLACK"}</div>
      {squareToMoveFrom}
      <br />
      {squareToMoveTo}
      <MoveHistory />
      <ButtonNav />
    </React.Fragment>
  );
};

export default App;

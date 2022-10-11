import "./App.css";
import Board from "./components/Board/Board";
import { ChessContext } from "./store/chess-context";
import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
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

  const handleChange = (e) => {
    console.log("e", e);
    if (e.target.value < MIN_SCALE || e.target.value > MAX_SCALE) return;
    ctx.dispatchAction({
      type: SET_SCALE,
      scale: e.target.value,
    });
  };
  const squareToMoveFrom = ctx.squareToMoveTo.hasOwnProperty("code") && <Chip label={`From: ${ctx.squareToMoveFrom.code}`} variant="outlined" />;
  const squareToMoveTo = ctx.squareToMoveTo.hasOwnProperty("code") && <Chip label={`To: ${ctx.squareToMoveTo.code}`} variant="outlined" />;
  const {board, whiteTurn} = ctx.game
  return (
    <React.Fragment>
      <Board></Board>
      <Button variant="outlined" onClick={clickHandler} >FLIP BOARD</Button>
      <Button variant="outlined" onClick={()=> console.log(board)} >Model</Button>
      <Slider
        aria-label="Volume"
        value={ctx.game.board.scale}
        onChange={handleChange}
        min={MIN_SCALE}
        max={MAX_SCALE}
      />
      {squareToMoveFrom}<br/>
      {squareToMoveTo}
      <div>TURN : {whiteTurn ? "WHITE" : "BLACK"}</div>
    </React.Fragment>
  );
};

export default App;

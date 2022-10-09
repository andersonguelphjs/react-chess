import Square from "./Square";

import {ChessContext} from '../../store/chess-context'
import React, { useContext } from "react";

const Board =(props)=> {
  
  const ctx = useContext(ChessContext);
  const board = ctx.board.map(s => s.isLast ? <React.Fragment><Square key={`${s.x}_${s.y}`}{...s}/><br/></React.Fragment> : <Square key={`${s.x}_${s.y}`} {...s}/>)
  return board;
}
export default Board;

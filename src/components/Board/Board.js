import Square from "./Square";

import { ChessContext } from "../../store/chess-context";
import React, { useContext } from "react";

const Board = (props) => {
  const ctx = useContext(ChessContext);
  const { board } = ctx.game;
  const { squares } = ctx.game.board;

  const getFlippedBoard = () => {
    let flippedBoard = [];
    for (let i = 0; i < 64; i++) {
      flippedBoard.push(squares[63 - i]);
    }
    return flippedBoard;
  };

  const _squares = board.flipped ? getFlippedBoard() : squares;
  const _board = _squares.map((s, index) =>
    (!board.flipped && s.code.toLowerCase().includes("h")) ||
    (board.flipped && s.code.toLowerCase().includes("a")) ? (
      <React.Fragment key={s.code}>
        <Square square={s}/>
        <br />
      </React.Fragment>
    ) : (
      <Square key={s.code} square={s}/>
    )
  );
  return _board;
};
export default Board;

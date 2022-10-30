import React, { useContext } from "react";
import { ChessContext } from "../../store/chess-context";

import {
  getFlippedBoard,

} from "../../assets/utilities";
import Square from "./Square";

const Board = (props) => {
  const ctx = useContext(ChessContext);
  const { board, } = ctx;
  const { squares } = ctx.board;


  const _squares = board.flipped
    ? getFlippedBoard({ squares: [...squares] })
    : [...squares];

  const _board = _squares.map((s) =>
    (!board.flipped && s.code.toLowerCase().includes("h")) ||
    (board.flipped && s.code.toLowerCase().includes("a")) ? (
      <React.Fragment key={s.code}>
        <Square
          square={s}
        />
        <br />
      </React.Fragment>
    ) : (
      <Square
        key={s.code}
        square={s}
      />
    )
  );

  return _board;
};
export default Board;

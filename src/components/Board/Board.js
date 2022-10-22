import React, { useContext, useEffect } from "react";
import { ChessContext } from "../../store/chess-context";
import Square from "./Square";

const Board = (props) => {
  const ctx = useContext(ChessContext);
  const { board, game } = ctx;
  const { squares } = ctx.board;

  const getFlippedBoard = () => {
    let flippedBoard = [];
    for (let i = 0; i < 64; i++) {
      flippedBoard.push(squares[63 - i]);
    }
    return flippedBoard;
  };

  const _squares = board.flipped ? getFlippedBoard() : squares;
  const _board = _squares.map((s) =>
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
  useEffect(() => {

    const opposingKingSquare = squares.find(s => s.piece && s.piece.isWhite !== game.whiteMove && s.piece.letter === "K");
    //const newAttackedSquares = getSquaresOppositionCanAttack(opposingKingSquare.piece.isWhite);
   // const opposingKingIsAttacked = newAttackedSquares.filter(nas => nas.code === opposingKingSquare.code).length > 0;
    console.log("opposingKingSquare",opposingKingSquare);
    //console.log("newAttackedSquares", newAttackedSquares.map(n => n.code).join(";"));
   // console.log("opposingKingIsAttacked: " + opposingKingIsAttacked);

  },[game])
  return _board;
};
export default Board;

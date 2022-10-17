import { useContext } from "react";
import { ChessContext } from "../../store/chess-context";

const MoveHistory = (props) => {
    const ctx = useContext(ChessContext)
    const {moveHistory} = ctx.game

    const history = moveHistory.map((m, index)=> <div key={`${m.x}${m.y}${index}`}>x {m.x} y {m.y} piece {m.pieceMoved} turn:{m.turn}  player: {m.move ? "white" : "black"} captured: {m.capturedPiece} pgn: {m.pgn}</div>)
  return <div>{history}</div>;
};

export default MoveHistory;

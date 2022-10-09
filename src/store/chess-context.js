import { createContext } from "react";
import { DEFAULT_SCALE_PX } from "../assets/constants";

export const ChessContext = createContext({
  whiteTurn: true,
  board: [],
  scale: DEFAULT_SCALE_PX,
  squareToMoveTo: {},
  squareToMoveFrom: {}

});

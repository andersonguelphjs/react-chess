import { createContext } from "react";

export const ChessContext = createContext({
  squareToMoveTo: {},
  squareToMoveFrom: {},
  possibleSquaresToMoveTo:[],
  game: null

});

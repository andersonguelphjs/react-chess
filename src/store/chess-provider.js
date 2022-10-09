import { useReducer } from "react";
import { formReducer, defaultState } from "./form-reducer";
import { ChessContext } from "./chess-context";
import useWindowDimensions from "../hooks/use-window-dimensions";


export const ChessProvider = (props) => {
  const [appState, dispatch] = useReducer(formReducer, {
    ...defaultState
  });
  const { height, width } = useWindowDimensions();
  const chessContext = {...appState, 
    dispatchAction: dispatch,
  };

  return (
    <ChessContext.Provider value={chessContext}>
      {props.children}
    </ChessContext.Provider>
  );
};

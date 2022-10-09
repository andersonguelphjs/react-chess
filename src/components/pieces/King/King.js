import React from "react";
import { ReactComponent as WKingSVG } from "../../../../src/assets/svg/Chess_klt45.svg";
import { ReactComponent as BKingSVG } from "../../../../src/assets/svg/Chess_kdt45.svg"
const King = (props) => {
  const king = props.isWhite ? <WKingSVG /> : <BKingSVG />;

  return king
};
export default King;

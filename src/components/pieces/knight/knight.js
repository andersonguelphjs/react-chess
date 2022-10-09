import React from "react";
import { ReactComponent as WKnightSVG } from "../../../../src/assets/svg/Chess_nlt45.svg";
import { ReactComponent as BKnightSVG } from "../../../../src/assets/svg/Chess_ndt45.svg";
const  Knight = (props) => {
  const knight = props.isWhite ? <WKnightSVG /> : <BKnightSVG />;

  return knight
}
export default Knight;

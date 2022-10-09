import Draggable from "react-draggable";
import { ReactComponent as WPawnSVG } from "../../../../src/assets/svg/Chess_plt45.svg";
import { ReactComponent as BPawnSVG } from "../../../../src/assets/svg/Chess_pdt45.svg";

const Pawn = (props) => {
  const pawn = props.isWhite ? <WPawnSVG /> : <BPawnSVG />;
  return pawn;
};
export default Pawn;

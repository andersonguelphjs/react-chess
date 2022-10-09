import { ReactComponent as WRookSVG } from "../../../../src/assets/svg/Chess_rlt45.svg";
import { ReactComponent as BRookSVG } from "../../../../src/assets/svg/Chess_rdt45.svg";
const Rook = (props) => {
  const rook = props.isWhite ? <WRookSVG /> : <BRookSVG />;
  return rook;
};
export default Rook;

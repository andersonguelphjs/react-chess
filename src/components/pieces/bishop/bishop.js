
import { ReactComponent as WBishopSVG } from "../../../../src/assets/svg/Chess_blt45.svg";
import { ReactComponent as BBishopSVG } from "../../../../src/assets/svg/Chess_bdt45.svg";

const Bishop = (props) => {
  const bishop = props.isWhite ? <WBishopSVG /> : <BBishopSVG />;

   return bishop
};
export default Bishop;

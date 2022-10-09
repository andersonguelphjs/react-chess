import { ReactComponent as WQueenSVG } from "../../../../src/assets/svg/Chess_qlt45.svg";
import { ReactComponent as BQueenSVG } from "../../../../src/assets/svg/Chess_qdt45.svg";
const Queen = (props) => {
  const queen = props.isWhite ? <WQueenSVG /> : <BQueenSVG />;

  return queen;
};
export default Queen;

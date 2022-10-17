import { ButtonGroup, Button } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ButtonNav = (props) => {
  return (
    //color="disabled"
    <ButtonGroup variant="outlined" aria-label="outlined button group">
      <Button>
        <KeyboardDoubleArrowLeftIcon />
      </Button>
      <Button>
        <KeyboardArrowLeftIcon />
      </Button>
      <Button>
        <KeyboardArrowRightIcon />
      </Button>
      <Button>
        <KeyboardDoubleArrowRightIcon />
      </Button>
      <Button>
        <PlayArrowIcon />
      </Button>
      <Button>
        <KeyboardArrowUpIcon />
      </Button>
      <Button>
        <KeyboardArrowDownIcon />
      </Button>
    </ButtonGroup>
  );
};
export default ButtonNav;

import { useState } from "react";
import { ButtonGroup, Button } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
;

const ButtonNav = (props) => {

  const [isPlaying, setIsPlaying] = useState(false)
  //props.changeCurrentMoveHandler
  const goToStartHandler = ()=> {
    props.changeCurrentMoveHandler(0)
  }
  const goToEndtHandler = ()=> {
    props.changeCurrentMoveHandler(props.moveHistory.length)
  }
  const goForwardHandler = ()=> {
    props.changeCurrentMoveHandler(props.currentMove + 1)
  }
  const goBacktHandler = ()=> {
    props.changeCurrentMoveHandler(props.currentMove - 1)
  }
  const playPauseHandler = ()=> {
    setIsPlaying(!isPlaying)
  }
  const fasterHandler = ()=> {
    
  }
  const slowerHandler = ()=> {
    
  }
  return (
    //color="disabled"
    <ButtonGroup variant="outlined" aria-label="outlined button group">
      <Button onClick={goToStartHandler} disabled={props.currentMove === 0 ? true : false}>
        <KeyboardDoubleArrowLeftIcon />
      </Button>
      <Button onClick={goBacktHandler} disabled={props.currentMove === 0 ? true : false}>
        <KeyboardArrowLeftIcon />
      </Button>
      <Button onClick={goForwardHandler} disabled={(props.moveHistory.length ===0 || props.currentMove === props.moveHistory.length) ? true : false}>
        <KeyboardArrowRightIcon/>
      </Button>
      <Button onClick={goToEndtHandler} disabled={(props.moveHistory.length ===0 || props.currentMove === props.moveHistory.length) ? true : false}>
        <KeyboardDoubleArrowRightIcon />
      </Button>
      <Button onClick={playPauseHandler}>
        {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
      </Button>
      <Button onClick={fasterHandler}>
        <KeyboardArrowUpIcon />
      </Button>
      <Button onClick={slowerHandler}>
        <KeyboardArrowDownIcon />
      </Button>
    </ButtonGroup>
  );
};
export default ButtonNav;

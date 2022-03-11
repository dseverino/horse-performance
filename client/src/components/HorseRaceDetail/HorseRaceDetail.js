import React, { useState } from "react";

import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import FastForwardIcon from '@material-ui/icons/FastForward';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import ModalVideo from 'react-modal-video'
import "./HorseRaceDetail.css"
import MouseOverPopover from "../Popover/MouseOverPopover";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const HorseRaceDetail = props => {
  const classes = useStyles();
  const posObject = props.details.racePositions.positions
  const [state, setState] = useState({ anchorEl: null, full: false });
  const [commentsAnchorEl, setCommentsAnchorEl] = useState(null);

  var jockeyLastName = props.details.jockey.name.split(" ");
  jockeyLastName.shift();
  jockeyLastName.join(" ")
  var positions = [];
  if (posObject) {
    positions = Object.keys(posObject.slice(0, 3)).map((key, index) => {
      if (!posObject[key]) {
        return <div key={index}></div>
      }
      return <div key={key}>{posObject[key].name}-{posObject[key].by}</div>

    })
  }

  const handleClose = () => {
    setState({ anchorEl: null, full: true })
  };
  const open = Boolean(state.anchorEl);
  const openComments = Boolean(commentsAnchorEl);

  const id = open ? 'race-popover' : undefined;
  const handlePopoverOpen = (event) => {
    setCommentsAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setCommentsAnchorEl(null);
  };

  const getVideoId = (url) => {
    return url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("?"));
  }

  return (
    <div style={{ fontSize: 13, display: "flex", justifyContent: 'space-between', margin: '0px 5px' }}>
      <div style={{ display: 'flex', width: '16em', justifyContent: 'space-between' }}>
        <div style={{ width: '4.5em' }}>{props.date.replace(/\s+/g, '')}</div>
        <div style={{ width: '2em' }}>{props.days}</div>
        <div >{props.details.trackCondition}</div>
        <div >Hvc{props.details.raceNumber}</div>
        <div>{props.details.distance}</div>
        <div className="d-flex" style={{ width: '2em' }}>{props.details.finishTime.split(".")[0]}
          <div style={{ fontSize: '10px' }}>{props.details.finishTime.split(".")[1]}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '10%' }}>
        <div className="d-flex" style={{ width: '20%' }}>
          {props.details.times.quarterMile.split(".")[0]}<div style={{ fontSize: '10px' }}>{props.details.times.quarterMile.split(".")[1]}</div>
        </div>
        <div className="d-flex" style={{ width: '20%' }}>{props.details.times.halfMile.split(".")[0]}<div style={{ fontSize: '10px' }}>{props.details.times.halfMile.split(".")[1]}</div></div>
        <div className="d-flex" style={{ width: '30%' }}>{props.details.times.thirdQuarter?.split(".")[0]}<div style={{ fontSize: '10px' }}>{props.details.times.thirdQuarter?.split(".")[1]}</div></div>
        <div className="d-flex" style={{ width: '30%' }}>{props.details.times.finish.split(".")[0]}<div style={{ fontSize: '10px' }}>{props.details.times.finish.split(".")[1]}</div></div>
      </div>

      <div style={{ width: '5%' }}>
        {props.details.claiming}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '18%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '20px', justifyContent: 'space-between' }}>
          <div>{props.details.startingPosition}</div>
          <div>{props.details.positions.start}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '84%' }}>
          <div style={{ display: 'flex', width: '25px' }}><div>{props.details.positions.quarterMile}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.beatenLengths.quarterMile}</div></div>
          <div style={{ display: 'flex', width: '25px' }}><div>{props.details.positions.halfMile}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.beatenLengths.halfMile}</div></div>
          <div style={{ display: 'flex', width: '25px' }}><div>{props.details.positions.thirdQuarter}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.beatenLengths.thirdQuarter}</div></div>
          <div style={{ display: 'flex', width: '25px' }}><div>{props.details.positions.finish}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.beatenLengths.finish}</div></div>
          <div style={{ width: '72px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {
              props.details.raceUrl && (
                <div>
                  <IconButton aria-describedby={id} onClick={(e) => setState({ anchorEl: e.currentTarget, full: true })} style={{ padding: 0, height: "20px" }} size="small"><VideocamOutlinedIcon /> </IconButton>
                  <IconButton aria-describedby={id} onClick={(e) => setState({ anchorEl: e.currentTarget, full: false })} style={{ padding: 0, height: "20px" }} size="small"><FastForwardIcon /> </IconButton>
               
                  <ModalVideo channel='youtube' youtube={{ autoplay: 1, mute: 1, start: state.full ? props.details.raceUrl.split("=")[1] : props.details.finalStraightUrl.split("=")[1] }} isOpen={open}
                    videoId={getVideoId(props.details.raceUrl) }
                    onClose={handleClose}
                  >
                  </ModalVideo>
                </div>

              )
            }
            <div>
              {
                props.details.comments && (
                  <div
                    aria-owns={openComments ? 'mouse-over-popover-comments' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                    style={{ display: 'flex', width: '20px' }}
                  >
                    <i className="pi pi-comment" />
                  </div>
                )
              }
              <Popover
                id="mouse-over-popover-comments"
                className={classes.popover}
                classes={{
                  paper: classes.paper,
                }}
                modal="true"
                elevation={20}
                open={openComments}
                anchorEl={commentsAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <div>{props.details.comments}</div>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', width: '8%', justifyContent: 'space-between' }}>
        <div>
          {props.details.jockey.name[0] + " " + jockeyLastName}
        </div>
        <div>
          {props.details.jockeyWeight}
        </div>
      </div>

      <div style={{ display: 'flex', width: '10%', justifyContent: 'space-between' }}>
        <div style={{ width: '20%' }}>
          {props.details.horseMedications}
        </div>
        <div style={{ width: '50%' }}>
          {props.details.horseEquipments}
        </div>
        <div style={{ width: '30%' }}>
          {props.details.horseWeight}
        </div>
      </div>

      <div style={{ display: 'flex', width: '25%', position: 'relative' }}>
        <div style={{ width: '10%' }}>
          {props.details.bet}
        </div>
        <div className="d-flex" style={{ width: '85%' }}>
          {positions}
        </div>
        <div>
          <MouseOverPopover posObject={posObject}></MouseOverPopover>
        </div>
        <div style={{ width: '3%' }}>
          {props.details.totalHorses}
        </div>
      </div>
    </div>
  )
}

export default HorseRaceDetail;

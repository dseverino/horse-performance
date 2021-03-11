import React, { useState } from "react";

import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import FastForwardIcon from '@material-ui/icons/FastForward';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';

import { Galleria } from 'primereact/galleria';

import "./HorseRaceDetail.css"
import MouseOverPopover from "../Popover/MouseOverPopover";

const HorseRaceDetail = props => {
  const posObject = props.details.racePositions.positions
  const [state, setState] = useState({ anchorEl: null, full: false });
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

  const handleClick = (event) => {
    //setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setState({ anchorEl: null, full: true })
  };
  const open = Boolean(state.anchorEl);

  const id = open ? 'race-popover' : undefined;

  return (
    <div style={{ fontSize: 13, display: "flex", justifyContent: 'space-between', margin: '0px 5px' }}>
      <div style={{ display: 'flex', width: '12%', justifyContent: 'space-between' }}>
        <div style={{ width: '35%' }}>{props.date.replace(/\s+/g, '')}</div>
        <div style={{ width: '5%' }}>L</div>
        <div style={{ width: '10%' }}>{props.days}</div>
        <div style={{ width: '20%' }}>Hvc{props.details.raceNumber}</div>
        <div>{props.details.distance}</div>
        <div>{props.details.finishTime}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '10%' }}>
        <div>{props.details.times.quarterMile || ""}</div>
        <div>{props.details.times.halfMile}</div>
        <div>{props.details.times.thirdQuarter}</div>
        <div>{props.details.times.finish}</div>
      </div>

      <div style={{ width: '6%' }}>
        {props.details.claiming}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '15%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '20px', justifyContent: 'space-between' }}>
          <div>{props.details.startingPosition}</div>
          <div>{props.details.positions.start}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '80%' }}>
          <div style={{ display: 'flex' }}><div>{props.details.positions.quarterMile}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.quarterMile}</div></div>
          <div style={{ display: 'flex' }}><div>{props.details.positions.halfMile}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.halfMile}</div></div>
          <div style={{ display: 'flex' }}><div>{props.details.positions.thirdQuarter}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.thirdQuarter}</div></div>
          <div style={{ display: 'flex' }}><div>{props.details.positions.finish}</div><div style={{ fontSize: '10px', fontWeight: '600' }}>{props.details.lengths.finish}</div></div>
          <div>
            {
              props.details.raceUrl && (
                <div>
                  <IconButton aria-describedby={id} onClick={(e) => setState({ anchorEl: e.currentTarget, full: true })} style={{ padding: 0, height: "20px" }} size="small"><VideocamOutlinedIcon /> </IconButton>
                  <IconButton aria-describedby={id} onClick={(e) => setState({ anchorEl: e.currentTarget, full: false })} style={{ padding: 0, height: "20px" }} size="small"><FastForwardIcon /> </IconButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={state.anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    disableRestoreFocus
                    modal="true"
                    elevation={20}
                  >
                    <Typography style={{ padding: 2 }}>
                      <iframe width="853" height="480" title="myframe" src={state.full ? props.details.raceUrl : props.details.finalStraightUrl} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </Typography>
                  </Popover>
                </div>

              )
            }
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

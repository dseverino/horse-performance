import React from 'react';
import Popover from '@material-ui/core/Popover';
//import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

export default function MouseOverPopover(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  var positions = [];
  if (props.posObject) {
    positions = Object.keys(props.posObject.slice(0)).map((key, index) => {
      if (!props.posObject[key]) {
        return <div key={index}></div>
      }
      return <div style={{display: 'flex', justifyContent: "space-between", width: '300px'}} key={key}><div>{props.posObject[key].name}</div><div>{props.posObject[key].by}</div></div>

    })
  }

  return (
    <div>
      <div
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        style={{display: 'flex', width: '20px'}}
      >
        <i className="pi pi-list"/>
      </div>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        modal="true"
        elevation={20}
        open={open}
        anchorEl={anchorEl}
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
        <div>{positions}</div>
      </Popover>
    </div>
  );
}

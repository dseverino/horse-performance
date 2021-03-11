import React from "react";


import Slide from '@material-ui/core/Slide';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

//import "./Modal.css";

const Modal = props => {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    props.close()
  };
  React.useEffect(() => {
    setOpen(props.openDialog);
  }, [props.openDialog])

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.close}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          {/*<CreateStablePage />*/}
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
            </Button>
          <Button onClick={props.close} color="primary">
            Agree
            </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default Modal;

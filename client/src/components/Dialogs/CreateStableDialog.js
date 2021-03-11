import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import SnackbarSuccess from "../SnackBar/SnackBarSuccess";

class CreateStableDialog extends React.Component {

  state = {
    isLoading: false,
    stableCreated: false,
    stable: {
      name: ""
    }
  }

  componentDidMount = () => {
    console.log(this.props)
  }

  saveHandler = (event) => {

    this.props.load(true)
    var requestBody = {
      query: `
        mutation CreateStable($stable: StableInput) {
          createStable(stableInput: $stable) {
            _id
            name
            trainers {
              _id
              name
            }
          }
        }
      `,
      variables: {
        stable: this.state.stable
      }
    }

    fetch("api/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(result => {
        if (result.status !== 200 && result.status !== 201) {
          throw new Error("Failed")
        }
        return result.json()
      })
      .then(resData => {
        this.props.savedStable(resData.data.createStable);
        this.setState({stableCreated: true})
        this.props.load(false)
      })
      .catch(error => {
        console.log(error);
        this.props.load(false)
      })
  }

  onStableSnackBarClose = () => {
    this.setState({ stableCreated: false });
    this.props.close("stable") 
  }


  render() {

    return (
      <React.Fragment>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="lg"
          aria-labelledby="confirmation-dialog-title"
          open={true}
        >
          <DialogTitle id="confirmation-dialog-title">Create Stable</DialogTitle>
          <DialogContent dividers style={{ display: "flex" }}>
            <div style={{ margin: "0px 10px" }}>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input value={this.state.stable.name} onChange={(e) => this.setState({ stable: { name: e.target.value } })} className="form-control" id="name" style={{ width: "100%" }} label="Name" variant="outlined" />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.close("stable")} >
              Cancel
          </Button>
            <Button disabled={false} onClick={this.saveHandler} color="primary" >
              Save
          </Button>
          </DialogActions>
        </Dialog>

        <SnackbarSuccess
          open={this.state.stableCreated}
          onClose={this.onStableSnackBarClose}
          variant={"success"}
          message={`Stable ${this.state.stable.name} created!`}
          autoHideDuration={3000}
        >
        </SnackbarSuccess>
      </React.Fragment>

    )
  }
}

export default CreateStableDialog;
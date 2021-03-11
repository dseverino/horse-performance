import React, { Component } from "react";

//import { AuthContext } from "../../context/auth-context";
import Spinner from "../../components/Spinner/Spinner";
import SaveStableButton from "../../components/Buttons/SaveStableButton";
import StableInput from "../../components/TextFields/StableNameInput";
import SnackbarSuccess from "../../components/SnackBar/SnackBarSuccess";

import Button from '@material-ui/core/Button';

//import "../pages/Stables.css";

class CreateStablePage extends Component {
  //static contextType = AuthContext

  state = {
    isLoading: false,
    created: false,
    stable: {
      name: ""
    }
  }
  isActive = true;

  onHandleChange = (value) => {
    let newStable = Object.assign({}, this.state.stable)
    newStable["name"] = value
    this.setState({ stable: newStable })
  }

  onCancelHandler = (event) => {
    this.setState(prevState => {
      return { ...prevState, stable: { name: "" } }
    })
  }

  savedStable = (stable) => {
    this.setState({ created: true });
  }

  onValidateStable = (stable) => {
    if (stable) {
      this.setState({ stable: { name: "" } })
    }
  }

  onSnackBarClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ created: false, stable: { name: "" } });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <h3>
            Create Stable
          </h3>
        </div>
        <div>
          <StableInput id="name" validateStable={this.onValidateStable} change={this.onHandleChange} name={this.state.stable.name} />
          <Button onClick={this.onCancelHandler}>
            Cancel
          </Button>
          <SaveStableButton stable={this.state.stable} savedStable={this.savedStable}></SaveStableButton>
        </div>

        <SnackbarSuccess
          open={this.state.created}
          onClose={this.onSnackBarClose}
          message="Stable Created!"
          variant={"success"}
        >
        </SnackbarSuccess>

        {
          this.state.isLoading && <Spinner />
        }

      </React.Fragment >
    );
  }
}

export default CreateStablePage

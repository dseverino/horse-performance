import React, { Component } from "react";

import { AuthContext } from "../../context/auth-context";
import SnackbarSuccess from "../../components/SnackBar/SnackBarSuccess";
import Spinner from "../../components/Spinner/Spinner";
import TrainerInput from "../../components/TextFields/TrainerNameInput";
import SaveTrainerButton from "../../components/Buttons/SaveTrainerButton";

import Button from '@material-ui/core/Button';

class CreateTrainerPage extends Component {
  static contextType = AuthContext

  state = {
    isLoading: false,
    created: false,
    trainer: {
      name: ""
    }
  }

  modalCancelHandler = (event) => {
    this.setState({ created: false })
    this.setState({
      trainer: {
        name: ""
      }
    })
    document.getElementById("name").focus();
  }

  onCancelHandler = (event) => {
    this.setState(prevState => {
      return { ...prevState, trainer: { name: "" } }
    })
  }

  onHandleChange = (value) => {
    let newTrainer = Object.assign({}, this.state.trainer)
    newTrainer["name"] = value
    this.setState({ trainer: newTrainer })
  }

  saveHandler = (event) => {

    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation CreateTrainer($trainer: TrainerInput) {
          createTrainer(trainerInput: $trainer) {
            _id
            name
          }
        }
      `,
      variables: {
        trainer: this.state.trainer
      }
    }

    const token = this.context.token

    fetch("api/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Authorization": `Bearer ${token}`,
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
        this.setState((prevState) => {
          return { isLoading: false }
        })
        this.setState({ created: true })

      })
      .catch(error => {
        console.log(error);
      })
  }

  onValidateTrainer = (trainer) => {
    if (trainer) {
      this.setState({ trainer: { name: "" } })
    }
  }

  savedTrainer = (trainer) => {
    this.setState({ created: true });
  }

  onSnackBarClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ created: false, trainer: { name: "" } });
  }


  render() {
    return (
      <React.Fragment>
        <div>
          <h3>
            Create Trainer
          </h3>
        </div>
        <div>
          <TrainerInput   validateTrainer={this.onValidateTrainer} change={this.onHandleChange} name={this.state.trainer.name} />
          <Button onClick={this.onCancelHandler}>
            Cancel
          </Button>
          <SaveTrainerButton trainer={this.state.trainer} savedTrainer={this.savedTrainer} />
        </div>

        <SnackbarSuccess
          open={this.state.created}
          onClose={this.onSnackBarClose}
          message="Trainer Created!"
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

export default CreateTrainerPage

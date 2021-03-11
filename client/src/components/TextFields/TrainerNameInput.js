import React from "react"

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import Backdrop from "../Backdrop/Backdrop";
import Spinner from "../Spinner/Spinner";
import SnackbarSuccess from "../SnackBar/SnackBarSuccess";

const TrainerInput = props => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [trainer, setTrainer] = React.useState({ name: "" })
  const [exist, setExist] = React.useState(false);

  function onHandleChange(e) {
    setTrainer({ name: e.target.value })
    props.change(e.target.value)
  }

  function onSnackBarClose(e, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setExist(false);
  }

  function validateTrainer() {
    if (!props.name) {
      return false;
    }
    setIsLoading(true)
    const requestBody = {
      query: `
        query SingleTrainer($name: String!) {
          singleTrainer(name: $name) {
            name
          }
        }
      `,
      variables: {
        name: props.name
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
        if (resData && resData.data.singleTrainer) {
          props.validateTrainer(resData.data.singleTrainer)
          setTrainer( resData.data.singleTrainer.name )
          document.getElementById("name").focus();
          setExist(true)
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      })
  }

  return (
    <React.Fragment>
      <div style={{ margin: "20px 0px" }}>
        <InputLabel htmlFor="name">Name</InputLabel>
        <Input   onBlur={validateTrainer} value={props.name} onChange={onHandleChange} />
      </div>

      {
        isLoading &&
        (
          <React.Fragment>
            <Spinner />
            <Backdrop />
          </React.Fragment>
        )
      }
      
      <SnackbarSuccess
        open={exist}
        onClose={onSnackBarClose}
        message={`Trainer ${trainer} Exists!`}
        variant="warning"
      >
      </SnackbarSuccess>
    </React.Fragment>
  )
}

export default TrainerInput;
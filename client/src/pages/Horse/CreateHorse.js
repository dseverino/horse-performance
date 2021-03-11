import React, { Component } from "react";

import { AuthContext } from "../../context/auth-context";

import SnackbarSuccess from "../../components/SnackBar/SnackBarSuccess";
import Backdrop from "../../components/Backdrop/Backdrop";
import Spinner from "../../components/Spinner/Spinner";
import SaveStableButton from "../../components/Buttons/SaveStableButton";
import StableInput from "../../components/TextFields/StableNameInput";
import HorseNameInput from "../../components/TextFields/HorseNameInput";
import SaveHorseButon from "../../components/Buttons/SaveHorseButton";

import DialogMaterial from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import AddIcon from '@material-ui/icons/Add';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

//import "../pages/Horses.css";

class CreateHorsePage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    horses: [],
    isLoading: false,
    exist: false,
    visible: false,
    createStable: false,
    saved: false,
    selectedStable: null,
    stables: [],
    stableSaved: false,
    stable: {
      name: ""
    },
    horse: {
      name: "",
      weight: "",
      age: 3,
      color: "Z",
      sex: "M",
      sire: "",
      dam: "",
      stable: "",
      bestTimes: {}
    }
  }

  componentDidMount() {
    this.loadStables();
  }

  loadStables() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          stables {
            _id
            name
          }
        }
      `
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
        if (resData && resData.data.stables) {
          this.setState({ stables: resData.data.stables, isLoading: false })
        }
        else {
          this.setState({ isLoading: false })
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  startCreateHorse = () => {
    this.setState({ exist: true })
  }

  onCancelHandler = (event) => {
    console.log(this.state.horse)
    //this.setState({ isLoading: true });
  }

  modalCancelHandler = (event) => {
    this.setState({ creating: false, exist: false })
    this.setState({
      horse: {
        name: "",
        weight: "",
        age: 3,
        color: "Z",
        sex: "M",
        sire: "",
        dam: "",
        stable: null,
        bestTimes: {}
      }
    })
    document.getElementById("name").focus();
  }

  onHandleChange = (e) => {
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = e.target.value
    this.setState({ horse: newHorse })
  }

  onAgeChangeHandler = (e) => {
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = parseInt(e.target.value || 0)
    this.setState({ horse: newHorse })
  }

  onStableChangeHandler = (e) => {
    let newHorse = Object.assign({}, this.state.horse)
    newHorse[e.target.id] = e.target.value._id
    this.setState({ selectedStable: e.target.value, horse: newHorse });
  }
  validateHorse = () => {
    if (!this.state.horse.name) {
      return false;
    }
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SearchHorse($name: String!) {
          searchHorse(name: $name) {
            name
            weight
            age
            color
            sex
            sire
            dam
          }
        }
      `,
      variables: {
        name: this.state.horse.name
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
        if (resData && resData.data.singleHorse) {
          this.setState({ exist: true, isLoading: false })
        }
        else {
          this.setState({ isLoading: false })
          document.getElementById("weight").focus();
        }
      })
      .catch(error => {
        console.log(error);
      })
  }
  saveHandler = (event) => {

    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation CreateHorse($horse: HorseInput) {
          createHorse(horseInput: $horse) {
            _id
            name
            weight
            age
            color
            sex
            sire
            dam
          }
        }
      `,
      variables: {
        horse: this.state.horse
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
        this.setState({ selectedStable: null, isLoading: false, saved: true })
      })
      .catch(error => {
        console.log(error);
      })
  }

  onAddIconClick = (e) => {
    this.setState({ createStable: true })
  }

  closeStableDialog = (e) => {
    this.setState({ stable: {name: ""}, createStable: false });
  }

  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ saved: false });
    this.setState({ selectedStable: {} })
    this.modalCancelHandler()
  };

  savedStable = (stable) => {
    if (stable) {
      this.setState(prevState => {
        let horse = prevState.horse
        let stables = prevState.stables;
        stables.push(stable)
        horse.stable = stable._id
        return { ...prevState, stableSaved: true, createStable: false, horse: horse, stables: stables, selectedStable: stable }
      });
    }
  }

  onValidateStable = (stable) => {
    if (stable) {
      this.setState({ stable: { name: "" } })
    }
  }

  onStableHandlerChange = (value) => {
    //let newStable = Object.assign({}, this.state.stable)
    //newStable["name"] = value
    this.setState({ stable: { name: value } })
  }

  handleSnackBarStableClose = () => {
    this.setState({ stableSaved: false, stable: { name: "" } });
  }

  onValidateHorse = (horse) => {
    if (horse) {
      this.modalCancelHandler()
    }
  }

  savedHorse = (horse) => {
    this.setState({ saved: true });
  }

  render() {

    return (
      <React.Fragment>
        <div>

          <div>
            <h3>
              Create Horse
            </h3>
          </div>

          <div>
            <div>
              <HorseNameInput validateHorse={this.onValidateHorse} change={this.onHandleChange} name={this.state.horse.name} />
            </div>

            <div>
              <TextField style={{ width: "100%" }} id="weight" type="number" variant="outlined" label="Weight" value={this.state.horse.weight} onChange={this.onAgeChangeHandler}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Lbs</InputAdornment>,
                }}
              />
            </div>
            <div>
              <label htmlFor="age">Age</label>
              <select className="form-control" onChange={this.onAgeChangeHandler} id="age" value={this.state.horse.age}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
              </select>
            </div>

            <div>
              <label htmlFor="sex">Color</label>
              <select className="form-control" onChange={this.onHandleChange} id="color" value={this.state.horse.color}>
                <option value="Z">Z</option>
                <option value="Zo">Zo</option>
                <option value="A">A</option>
                <option value="R">R</option>
                <option value="Ro">Ro</option>
              </select>
            </div>
          </div>

          <div>
            <div>
              <label htmlFor="sex">Sex</label>
              <select className="form-control" id="sex" value={this.state.horse.sex} onChange={this.onHandleChange}>
                <option value="M">M</option>
                <option value="Mc">Mc</option>
                <option value="H">H</option>
              </select>
            </div>
            <div>
              <label htmlFor="sire">Sire</label>
              <input type="text" className="form-control" onChange={this.onHandleChange}    value={this.state.horse.sire} />
            </div>
            <div>
              <label htmlFor="dam">Dam</label>
              <input type="text" className="form-control" onChange={this.onHandleChange} value={this.state.horse.dam} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="stable">Stable</label>
              <div>
                <Dropdown id="stable" optionLabel="name" filter={true} value={this.state.selectedStable} options={this.state.stables} onChange={this.onStableChangeHandler} placeholder="Select a Stable" />
                <span>
                  <AddIcon color="secondary" onClick={this.onAddIconClick}></AddIcon>
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={this.onCancelHandler} >
              Cancel
            </Button>
            <SaveHorseButon horse={this.state.horse} savedHorse={this.savedHorse} />
          </div>

        </div>


        <Dialog header="Horse Exists!" visible={this.state.exist} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          {this.state.horse.name} already exists!
        </Dialog>

        <SnackbarSuccess
          open={this.state.saved}
          onClose={this.handleClose}
          variant={"success"}
          message="Horse Created!"
        >
        </SnackbarSuccess>

        <SnackbarSuccess
          open={this.state.stableSaved}
          onClose={this.handleSnackBarStableClose}
          variant={"success"}
          message="Stable Created!"
        >
        </SnackbarSuccess>

        <DialogMaterial
          open={this.state.createStable}
          TransitionComponent={this.Transition}
          disableBackdropClick
          disableEscapeKeyDown
          keepMounted
          onClose={this.closeStableDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Create Stable"}</DialogTitle>
          <DialogContent>
            <StableInput   validateStable={this.onValidateStable} change={this.onStableHandlerChange} name={this.state.stable.name} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeStableDialog} >
              Cancel
            </Button>
            <SaveStableButton stable={this.state.stable} savedStable={this.savedStable} />
          </DialogActions>
        </DialogMaterial>

        {
          this.state.isLoading &&
          (
            <React.Fragment>
              <Spinner />
              <Backdrop />
            </React.Fragment>
          )
        }

      </React.Fragment >
    );
  }
}

export default CreateHorsePage

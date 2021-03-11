import React, { Component } from "react";

import { AuthContext } from "../../context/auth-context";

import SnackbarSuccess from "../../components/SnackBar/SnackBarSuccess";
import Backdrop from "../../components/Backdrop/Backdrop";
import Spinner from "../../components/Spinner/Spinner";

import Button from '@material-ui/core/Button';

import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import MaskedInput from 'react-text-mask';

//import "../pages/Horses.css";

class CreateWorkoutPage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    isLoading: false,
    visible: false,
    saved: false,
    workout: {
      date: "",
      horse: "",
      distance: "400",
      jockey: "",
      type: "¼",
      time: "",
      trackCondition: "L",
      workoutUrl: ""
    },
    horses: []
  }

  componentDidMount() {
    this.fetchHorses()
    this.fetchJockeys();
  }
  jockeys = [];

  fetchHorses() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          horses {
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
        this.setState({ horses: resData.data.horses.map(horse => { return { label: horse.name, value: horse._id } }), isLoading: false });
        this.setState({ isLoading: false });
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  fetchJockeys = () => {
    //setLoading(true);
    const requestBody = {
      query: `
        query {
          jockeys {
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
        this.jockeys = resData.data.jockeys.map(jockey => {
          return { label: jockey.name, value: jockey._id }
        });
        //this.setState({ jockeys: resData.data.jockeys })
      })
      .catch(error => {
        console.log(error)
        //this.setState({ isLoading: false });
      })
  }

  onCancelHandler = (event) => {
    console.log(this.state.workout)
    //this.setState({ isLoading: true });
  }

  modalCancelHandler = (event) => {    
    this.setState(prevState => {
      return { 
        workout: {
          ...prevState.workout,
          horse: "",        
          jockey: "",
          type: "¼",
          time: "",
          trackCondition: "L"
        }        
      }
    })
  }

  onHandleChange = (e) => {
    let newWorkout = Object.assign({}, this.state.workout)
    newWorkout[e.target.id] = e.target.value
    this.setState({ workout: newWorkout })
  }

  saveHandler = (event) => {

    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation CreateWorkout($workout: WorkoutInput) {
          createWorkout(workoutInput: $workout) {
            _id
            date
            horse {
              name
            }
            jockey {
              name
            }     
            time
            distance   
          }
        }
      `,
      variables: {
        workout: this.state.workout
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
        this.setState({ isLoading: false, saved: true })
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ saved: false });
    this.modalCancelHandler()
  };

  handleSnackBarWorkoutClose = () => {
    this.setState({ stableSaved: false, stable: { name: "" } });
  }

  TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[/[0-2]/, ':', /[0-5]/, /[0-9]/, '.', /[0-4]/]}
        placeholderChar={'\u2000'}
        showMask
      />
    );
  }

  render() {

    return (
      <React.Fragment>
        <div>

          <div>
            <h3>
              Create Workout
            </h3>
          </div>

          <div>
            <div>
              <label htmlFor="horse">Horse</label>
              <Dropdown options={this.state.horses} id="horse" filter={true} value={this.state.workout.horse} onChange={this.onHandleChange} placeholder="Select a Horse" />
            </div>
            <div>
              <label htmlFor="type">Type</label>
              <select className="form-control" onChange={this.onHandleChange} id="type" value={this.state.workout.type}>                
                <option value="¼">¼</option>
                <option value="½">½</option>
                <option value="¾">¾</option>
                <option value="Sit">Sit</option>
                <option value="trotting">trotting</option>
                <option value="canter">canter</option>
                <option value="gallop">gallop</option>
              </select>
            </div>
            <div>
              <label htmlFor="date">Date</label>
              <Calendar dateFormat="dd/mm/yy" id="date" value={this.state.workout.date} onChange={this.onHandleChange}></Calendar>
            </div>

            <div>
              <label htmlFor="sex">Distance</label>
              <select className="form-control" onChange={this.onHandleChange} id="distance" value={this.state.workout.distance}>
                <option value="400">400</option>
                <option value="600">600</option>
                <option value="800">800</option>
                <option value="1000">1000</option>
              </select>
            </div>
            <div>
              <label htmlFor="time">Time</label>
              <Input
                value={this.state.workout.time}
                onFocus={(e) => e.target.select()}
                onBlur={
                  //if (e.target.value.trim().length === 6 && e.target.value !== horseRaceDetail.finishTime) {
                  this.onHandleChange
                  //}
                }
                id="time"
                inputComponent={this.TextMaskCustom}
              />
            </div>
            <FormControl style={{width: '100%'}}>
              <label>Jockey</label>
              <Dropdown options={this.jockeys} id="jockey" filter={true} value={this.state.workout.jockey} onChange={this.onHandleChange} />
            </FormControl>
            
            <div>
              <label htmlFor="sex">Track Condition</label>
              <select className="form-control" onChange={this.onHandleChange} id="trackCondition" value={this.state.workout.trackCondition}>
                <option value="L">L</option>
                <option value="F">F</option>
                <option value="H">H</option>
              </select>
            </div>
            <div>
              <TextField id="workoutUrl" label="workoutUrl" onChange={this.onHandleChange} value={this.state.workout.workoutUrl} fullWidth/>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={this.onCancelHandler} >
              Cancel
            </Button>
            <Button onClick={this.saveHandler}>
              Save
            </Button>
          </div>
        </div>

        <SnackbarSuccess
          open={this.state.saved}
          onClose={this.handleClose}
          variant={"success"}
          message="Workout Created!"
        >
        </SnackbarSuccess>

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

export default CreateWorkoutPage

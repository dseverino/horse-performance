import React, { Component } from "react";

import TextField from '@material-ui/core/TextField';

import { AuthContext } from "../../context/auth-context";
//import Backdrop from "../components/Backdrop/Backdrop";
//import TestModal from "../components/Modal/Modal";
//import Modal from "react-bootstrap-modal";
import { Dialog } from 'primereact/dialog';
import Spinner from "../../components/Spinner/Spinner";
import { Calendar } from 'primereact/calendar';
//import ModalHeader from "react-bootstrap/ModalHeader";

//import { InputText } from 'primereact/inputtext';
//import { Dropdown } from 'primereact/dropdown';

class CreateProgramPage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    isLoading: false,
    exist: false,
    visible: false,
    created: false,
    program: {
      number: "",
      date: null
    }
  }
  isActive = true;

  fetchGreatestProgramNumber = () => {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          programs {
            _id
            number
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
          throw new Error("Failed");
        }
        return result.json()
      })
      .then(resData => {
        if (resData && resData.data.programs) {
          this.setState(prevState => {
            return {...prevState, program: {
              number: resData.data.programs[0].number + 1,
              date: prevState.program.date
            }}            
          })
        }        
        this.setState({ isLoading: false })
      })
      .catch(error => {
        console.log(error);
      })
  }

  startCreateProgram = () => {
    this.setState({ exist: true })
  }
  modalCancelHandler = (event) => {
    this.setState({ creating: false, exist: false, created: false })
    this.setState({
      program: {
        number: "",
        date: ""
      }
    })
    document.getElementById("number").focus();
  }

  onNumberChangeHandler = (e) => {
    if (e.target.value === "") {
      return;
    }
    let newProgram = Object.assign({}, this.state.program)
    newProgram[e.target.id] = parseInt(e.target.value)
    this.setState({ program: newProgram })
  }

  onDateChange = (e) => {    
    this.setState({ program: { date: e.target.value, number: '' } });
    this.fetchGreatestProgramNumber();
  }

  validateProgram = () => {
    if (!this.state.program.number) {
      return false;
    }
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleProgram($number: Int!) {
          singleProgram(programId: $number) {
            number                        
          }
        }
      `,
      variables: {
        number: this.state.program.number
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
        if (resData && resData.data.singleProgram) {
          this.setState({ exist: true, isLoading: false })
        }
        else {
          this.setState({ isLoading: false });
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
        mutation CreateProgram($program: ProgramInput) {
          createProgram(programInput: $program) {
            _id
            number
            date            
          }
        }
      `,
      variables: {
        program: this.state.program
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
        this.props.history.push("/createRace")
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    return (
      <React.Fragment>
        <form>
          <h2>Create a Program</h2>
          <div className="col-md-3 mb-3">
            <label htmlFor="date">Date</label>
            <Calendar dateFormat="dd/mm/yy" id="date" value={this.state.program.date} onChange={this.onDateChange}></Calendar>
          </div>
          <div className="col-md-3 mb-3">
            <TextField id="number"
              label="Program" onChange={this.onNumberChangeHandler} keyfilter="pint" value={this.state.program.number} margin="normal" variant="outlined" />
          </div>
        </form>
        <button className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={this.saveHandler} className="btn btn-primary">
          Save
        </button>

        <Dialog header="Program Exists!" visible={this.state.exist} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          {this.state.program.number} already exists!
        </Dialog>

        <Dialog header={this.state.program.number + " Created!"} visible={this.state.created} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          <div>
            <div>
              Number: {this.state.program.number}
            </div>
          </div>
        </Dialog>

        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment >
    );
  }
}

export default CreateProgramPage

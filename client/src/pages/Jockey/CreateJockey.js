import React, { Component } from "react";

import { AuthContext } from "../../context/auth-context";
import { Dialog } from 'primereact/dialog';
import Spinner from "../../components/Spinner/Spinner";

import { TextField } from '@material-ui/core';

//import "../pages/Jockeys.css";

class CreateJockeyPage extends Component {
  static contextType = AuthContext

  state = {
    creating: false,
    Jockeys: [],
    isLoading: false,
    exist: false,
    visible: false,
    created: false,
    jockey: {
      name: ""
    }
  }
  isActive = true;

  startCreateJockey = () => {
    this.setState({ exist: true })
  }
  modalCancelHandler = (event) => {
    this.setState({ creating: false, exist: false, created: false })
    this.setState({
      jockey: {
        name: ""
      }
    });
  }
  onHandleChange = (e) => {
    this.setState({ jockey: { name: e.target.value } })
  }

  validateJockey = () => {
    if (!this.state.jockey.name) {
      return false;
    }
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleJockey($name: String!) {
          singleJockey(name: $name) {
            name
          }
        }
      `,
      variables: {
        name: this.state.jockey.name
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
        if (resData && resData.data.singleJockey) {
          this.setState({ exist: true });
        }
        this.setState({ isLoading: false })
      })
      .catch(error => {
        console.log(error);
        this.setState({ isLoading: false })
      })
  }
  saveHandler = (event) => {

    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation CreateJockey($jockey: JockeyInput) {
          createJockey(jockeyInput: $jockey) {
            _id
            name
          }
        }
      `,
      variables: {
        jockey: this.state.jockey
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
  render() {
    return (
      <React.Fragment>
        <div>
          <div>
            <TextField name="name" label="Name" variant="outlined" onBlur={this.validateJockey} onChange={this.onHandleChange} value={this.state.jockey.name} />
          </div>
          <div>
            <button className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={this.saveHandler} className="btn btn-primary">
              Save
            </button>
          </div>
        </div>


        <Dialog header="Jockey Exists!" visible={this.state.exist} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          {this.state.jockey.name} already exists!
        </Dialog>
        <Dialog header={this.state.jockey.name + " Created!"} visible={this.state.created} style={{ width: '50vw' }} modal={true} onHide={this.modalCancelHandler}>
          <div>
            <div>
              Name: {this.state.jockey.name}
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

export default CreateJockeyPage

import React, { Component } from "react";

import Spinner from "../../components/Spinner/Spinner";

import { Dropdown } from 'primereact/dropdown';

import { AuthContext } from "../../context/auth-context";

//import "../pages/Trainers.css";

class StableAddTrainerPage extends Component {
  static contextType = AuthContext

  componentDidMount = () => {
    this.fetchStables()
    this.fetchTrainers()
  }

  state = {
    creating: false,
    isLoading: false,
    stables: null,
    trainers: null,
    selectedStable: null,
    selectedTrainer: null
  }
  isActive = true;

  fetchStables() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          stablesWithoutTrainer {
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
        if (this.isActive) {
          this.setState({ stables: resData.data.stablesWithoutTrainer, isLoading: false });
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  fetchTrainers() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          trainers {
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
        if (this.isActive) {
          this.setState({ trainers: resData.data.trainers, isLoading: false });
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  onStableChangeHandler = (e) => {
    this.setState({ selectedStable: e.target.value });
  }

  onTrainerChangeHandler = (e) => {
    this.setState({ selectedTrainer: e.target.value });
  }

  onAddTrainerHandler = () => {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation AddTrainerStable($trainerId: ID!, $stableId: ID!) {
          addTrainerStable(trainerId: $trainerId, stableId: $stableId) {            
            _id
            name
            trainers{
              name
            }
          }
        }        
      `,
      variables: {
        trainerId: this.state.selectedTrainer._id,
        stableId: this.state.selectedStable._id
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
        this.setState({ isLoading: false, selectedTrainer: null, selectedStable: null });       
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  render() {
    return (
      <React.Fragment>
        <div style={{display: "flex"}}>          
          <div className="col-md-3 mb-3">
            <label htmlFor="stable">Select Stable</label>
            <Dropdown id="stable" showClear={true} optionLabel="name" filter={true} value={this.state.selectedStable} options={this.state.stables} onChange={this.onStableChangeHandler} placeholder="Select a Stable" />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="trainer">Select Trainer</label>
            <Dropdown id="trainer" showClear={true} optionLabel="name" filter={true} value={this.state.selectedTrainer} options={this.state.trainers} onChange={this.onTrainerChangeHandler} placeholder="Select trainer" />
          </div>
          <div style={{ paddingLeft: "89px", marginTop: "30px" }}>
            <button disabled={!this.state.selectedTrainer || !this.state.selectedStable} onClick={this.onAddTrainerHandler} className="btn btn-primary">
              Add Trainer
          </button>
          </div>
        </div>
        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment>
    );
  }
}

export default StableAddTrainerPage

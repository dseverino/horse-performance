import React, { Component } from "react";

import Spinner from "../../components/Spinner/Spinner";

import { Dropdown } from 'primereact/dropdown';

import { AuthContext } from "../../context/auth-context";

//import "../pages/Horses.css";

class StablesPage extends Component {
  static contextType = AuthContext

  componentDidMount = () => {
    this.fetchStables()
    this.fetchHorses()
  }

  state = {
    creating: false,
    isLoading: false,
    stables: null,
    horses: null,
    selectedStable: null,
    selectedHorse: null
  }
  isActive = true;

  fetchStables() {
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
        if (this.isActive) {
          this.setState({ stables: resData.data.stables, isLoading: false });
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }
  fetchHorses() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          horsesWithoutStable {
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
          this.setState({ horses: resData.data.horsesWithoutStable, isLoading: false });
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

  onHorseChangeHandler = (e) => {
    this.setState({ selectedHorse: e.target.value });
  }

  onAddHorseHandler = () => {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        mutation AddHorseStable($horseId: ID!, $stableId: ID!) {
          addHorseStable(horseId: $horseId, stableId: $stableId) {            
            _id
            name            
          }
        }        
      `,
      variables: {
        horseId: this.state.selectedHorse._id,
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
        this.state.horses.splice(resData.data.addHorseStable, 1);
        this.setState({ horse: resData.data.addHorseStable, isLoading: false, selectedHorse: null, selectedStable: null });
        this.fetchHorses()
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
            <label htmlFor="horse">Select Horse</label>
            <Dropdown id="horse" showClear={true} optionLabel="name" filter={true} value={this.state.selectedHorse} options={this.state.horses} onChange={this.onHorseChangeHandler} placeholder="Select a Horse" />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="stable">Select Stable</label>
            <Dropdown id="stable" showClear={true} optionLabel="name" filter={true} value={this.state.selectedStable} options={this.state.stables} onChange={this.onStableChangeHandler} placeholder="Select a Stable" />
          </div>          
          <div style={{ paddingLeft: "89px", marginTop: "30px" }}>
            <button disabled={!this.state.selectedHorse || !this.state.selectedStable} onClick={this.onAddHorseHandler} className="btn btn-primary">
              Add Horse
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

export default StablesPage

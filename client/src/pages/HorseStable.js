import React, { Component } from "react";

import Spinner from "../../components/Spinner/Spinner";

import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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
    selectedStable: null,
    selectedHorse: null,
    stables: null,
    horses: null
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
        if (this.isActive) {
          this.setState({ horses: resData.data.horses, isLoading: false });
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

  addHandler = () => {

    const requestBody = {
      query: `
        mutation AddHorse($horseId: String!, $stableId: String!) {
          addHorse(horseId: $horseId, stableId: $stableId) {
            name
            horses{
              stable{
                name
              }
            }
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
        this.setState({ horses: resData.data.singleStable.horses, isLoading: false });
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-md-3 mb-3">
          <label htmlFor="stable">Select Stable</label>
          <Dropdown id="stable" optionLabel="name" filter={true} value={this.state.selectedStable} options={this.state.stables} onChange={this.onStableChangeHandler} placeholder="Select a Stable" />
        </div>
        {
          this.state.horses &&
          <DataTable value={this.state.horses} paginator={true} rows={15} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
            totalRecords={10}>
            <Column field="name" header="Name" />
          </DataTable>
        }

        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment>
    );
  }
}

export default StablesPage

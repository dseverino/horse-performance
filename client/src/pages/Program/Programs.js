import React, { Component } from "react";

//import Modal from "../components/Modal/Modal";
//import Backdrop from "../components/Backdrop/Backdrop";
//import HorseList from "../components/Horses/HorseList/HorseList"
import Spinner from "../components/Spinner/Spinner";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { AuthContext } from "../context/auth-context";

import "../pages/Horses.css";

class HorsesPage extends Component {
  static contextType = AuthContext

  componentDidMount = () => {
    this.fetchHorses()
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  state = {
    creating: false,
    horses: [],
    isLoading: false,
    selectedHorse: null,
    horse: {
      name: '',
      weight: "",
      age: "",
      color: "",
      sex: "",
      sire: "",
      dam: "",
      stable: ""
    }
  }
  isActive = true;

  fetchHorses() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          horses {
            _id
            name
            weight            
            color
            sex
            age
            sire
            dam
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

  render() {
    return (
      <React.Fragment>
        <DataTable value={this.state.horses} paginator={true} rows={15} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
          totalRecords={10}>
          <Column field="name" header="Name" />
          <Column field="age" header="Age" />
          <Column field="color" header="Color" />
          <Column field="sex" header="Sex" />
          <Column field="sire" header="Sire" />
          <Column field="dam" header="Dam" />
        </DataTable>
        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment>
    );
  }
}

export default HorsesPage

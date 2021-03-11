import React, { Component } from "react";

import { AuthContext } from "../../context/auth-context";
import HorseRaceDetail from "../../components/HorseRaceDetail/HorseRaceDetail";
import Spinner from "../../components/Spinner/Spinner";

import { Dropdown } from 'primereact/dropdown';

import { Paper } from "@material-ui/core";




//import "../pages/Horses.css";

class SearchHorsePage extends Component {
  static contextType = AuthContext
  dateFormmater = new Intl.DateTimeFormat('en-GB', { year: '2-digit', month: 'short', day: '2-digit' });

  componentDidMount = () => {
    this.fetchHorses()
  }

  state = {
    creating: false,
    isLoading: false,
    selectedHorse: null,
    horses: [],
    horse: null
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


  onHorseChangeHandler = (e) => {
    this.setState({ selectedHorse: e.target.value, horse: null });

    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query SingleHorse($id: ID!) {
          singleHorse(id: $id) {
            _id
            name
            workouts {
              date
              distance
              jockey {
                name
              }
              type
              time
              trackCondition
              workoutUrl
            }
            raceDetails {
              _id                  
              claiming
              date
              discarded
              distance
              times {                    
                quarterMile
                halfMile
                thirdQuarter
                mile
                finish
              }
              finishTime
              horseMedications
              horseEquipments
              jockey{
                _id
                name
                stats
                trainerStats
              } 
              jockeyWeight
              jockeyChanged
              stable {
                name
                _id
                stats
              }
              trainer {
                name
                _id
                stats
              }                  
              raceNumber
              racePositions
              trackCondition                  
              startingPosition
              positions{
                start
                quarterMile
                halfMile
                thirdQuarter
                mile
                finish
              }
              lengths{
                quarterMile
                halfMile
                thirdQuarter
                mile
                finish
              }
              bet
              trainingTimes{
                date
              }
              horseWeight
              claimed
              claimedBy{
                name
              }
              status
              retiredDetails
              totalHorses
              horseAge
              comments
              confirmed
              raceId
              statsReady
              raceUrl
              finalStraightUrl
            }
          }
        }        
      `,
      variables: {
        id: e.target.value
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
        var horse = resData.data.singleHorse
        horse.raceDetails.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))
        this.setState({ horse: horse, isLoading: false });
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
          <label htmlFor="horse">Select a Horse</label>
          <Dropdown id="horse" optionLabel="name" optionValue="_id" filter={true} value={this.state.selectedHorse} options={this.state.horses} onChange={this.onHorseChangeHandler} placeholder="Select a Horse" />
        </div>
        {
          this.state.horse &&
          <Paper style={{ margin: "10px 0px" }} className="horse__card">
            <div style={{ fontSize: "19px"}}>
              <strong>
                <span style={{ marginRight: "25px" }}>{this.state.horse.name}
                </span>
              </strong>
            </div>
            {
              this.state.horse.raceDetails.map((detail, index) => {
                const days = this.state.horse.raceDetails[index + 1] ? (new Date(detail.date) - new Date(this.state.horse.raceDetails[index + 1].date)) / (1000 * 3600 * 24) : 0
                return <HorseRaceDetail key={index} details={detail} days={days} date={this.dateFormmater.format(new Date(detail.date))} />
              })
            }
            <div>
              <div>
                Trabajo(s):
                {
                  this.state.horse.workouts.map((workout, index) => {
                    return <div key={index}>{workout.date} {workout.distance} {workout.time} {workout.jockey.name} </div>
                  })
                }
              </div>
            </div>
          </Paper>
        }

        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment>
    );
  }
}

export default SearchHorsePage

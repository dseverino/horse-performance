import React, { Component } from "react";

import Spinner from "../../components/Spinner/Spinner";

import { AuthContext } from "../../context/auth-context";

import { Calendar } from 'primereact/calendar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import RaceTabPanel from '../../components/Race/RaceTabPanel'
import Backdrop from "../../components/Backdrop/Backdrop";
import MainDialog from "../../components/Dialogs/MainDialog";
import CreateHorseDialog from "../../components/Dialogs/CreateHorseDialog";
import CreateStableDialog from "../../components/Dialogs/CreateStableDialog";
//import AddHorseDialog from "../../components/Dialogs/AddHorseDialog";
//import DialogIndex from "../../components/Dialogs/DialogIndex";
import AddHorseDialogPrime from "../../components/Dialogs/AddHorseDialogPrime";
import RaceDetailsDialog from "../../components/Dialogs/RaceDetailsDialog";
import HorseRaceDetailsDialog from "../../components/Dialogs/HorseRaceDetailsDialog";
import { loadRace } from "../../services/Services";

class Races extends Component {
  static contextType = AuthContext;

  state = {
    isLoading: false,
    programDate: "",
    selectedRace: 0,
    races: [],
    currentRaceSelected: {},
    jockeys: [],
    stables: [],
    trainers: [],
    openDialogTest: false,
    showDialogOb: {},
    horses: [],
    displayDialog: false,
    displayRaceDetailsDialog: false,
    displayHorseRaceDetailsDialog: false
  }



  async componentDidMount() {
    const [jockeys, stables, trainers] = await Promise.all([
      this.fetchJockeys(),
      this.fetchStables(),
      this.fetchTrainers()
    ])
    //console.log({jockeys, stables, trainers})

    //console.log(jockeys, stables, trainers)
    this.context.setList({ ...jockeys, ...stables, ...trainers });

    this.events = [
      "1ra Carrera",
      "2da Carrera",
      "3ra Carrera",
      "4ta Carrera",
      "5ta Carrera",
      "6ta Carrera",
      "7ma Carrera",
      "8va Carrera",
      "9na Carrera",
      "10ma Carrera",
    ]

    // this.dialogMap = {
    //   "horse": <CreateHorseDialog open={true} close={this.closeDialog} key={0} addDialog={this.addDialog} stables={this.state.stables} />,
    //   "stable": <CreateStableDialog close={this.closeDialog} load={(bool) => this.setState({ isLoading: bool })} savedStable={(stable) => this.setState({ stables: [...this.state.stables, stable] })} key={1} addDialog={this.addDialog} />,
    //   //"addHorse": <AddHorseDialog close={this.closeDialog} key={0} addDialog={this.addDialog} stables={this.state.stables} />,
    // }
    //this.setState({ races: [], programDate: "2020-01-11T04:00:00.000Z", isLoading: true, selectedRace: 0 }, () => this.loadProgramRaces());
  }

  handleChange = (event, newValue) => {
    this.setState({ selectedRace: newValue })
  }

  onProgramDateChange = (e) => {
    this.setState({ races: [], programDate: e.value, isLoading: true, selectedRace: 0 }, () => this.loadProgramRaces());
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

    return fetch("api/graphql", {
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
        return resData.data
        //xthis.context.
        //this.setState({ jockeys: resData.data.jockeys })
      })
      .catch(error => {
        console.log(error)
        //this.setState({ isLoading: false });
      })
  }

  fetchStables = () => {
    //setLoading(true);
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

    return fetch("api/graphql", {
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
        return resData.data
        //this.setState({ stables: resData.data.stables })
      })
      .catch(error => {
        console.log(error)
        //this.setState({ isLoading: false });
      })
  }

  fetchTrainers = () => {
    //setLoading(true);
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

    return fetch("api/graphql", {
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
        return resData.data
        //this.setState({ trainers: resData.data.trainers })
      })
      .catch(error => {
        console.log(error)
        //this.setState({ isLoading: false });
      })
  }

  loading = (value) => {
    this.setState({ isLoading: value })
  }

  loadProgramRaces = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query SingleProgram($date: String!) {
          singleProgram(date: $date) {
            races {
              _id
              event
              distance
              claimings
              procedences
              horseAge
              completed
              spec
              purse
              times {
                quarterMile
                halfMile
                thirdQuarter
                mile
                finish
              }
              totalHorses
              hasRaceDetails
              trackCondition              
              horses {
                _id
                name
                weight
                age
                color
                sex
                sire
                dam
                stable {         
                  _id
                  name
                  stats
                }
                stats
                jockeyStats
                workouts {
                  date
                  jockey {
                    name
                  }
                  time
                  distance
                  type
                  trackCondition
                }
                bestTimes
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
          }
        }
      `,
      variables: {
        date: this.state.programDate
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
          throw new Error("Failed");
        }
        return result.json();
      })
      .then(resData => {
        if (resData && resData.data.singleProgram) {
          this.setState({ races: resData.data.singleProgram.races, exist: true, isLoading: false });
        }
        else {
          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  addHorseToRace = (raceIndex, raceId, selectedHorse) => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        mutation AddHorse($raceId: ID, $horseId: ID) {
          addHorse(raceId: $raceId, horseId: $horseId) {
            _id
            event
            distance
            claimings
            procedences
            horseAge
            spec
            purse
            positions
            horses {
              _id
              name
              weight
              age
              color
              sex
              sire
              dam
              stats
              jockeyStats
              bestTimes
              stable {         
                _id
                name
                stats          
              }
              workouts {
                date
                jockey {
                  name
                }
                time
                distance
                type
                trackCondition
              }
              raceDetails {
                _id
                startingPosition
                claiming
                horseMedications
                horseEquipments
                jockey{
                  name
                  stats
                } 
                jockeyWeight
                jockeyChanged
                stable {
                  name
                }
                trainer {
                  name
                }
                date
                raceNumber
                trackCondition          
                distance
                times {                  
                  quarterMile
                  halfMile
                  thirdQuarter
                  mile
                  finish
                }
                finishTime
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
                racePositions
              }
            }
          }
        }
      `,
      variables: {
        raceId: raceId,
        horseId: selectedHorse._id
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
        this.setState((prevState) => {
          const races = prevState.races;
          races[raceIndex] = resData.data.addHorse;
          return { ...prevState, races: races, isLoading: false }
        })
        this.setState({ isLoading: false })
      })
      .catch(error => {
        console.log(error)
        this.setState({ isLoading: false });
      })
  }

  hasRaceDetails = (raceIndex) => {
    this.setState((prevState) => {
      const races = prevState.races;
      races[raceIndex]['hasRaceDetails'] = true;
      return { ...prevState, races: races, isLoading: false }
    })
  }

  testButton = () => {

    this.setState({ showDialogOb: { ...this.state.showDialogOb, "horse": this.dialogMap["horse"] } })

  }

  closeDialog = (name) => {
    this.setState({ showDialogOb: { ...this.state.showDialogOb, [name]: null } })
  }

  addDialog = (name) => {

    this.setState({ showDialogOb: { ...this.state.showDialogOb, [name]: this.dialogMap[name] } })
  }

  onAddHorseToRace = (race) => {
    this.setState({ displayDialog: true, currentRaceSelected: race })
  }

  loadRaceHandler = async (id, event) => {
    const race = await loadRace(id);
    this.state.races.splice(event - 1, 1, race)
    this.setState({ races: this.state.races })
    // this.setState(prevState => ({
    //   races: prevState.races.splice((event), 1, race)
    // }), () => console.log(this.state.races))
  }


  render() {
    const tabs = this.state.races.map(race => {
      return (
        <Tab key={race._id} label={this.events[race.event - 1]} />
      )
    })
    const RaceTabPanels = this.state.races.map((race, index) => {
      return (
        <RaceTabPanel
          loadProgramRaces={this.loadProgramRaces}
          hasRaceDetails={this.hasRaceDetails}
          loading={this.loading}
          horses={this.state.horses}
          loadHorses={(horses) => this.setState({ horses: horses })}
          programDate={this.state.programDate}
          horseaddedtorace={this.addHorseToRace}
          key={race._id}
          race={race}
          value={this.state.selectedRace}
          index={index}
          onAddHorseToRace={this.onAddHorseToRace}
          openRaceDetailsDialog={() => this.setState({ displayRaceDetailsDialog: true, currentRaceSelected: race })}
          openHorseRaceDetails={() => this.setState({ displayHorseRaceDetailsDialog: true, currentRaceSelected: race })}

        //addHorseDialog={this.addDialog}
        />
      )
    });

    return (
      <React.Fragment>
        <div>
          <div className="col-md-3 mb-3">
            <Calendar style={{ height: "50px", borderRadius: "20px" }} readOnlyInput={true}
              dateFormat="dd/mm/yy"
              showIcon
              id="date"
              value={this.state.programDate}
              onChange={this.onProgramDateChange}
            />            
          </div>
        </div>
        {
          this.state.races.length > 0 && (
            <React.Fragment>
              <Paper style={{ flexGrow: 1 }}>
                <Tabs value={this.state.selectedRace} onChange={this.handleChange} indicatorColor="primary" textColor="primary" >
                  {tabs}
                </Tabs>
              </Paper>
              {RaceTabPanels}
            </React.Fragment>
          )
        }

        {
          this.state.isLoading &&
          <React.Fragment>
            <Backdrop />
            <Spinner />
          </React.Fragment>
        }

        <Button onClick={this.testButton}>test</Button>

        {/* <MainDialog id="mainDialog">
          {Object.values(this.state.showDialogOb)}
        </MainDialog> */}

        {
          this.state.displayDialog && (
            <AddHorseDialogPrime
              id="add-horse"
              visible={this.state.displayDialog}
              keepMounted
              onHide={() => this.setState({ displayBasic: false })}
              header="Add Horse"
              date={this.state.programDate}
              raceSelected={this.state.currentRaceSelected}
              onHorseAdded={this.addHorseToRace}
              onClose={() => this.setState({ displayDialog: false })}
              index={this.state.selectedRace}
            />
          )
        }

        {
          this.state.displayRaceDetailsDialog && (
            <RaceDetailsDialog
              index={this.state.selectedRace}
              hasRaceDetails={this.hasRaceDetails}
              loading={() => this.setState({ isLoading: true })}
              visible={this.state.displayRaceDetailsDialog}
              date={this.state.programDate}
              raceSelected={this.state.currentRaceSelected}
              onClose={() => this.setState({ displayRaceDetailsDialog: false })}
              loadRace={this.loadRaceHandler}
            />
          )
        }

        {
          this.state.displayHorseRaceDetailsDialog && (
            <HorseRaceDetailsDialog
              visible={this.state.displayHorseRaceDetailsDialog}
              onClose={() => this.setState({ displayHorseRaceDetailsDialog: false })}
              raceSelected={this.state.currentRaceSelected}
              header="Horse Race Details"
              loading={(load) => this.setState({ isLoading: load })}
              date={this.state.programDate}
              loadRace={this.loadRaceHandler}
            />
          )
        }
      </React.Fragment>
    );
  }
}

export default Races
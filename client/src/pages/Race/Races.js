import React, { useContext, useEffect, useState } from "react";

import Spinner from "../../components/Spinner/Spinner";

import { AuthContext } from "../../context/auth-context";

import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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

const Races = ({ history }) => {

  const context = useContext(AuthContext)

  let events = [
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

  const [state, setState] = useState({
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
  })


  useEffect(() => {
    Promise.all([
      fetchJockeys(),
      fetchStables(),
      fetchTrainers()
    ])
    .then(data => {
      const [jockeys, stables, trainers] = data
      context.setList({ ...jockeys, ...stables, ...trainers });
    })
    //console.log({jockeys, stables, trainers})

    //console.log(jockeys, stables, trainers)
    //context.setList({ ...jockeys, ...stables, ...trainers });

  
  }, [])

  useEffect(() => {
    if(state.programDate){
      loadProgramRaces();
    }
  }, [state.programDate])

  const handleChange = (event, newValue) => {
    setState({ ...state, selectedRace: newValue })
  }

  const onProgramDateChange = (e) => {
    setState({ ...state, races: [], programDate: e.value, isLoading: true, selectedRace: 0 });
  }

  const fetchJockeys = async () => {
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

    try {
      const result = await fetch("api/graphql", {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed");
      }
      const resData = await result.json();
      return resData.data;
    } catch (error) {
      console.log(error);
    }
  }

  const fetchStables = async () => {
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

    try {
      const result = await fetch("api/graphql", {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed");
      }
      const resData = await result.json();
      return resData.data;
    } catch (error) {
      console.log(error);
    }
  }

  const fetchTrainers = async () => {
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

    try {
      const result = await fetch("api/graphql", {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed");
      }
      const resData = await result.json();
      return resData.data;
    } catch (error) {
      console.log(error);
    }
  }

  const loading = (value) => {
    setState({ ...state, isLoading: value })
  }

  const loadProgramRaces = () => {
    setState({ ...state, isLoading: true });
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
                  byLengths{
                    quarterMile
                    halfMile
                    thirdQuarter
                    mile
                    finish
                  }
                  beatenLengths{
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
        date: state.programDate
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
          resData.data.singleProgram.races ? setState({ ...state, races: resData.data.singleProgram.races, exist: true, isLoading: false }) : setTimeout(() => history.push("/createprogram"), 500)
        }
        else {
          //setState({ ...state, isLoading: false });
          setTimeout(() => history.push("/createprogram"), 500)
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const addHorseToRace = async (raceIndex, raceId, selectedHorse) => {
    setState({ ...state, isLoading: true });
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
                byLengths{
                  quarterMile
                  halfMile
                  thirdQuarter
                  mile
                  finish
                }
                beatenLengths{
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
        setState((prevState) => {
          const races = prevState.races;
          races[raceIndex] = resData.data.addHorse;
          return { ...prevState, races: races, isLoading: false }
        })
        setState({ ...state, isLoading: false })
        window.scrollTo(0, document.body.scrollHeight);
        return resData
      })
      .catch(error => {
        console.log(error)
        setState({ ...state, isLoading: false });
      })
  }

  const hasRaceDetails = (raceIndex) => {
    setState((prevState) => {
      const races = prevState.races;
      races[raceIndex]['hasRaceDetails'] = true;
      return { ...prevState, races: races, isLoading: false }
    })
  }

  const testButton = () => {

    setState({ ...state, showDialogOb: { ...state.showDialogOb, "horse": dialogMap["horse"] } })

  }

  const closeDialog = (name) => {
    setState({ ...state, showDialogOb: { ...state.showDialogOb, [name]: null } })
  }

  const addDialog = (name) => {

    setState({ ...state, showDialogOb: { ...state.showDialogOb, [name]: dialogMap[name] } })
  }

  const onOpenAddDialog = (race) => {
    setState({ ...state, displayDialog: true, currentRaceSelected: race })
  }

  const loadRaceHandler = async (id, event) => {
    const race = await loadRace(id);
    state.races.splice(event - 1, 1, race)
    setState({ ...state, races: state.races })
    // setState(prevState => ({
    //   races: prevState.races.splice((event), 1, race)
    // }), () => console.log(state.races))
  }

  const tabs = state.races.map(race => {
    return (
      <Tab key={race._id} label={events[race.event - 1]} />
    )
  })
  const RaceTabPanels = state.races.map((race, index) => {
    return (
      <RaceTabPanel
        loadProgramRaces={loadProgramRaces}
        hasRaceDetails={hasRaceDetails}
        loading={loading}
        horses={state.horses}
        loadHorses={(horses) => setState({ ...state, horses: horses })}
        programDate={state.programDate}
        horseaddedtorace={addHorseToRace}
        key={race._id}
        race={race}
        value={state.selectedRace}
        index={index}
        openAddDialog={onOpenAddDialog}
        openRaceDetailsDialog={() => setState({ ...state, displayRaceDetailsDialog: true, currentRaceSelected: race })}
        openHorseRaceDetails={() => setState({ ...state, displayHorseRaceDetailsDialog: true, currentRaceSelected: race })}
      //addHorseDialog={addDialog}
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
            value={state.programDate}
            onChange={onProgramDateChange}
          />
        </div>
      </div>
      {
        state.races.length > 0 && (
          <React.Fragment>
            <Paper style={{ flexGrow: 1 }}>
              <Tabs value={state.selectedRace} onChange={handleChange} indicatorColor="primary" textColor="primary" >
                {tabs}
              </Tabs>
            </Paper>
            {RaceTabPanels}
          </React.Fragment>
        )
      }

      {
        state.isLoading &&
        <React.Fragment>
          <Backdrop />
          <Spinner />
        </React.Fragment>
      }

      <Button onClick={testButton}>test</Button>

      {/* <MainDialog id="mainDialog">
        {Object.values(state.showDialogOb)}
      </MainDialog> */}

      {
        state.displayDialog && (
          <AddHorseDialogPrime
            id="add-horse"
            visible={state.displayDialog}
            keepMounted
            onHide={() => setState({ ...state, displayBasic: false })}
            header="Add Horse"
            date={state.programDate}
            raceSelected={state.currentRaceSelected}
            onHorseAdded={addHorseToRace}
            onClose={() => setState({ ...state, displayDialog: false })}
            index={state.selectedRace}
          />
        )
      }

      {
        state.displayRaceDetailsDialog && (
          <RaceDetailsDialog
            index={state.selectedRace}
            hasRaceDetails={hasRaceDetails}
            loading={() => setState({ ...state, isLoading: true })}
            visible={state.displayRaceDetailsDialog}
            date={state.programDate}
            raceSelected={state.currentRaceSelected}
            onClose={() => setState({ ...state, displayRaceDetailsDialog: false })}
            loadRace={loadRaceHandler}
          />
        )
      }

      {
        state.displayHorseRaceDetailsDialog && (
          <HorseRaceDetailsDialog
            visible={state.displayHorseRaceDetailsDialog}
            onClose={() => setState({ ...state, displayHorseRaceDetailsDialog: false })}
            raceSelected={state.currentRaceSelected}
            header="Horse Race Details"
            loading={(load) => setState({ ...state, isLoading: load })}
            date={state.programDate}
            loadRace={loadRaceHandler}
          />
        )
      }

    </React.Fragment>
  )
}

export default Races
import React, { useState, useEffect, useContext } from "react";

import {
  Typography,
  Box,
  Button
 } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';

import Horse from '../../components/Horse/Horse';
import Spinner from "../../components/Spinner/Spinner";
import Backdrop from "../../components/Backdrop/Backdrop";
import MainDialog from "../../components/Dialogs/MainDialog";
import { AuthContext } from "../../context/auth-context";

import './RaceTabPanel.css'


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const RaceTabPanel = props => {
  const ctxt = useContext(AuthContext);
  
  const [dialogList, setDialogList] = useState([])
  const [state, setState] = useState({ displayBasic: false })

  const timesByDistance = {
    1100: "1:05.0",
    1200: "1:09.0",
    1300: "1:15.0",
    1400: "1:21.0",
    1700: "1:41.0",
    1800: "1:47.0",
    1900: "1:54.0",
    2000: "1:59.0"
  };

  const horseNameList = []
  const horseRaceDetailsIds = props.race.horses.map(horse => {
    let detail = horse.raceDetails.find(detail => props.programDate.toISOString() === detail.date);
    horseNameList.push(horse.name)
    return {
      ...detail,
      name: horse.name,
      horseId: horse._id,
      bestTime: horse.bestTimes[props.race.distance] || ""
    }
  });

  const [completed, setCompleted] = useState(props.race.completed)

  const [timeLeader, setTimeLeader] = useState({
    quarterMile: "23.0",
    halfMile: '47.0',
    thirdQuarter: '1:12.0',
    mile: "1:35.0",
    finish: '0:57.0'
  });
  const [open, setOpen] = useState(false);
  const [openRaceDetails, setOpenRaceDetails] = useState(false);
  const [openHorseRaceDetails, setOpenHorseRaceDetails] = useState(false);
  const [loading, setLoading] = React.useState(false);



  const [raceDetails, setRaceDetails] = useState({
    times: {
      quarterMile: "23.0",
      halfMile: '47.0',
      finish: '0:57.0'
    },
    totalHorses: props.race.horses.length,
    hasRaceDetails: true,
    trackCondition: "L",
    raceUrl: "",
    positions: Array(props.race.horses.length).fill({}),
    finalStraightUrl: ""
  });



  const [selectedRetiredHorses, setSelectedRetiredHorses] = useState([]);

  useEffect(() => {
    const totalHorses = props.race.horses.length - selectedRetiredHorses.length
    setRaceDetails({ ...raceDetails, totalHorses: totalHorses, positions: Array(totalHorses).fill({}) });
  }, [selectedRetiredHorses])

  const claimings = props.race.claimings.map(claiming => {
    return "Reclamo RD$" + claiming
  });

  function handleOpenAddHorseDialog() {
    //setOpen(true);


    //setState({ displayBasic: true })
    
    props.openAddDialog(props.race)
  }
  function closeDialog() {
    setDialogList({ "addHorse": null })
  }

  function handleClose(newName) {
    setOpen(false);
  }

  function handleCloseRace() {
    setLoading(true);
    const requestBody = {
      query: `
        mutation CompleteRace($raceId: ID) {
          completeRace(raceId: $raceId) {
            programId
            event
            distance
            claimings
            procedences
            horseAge
            spec
            purse
          }
        }
      `,
      variables: {
        raceId: props.race._id
      }
    }

    //const token = this.context.token

    fetch("api/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        //"Authorization": `Bearer ${token}`,
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
        setLoading(false);
        setCompleted(true);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      })
  }

  function handleCloseRaceDetails() {
    setOpenRaceDetails(false)
  }


  function handleOpenRaceDetails() {
    //setOpenRaceDetails(true);
    props.openRaceDetailsDialog();
  }

  function handleOpenHorseRaceDetails() {
    props.openHorseRaceDetails();
  }

  function handleRetirementChange(e) {
    setSelectedRetiredHorses(e.target.value);
  }


  useEffect(() => {
    if (openRaceDetails) {
      var times = raceDetails.times;
      if (props.race.distance > 1600) {
        times.thirdQuarter = "1:12.0"
        times.mile = "1:35.0"
        times.finish = timesByDistance[props.race.distance]
        setTimeLeader({ ...times });
        setRaceDetails({ ...raceDetails, times: times })
      }
      else if (props.race.distance > 1200) {
        times.thirdQuarter = "1:12.0"
        times.finish = timesByDistance[props.race.distance]
        setTimeLeader({ ...timeLeader, ...times });
        setRaceDetails({ ...raceDetails, times: times })
      }
    }
  }, [openRaceDetails])


  const horseComponentList = props.race.horses.map(horse => {
    return (
      <Horse key={horse._id} distance={props.race.distance} horse={horse} dateSelected={props.programDate} />
    )
  });

  const onSpeechRec = () => {
    window.SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;
    // eslint-disable-next-line no-undef
    window.SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList
    //window.SpeechGrammarList
    var words = ['espuela', 'fuete', 'gringolas', 'gringolas especiales', 'lengua amarrada', 'lasix', 'buta'];
    var grammar = '#JSGF V1.0; grammar words; public <word> = ' + words.join(' | ') + ' ;'

    // eslint-disable-next-line no-undef
    const recognition = new SpeechRecognition();
    // eslint-disable-next-line no-undef
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = "es-DO";
    recognition.continuous = false;

    //let p = document.createElement("p");
    //const words = document.querySelector(".words");
    //words.appendChild(p);

    recognition.addEventListener("result", (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      //p.textContent = transcript;
      if (e.results[0].isFinal) {
        //p = document.createElement("p");
        //words.appendChild(p);
        console.log(transcript)
      }
    });

    //recognition.addEventListener("end", recognition.start);
    recognition.start();
    recognition.onspeechend = function () {
      recognition.stop();
    }
  }


  return (

    <TabPanel value={props.value} index={props.index}>
      <div>{props.race.distance}. {props.race.procedences} {props.race.horseAge}, {claimings.toString()}. {props.race.spec}</div>

      <div>Premio RD{formatter.format(props.race.purse)}</div>


      <div>
        <Button disabled={completed} color="primary" onClick={handleOpenAddHorseDialog} >
          Add/Edit Horse
          <AddIcon />
        </Button>
        <Button disabled={completed} color="primary" onClick={handleCloseRace} >
          Close Race
        <CheckIcon />
        </Button>
        <Button disabled={!completed || props.race.hasRaceDetails} color="primary" onClick={handleOpenRaceDetails} >
          Add Race Details
        </Button>
        <Button disabled={!props.race.hasRaceDetails} color="primary" onClick={handleOpenHorseRaceDetails} >
          Add Horse Race Details
        </Button>
        <Button onClick={onSpeechRec}>Speak</Button>
      </div>


      {
        horseComponentList
      }

      {/* Loader and Spinner*/}
      {
        loading &&
        <React.Fragment>
          <Backdrop />
          <Spinner />
        </React.Fragment>
      }

    </TabPanel >
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}


export default RaceTabPanel;
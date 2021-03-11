import React, { useState, useEffect } from "react";

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
//import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DialogActions from '@material-ui/core/DialogActions';
import Input from '@material-ui/core/Input';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

import Horse from '../../components/Horse/Horse';
import AddHorseDialog from "../Dialogs/AddHorseDialog";
import Spinner from "../../components/Spinner/Spinner";
import Backdrop from "../../components/Backdrop/Backdrop";
import MaskedInput from 'react-text-mask';
import MainDialog from "../../components/Dialogs/MainDialog";
import *  as DialogIndex from "../../components/Dialogs/DialogIndex";

import './RaceTabPanel.css'


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const RaceTabPanel = props => {

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
  const positions = [...Array(props.race.totalHorses).keys()].map(el => ++el)
  const mileTimes = ["1:35", "1:36", "1:37", "1:38", "1:39", "1:40", "1:41", "1:42", "1:43", "1:44", "1:45"];
  const bettingList = ["1/9", "1/5", "2/5", "1/2", "3/5", "4/5", "1/1", "6/5", "7/5", "3/2", "8/5", "9/5", "2/1", "5/2", "3/1", "7/2", "4/1", "9/2"].concat([...Array(100).keys()].filter(el => el > 4).map(el => `${el}/1`))

  const horseEquipments = ["E", "F", "G", "Gs", "LA"];

  const jockeys = props.jockeys.map(jockey => {
    return { label: jockey.name, value: jockey._id }
  });

  const stables = props.stables.map(stable => {
    return { label: stable.name, value: stable._id }
  });

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

  const [fullWidth, setFullWidth] = useState(false);

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

  const [selectedHorse, setSelectedHorse] = useState({ _id: "", status: "" })

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


    setState({ displayBasic: true })
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

  function handleCloseHorseRaceDetails() {
    setOpenHorseRaceDetails(false);
    setSelectedHorse({ _id: "", status: "" });
    setFullWidth(false)
  }

  function handleOpenRaceDetails() {
    setOpenRaceDetails(true);
  }

  function handleOpenHorseRaceDetails() {
    setOpenHorseRaceDetails(true);
  }

  function handleRetirementChange(e) {
    setSelectedRetiredHorses(e.target.value);
  }

  function handleHorseChange(e) {

    const horseRaceDetailSelected = horseRaceDetailsIds.find((detail) => detail._id === e.target.value);
    setSelectedHorse({
      ...horseRaceDetailSelected,
      claimedBy: null,
      trackCondition: props.race.trackCondition,
      times: props.race.times,
      claimed: false,
      jockey: horseRaceDetailSelected.jockey._id,
      trainer: horseRaceDetailSelected.trainer._id,
      stable: horseRaceDetailSelected.stable._id,
      totalHorses: props.race.totalHorses,
      horseEquipments: horseRaceDetailSelected.horseEquipments.slice(),
      horseMedications: horseRaceDetailSelected.horseMedications.slice(),
      lengths: { ...horseRaceDetailSelected.lengths },
      positions: { ...horseRaceDetailSelected.positions },
      status: horseRaceDetailSelected.status || ""
    });
    //setSelectedHorse( JSON.parse( JSON.stringify( horseRaceDetailSelected  ) ) );
  }
  /*
    useEffect(() => {
      if (selectedHorse.name) {
        //setSelectedHorse({ ...selectedHorse, jockey: selectedHorse.jockey._id, trainer: selectedHorse.trainer._id, stable: selectedHorse.stable._id, totalHorses: props.race.totalHorses });
        setFullWidth(true)
        console.log({ selectedHorse })
      }
    }, [selectedHorse, selectedHorse.status,])*/

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

  const handleChangeQuater = name => event => {
    var times = raceDetails.times;
    if (name === 'quarter') {
      times.quarterMile = event.target.value + '.' + times.quarterMile.split('.')[1]
    }
    else {
      times.quarterMile = times.quarterMile.split('.')[0] + '.' + event.target.value
    }

    setRaceDetails({ ...raceDetails, times: times });
    setTimeLeader({ ...timeLeader, quarterMile: times.quarterMile });

  }

  const handleChangeHalfMile = name => event => {
    var times = raceDetails.times;
    if (name === 'halfMile') {
      times.halfMile = event.target.value + '.' + times.halfMile.split('.')[1]
    }
    else {
      times.halfMile = times.halfMile.split('.')[0] + '.' + event.target.value
    }
    setRaceDetails({ ...raceDetails, times: times })
    setTimeLeader({ ...timeLeader, halfMile: times.halfMile });
  }

  const handleChangeThirdQuarter = name => event => {
    var times = raceDetails.times;
    if (name === 'thirdQuarter') {
      times.thirdQuarter = event.target.value + '.' + times.thirdQuarter.split('.')[1] || 0
    }
    else {
      times.thirdQuarter = times.thirdQuarter.split('.')[0] + '.' + event.target.value
    }
    setRaceDetails({ ...raceDetails, times: times });
    setTimeLeader({ ...timeLeader, thirdQuarter: times.thirdQuarter });
  }

  const handleChangeMile = name => event => {
    var times = raceDetails.times;
    if (name === 'mile') {
      times.mile = event.target.value + '.' + times.mile.split('.')[1]
    }
    else {
      times.mile = times.mile.split('.')[0] + '.' + event.target.value
    }
    setRaceDetails({ ...raceDetails, times: times })
    setTimeLeader({ ...timeLeader, mile: times.mile });
  }

  const handleChangeFinish = name => event => {
    var times = raceDetails.times;

    if (name === 'finishMinutes') {
      times.finish = event.target.value + ':' + times.finish.split(':')[1]
    }
    else if (name === 'finishSeconds') {
      times.finish = times.finish.split(":")[0] + ":" + event.target.value + '.' + times.finish.split('.')[1]
    }
    else {
      times.finish = times.finish.split('.')[0] + '.' + event.target.value
    }
    setRaceDetails({ ...raceDetails, times: times })
    setTimeLeader({ ...timeLeader, finish: times.finish });
  }

  function saveRaceDetailsHandler() {

    props.loading(true)

    const requestBody = {
      query: `
        mutation UpdateRaceDetails($raceId: ID, $raceDetails: RaceDetailsInput, $retiredHorses: [ID], $horseRaceDetailIds: [ID]){
          updateRaceDetails(raceId: $raceId, raceDetails: $raceDetails, retiredHorses: $retiredHorses, horseRaceDetailIds: $horseRaceDetailIds){
            times{              
              quarterMile
              halfMile
              finish
            }
            trackCondition
            totalHorses
          }
        }          
      `,
      variables: {
        raceId: props.race._id,
        raceDetails: raceDetails,
        retiredHorses: selectedRetiredHorses,
        horseRaceDetailIds: horseRaceDetailsIds.map(val => val._id)
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
        props.loading(false);
        props.hasRaceDetails(props.index);
        setOpenRaceDetails(false)
        props.loadProgramRaces();
      })
      .catch(error => {
        console.log(error)
        //setLoading(false);
      })
  }

  function saveHorseRaceDetailsHandler() {
    props.loading(true)
    if (selectedHorse.claimed && selectedHorse.claimedBy === selectedHorse.stable._id) {
      selectedHorse.claimed = false
      selectedHorse.claimedBy = ''
    }
    //delete selectedHorse.name
    delete selectedHorse.racePositions

    const requestBody = {
      query: `
        mutation UpdateHorseRaceDetail($selectedHorse: SelectedHorse){
          updateHorseRaceDetail(selectedHorse: $selectedHorse){
            times{              
              quarterMile
              halfMile
              finish
            }
            trackCondition
            totalHorses
          }
        }          
      `,
      variables: {
        selectedHorse: selectedHorse
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
        props.loading(false);
        setOpenHorseRaceDetails(false)
        setSelectedHorse({ _id: "", status: "" })
        props.loadProgramRaces();
      })
      .catch(error => {
        console.log(error)
        props.loading(false);
      })
  }

  function onJockeyChange(e) {
    setSelectedHorse({ ...selectedHorse, "jockey": e.target.value, jockeyChanged: selectedHorse.jockey._id !== e.target.value });
  }

  const onEquipMedicationChange = (name, col) => event => {
    var ar = selectedHorse[col];
    if (event.target.checked) {
      ar.push(name);
      setSelectedHorse({ ...selectedHorse, [col]: ar })
    }
    else {
      ar.splice(selectedHorse[col].indexOf(name), 1)
      setSelectedHorse({ ...selectedHorse, [col]: ar })
    }
  }
  const onStableSelection = e => {
    if (e.target.value === selectedHorse.stable._id) {
      setSelectedHorse({ ...selectedHorse, claimed: false, claimedBy: '' })
    }
    else {
      setSelectedHorse({ ...selectedHorse, claimedBy: e.target.value })
    }
  }

  function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[/[0-2]/, ':', /[0-5]/, /[0-9]/, '.', /[0-4]/]}
        placeholderChar={'\u2000'}
        showMask
      />
    );
  }

  const ITEM_HEIGHT = 50;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const horseComponentList = props.race.horses.map(horse => {
    return (
      <Horse key={horse._id} distance={props.race.distance} horse={horse} dateSelected={props.programDate} />
    )
  });

  function checkBodyLength(part, val) {
    return selectedHorse.lengths[part] === val
  }
  function getLongBodyLength(item, val) {
    return selectedHorse.lengths[item].indexOf(val) !== -1
  }

  function getLengthValue(item) {
    let lengthArray = selectedHorse.lengths[item].match(/\d+/g);

    if (lengthArray) {
      return lengthArray[0]
    }
    return ""
  }

  function getShortLengthValue(item) {
    const short = selectedHorse.lengths[item].match(/(NO|HD|NK)/g);
    if (short) {
      return short[0];
    }
  }

  const setLongBodyLength = (e, item, val) => {
    if (e.target.checked) {
      setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, [item]: getLengthValue(item).concat(val) } })
    }
    else {
      setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, [item]: selectedHorse.lengths[item].replace(val, "") } })
    }
  }

  const setLengthTextField = (e, item) => {
    let rep = getShortLengthValue(item)
    setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, [item]: selectedHorse.lengths[item].replace(rep || getLengthValue(item), e.target.value > 0 ? e.target.value : "") } })
  }

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

  const claimingList = [
    { label: "40,000 Libres", value: "40,000 Libres" },
    { label: "60,000 Libres", value: "60,000 Libres" },
    { label: "75,000 Libres", value: "75,000 Libres" },
    { label: "100,000 Libres", value: "100,000 Libres" },
    { label: "75,000 Ganadores de 1 y 2 primeras", value: "75,000 Ganadores de 1 y 2 primeras" },
    { label: "75,000 No Ganadores", value: "75,000 No Ganadores" },
    { label: "125,000 Libres", value: "125,000 Libres" },
    { label: "130,000 Libres", value: "130,000 Libres" },
    { label: "150,000 Ganadores de 1 y 2 primeras", value: "150,000 Ganadores de 1 y 2 primeras" },
    { label: "130,000 No Ganadores", value: "130,000 No Ganadores" },
    { label: "150,000 No Ganadores", value: "150,000 No Ganadores" },
    { label: "175,000 Libres", value: "175,000 Libres" },
    { label: "190,000 Libres", value: "190,000 Libres" },
    { label: "175,000 Ganadores de 1 y 2 primeras", value: "175,000 Ganadores de 1 y 2 primeras" },
    { label: "190,000 No Ganadores", value: "190,000 No Ganadores" },
    { label: "225,000 Libres", value: "225,000 Libres" },
    { label: "225,000 Ganadores de 1 y 2 primeras", value: "225,000 Ganadores de 1 y 2 primeras" },
    { label: "225,000 No Ganadores", value: "225,000 No Ganadores" },
    { label: "260,000 Libres", value: "260,000 Libres" },
    { label: "260,000 Ganadores de 1 y 2 primeras", value: "260,000 Ganadores de 1 y 2 primeras" },
    { label: "300,000 No Ganadores", value: "300,000 No Ganadores" },
    { label: "300,000 Libres", value: "300,000 Libres" },
    { label: "325,000 Ganadores de 1 y 2 primeras", value: "325,000 Ganadores de 1 y 2 primeras" },
    { label: "No Reclamables Libres", value: "No Reclamables Libres" },
    { label: "No Reclamables, Ganadores de 1 y 2 primeras", value: "No Reclamables, Ganadores de 1 y 2 primeras" },
    { label: "No Reclamables, No Ganadores", value: "No Reclamables, No Ganadores" }

  ];


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

      { open &&
        <AddHorseDialog
          id="add-horse"
          open={open}
          keepMounted
          onClose={handleClose}
          jockeys={props.jockeys}
          stables={props.stables}
          trainers={props.trainers}
          date={props.programDate}
          claimings={props.race.claimings}
          horsesqty={props.race.horses.length + 1}
          racenumber={props.race.event}
          distance={props.race.distance}
          onHorseAdded={props.horseaddedtorace}
          raceId={props.race._id}
          index={props.index}
        />
      }

      <AddHorseDialogPrime
        id="add-horse"
        visible={state.displayBasic}
        keepMounted
        onHide={() => setState({ displayBasic: false })}
        jockeys={props.jockeys}
        stables={props.stables}
        trainers={props.trainers}
        date={props.programDate}
        claimings={props.race.claimings}
        horsesqty={props.race.horses.length + 1}
        racenumber={props.race.event}
        distance={props.race.distance}
        onHorseAdded={props.horseaddedtorace}
        raceId={props.race._id}
        index={props.index}
      />

      {/* <Dialog header="Header"  style={{ width: '50vw' }} >
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <label>Claiming</label>
        <Dropdown options={claimingList} filter={true} />
      </Dialog> */}



      {/* RACE DETAILS DIALOG*/}
      {/* <Dialog
        open={openRaceDetails}
        disableBackdropClick
        disableEscapeKeyDown
        onClose={handleCloseRaceDetails}>
        <DialogTitle >Race Details</DialogTitle>
        <DialogContent>
          <form style={{ display: "flex", flexDirection: "column", margin: "auto", width: 'fit-content' }}>
            <FormControl style={{ marginTop: 2, minWidth: 200 }}>
              <InputLabel htmlFor="select-multiple-checkbox">Select Retired Horses</InputLabel>
              <Select
                multiple
                value={selectedRetiredHorses}
                onChange={handleRetirementChange}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => (
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selected.map(value => (
                      <Chip key={value} label={horseRaceDetailsIds.find(detail => detail._id === value).name} style={{ display: 'flex', flexWrap: 'wrap' }} />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {
                  horseRaceDetailsIds.map(raceDetail => (
                    <MenuItem key={raceDetail._id} value={raceDetail._id}>
                      <Checkbox checked={selectedRetiredHorses.indexOf(raceDetail._id) > -1} />
                      <ListItemText primary={raceDetail.name} />
                    </MenuItem>
                  ))
                }
              </Select>

            </FormControl>
            <div>

              <InputLabel htmlFor="formatted-text-mask-input">Track Condition</InputLabel>
              <Select
                value={raceDetails.trackCondition}
                onChange={(e) => setRaceDetails({ ...raceDetails, trackCondition: e.target.value })}
              >
                <MenuItem value={"L"}>L</MenuItem>
                <MenuItem value={"F"}>F</MenuItem>
                <MenuItem value={"H"}>H</MenuItem>
              </Select>

            </div>

            <div>

              <InputLabel htmlFor="formatted-text-mask-input">1/4</InputLabel>
              <Select
                value={timeLeader.quarterMile.split('.')[0]}
                onChange={handleChangeQuater('quarter')}
              >
                <MenuItem value={22}>22</MenuItem>
                <MenuItem value={23}>23</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={26}>26</MenuItem>
                <MenuItem value={27}>27</MenuItem>
              </Select>

              <Select
                value={timeLeader.quarterMile.split('.')[1]}
                onChange={handleChangeQuater('quarterFraction')}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>

            </div>

            <div>

              <InputLabel htmlFor="formatted-text-mask-input">1/2</InputLabel>
              <Select
                value={timeLeader.halfMile.split('.')[0]}
                onChange={handleChangeHalfMile('halfMile')}
                disabled={!raceDetails.times.quarterMile}
              >
                <MenuItem value={'45'}>45</MenuItem>
                <MenuItem value={'46'}>46</MenuItem>
                <MenuItem value={'47'}>47</MenuItem>
                <MenuItem value={'48'}>48</MenuItem>
                <MenuItem value={'49'}>49</MenuItem>
                <MenuItem value={'50'}>50</MenuItem>
              </Select>

              <Select
                value={timeLeader.halfMile.split('.')[1]}
                onChange={handleChangeHalfMile('halfMileFraction')}
                disabled={!raceDetails.times.quarterMile}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>

            </div>

            {
              props.race.distance > 1200 &&
              <div>

                <InputLabel htmlFor="formatted-text-mask-input">3/4</InputLabel>
                <Select
                  value={timeLeader.thirdQuarter.split('.')[0]}
                  onChange={handleChangeThirdQuarter('thirdQuarter')}
                >
                  <MenuItem value={'1:09'}>1:09</MenuItem>
                  <MenuItem value={'1:10'}>1:10</MenuItem>
                  <MenuItem value={'1:11'}>1:11</MenuItem>
                  <MenuItem value={'1:12'}>1:12</MenuItem>
                  <MenuItem value={'1:13'}>1:13</MenuItem>
                  <MenuItem value={'1:14'}>1:14</MenuItem>
                  <MenuItem value={'1:15'}>1:15</MenuItem>
                  <MenuItem value={'1:16'}>1:16</MenuItem>
                  <MenuItem value={'1:17'}>1:17</MenuItem>
                </Select>

                <Select
                  value={timeLeader.thirdQuarter.split('.')[1]}
                  onChange={handleChangeThirdQuarter('halfMileFraction')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>

              </div>
            }

            {
              props.race.distance > 1400 &&
              <div>

                <InputLabel htmlFor="formatted-text-mask-input">mile</InputLabel>
                <Select
                  value={timeLeader.mile.split('.')[0]}
                  onChange={handleChangeMile('mile')}
                >
                  {
                    mileTimes.map(mil => {
                      return <MenuItem key={mil} value={mil}>{mil}</MenuItem>
                    })
                  }
                </Select>

                <Select
                  value={timeLeader.mile.split('.')[1]}
                  onChange={handleChangeMile('mileFraction')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>

              </div>
            }


            <div style={{ display: "flex", alignItems: "baseline" }}>
              <FormControl style={{ margin: 1, minWidth: 40 }}>
                <InputLabel htmlFor="formatted-text-mask-input">Finish</InputLabel>
                <Select
                  value={timeLeader.finish.split(':')[0]}
                  onChange={handleChangeFinish('finishMinutes')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                </Select>
              </FormControl>


              <div>:</div>
              <FormControl style={{ margin: 1, width: 32 }}>
                <TextField
                  value={timeLeader.finish.split(":")[1].split(".")[0]}
                  onChange={handleChangeFinish('finishSeconds')}
                  onFocus={(e) => e.target.select()}
                  style={{ width: 37 }}
                  inputProps={{ 'aria-label': 'bare' }}
                />
              </FormControl>
              <div>.</div>
              <FormControl style={{ margin: 1, minWidth: 40 }}>
                <Select
                  value={timeLeader.finish.split('.')[1]}
                  onChange={handleChangeFinish('finishFraction')}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <InputLabel htmlFor="component-simple">Race URL</InputLabel>
              <Input value={raceDetails.raceUrl} onChange={e => setRaceDetails({ ...raceDetails, raceUrl: e.target.value })} />
            </div>
            <div>
              <InputLabel htmlFor="component-simple">Final Straight URL</InputLabel>
              <Input value={raceDetails.finalStraightUrl} onChange={e => setRaceDetails({ ...raceDetails, finalStraightUrl: e.target.value })} />
            </div>

          </form>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRaceDetails} >
            Close
          </Button>
          <Button color="primary" onClick={saveRaceDetailsHandler}>
            Save
          </Button>
        </DialogActions>

      </Dialog> */}
      {/* RACE DETAILS DIALOG ENDING*/}




      {/* HORSE RACE DETAILS DIALOG START*/}
      {/*<Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openHorseRaceDetails}
        onClose={handleCloseHorseRaceDetails}
        maxWidth='md'
        fullWidth={fullWidth}
      >
        <DialogTitle >Horse Race Details</DialogTitle>
        <DialogContent>
          <form style={{ display: "flex", flexDirection: "column" }}>
            <FormControl style={{ marginTop: 2, width: 250 }}>
              <InputLabel htmlFor="max-width">Select Horse</InputLabel>
              <Select
                value={selectedHorse._id}
                onChange={handleHorseChange}
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
              >
                {
                  props.race.horses.map(horse => {
                    const value = horse.raceDetails.find(detail => props.programDate.toISOString() === detail.date);
                    return <MenuItem key={horse._id} value={value._id}>{horse.name}</MenuItem>
                  })
                }
              </Select>
            </FormControl>

            <FormControl disabled={!selectedHorse.name} style={{ width: 250, margin: 1 }}>
              <label>Race Status</label>
              <Select value={selectedHorse.status} onChange={e => setSelectedHorse({ ...selectedHorse, status: e.target.value })} >
                <MenuItem value={"finished"}>
                  Finished
                </MenuItem>
                <MenuItem value={"disqualified"}>
                  Disqualified
                </MenuItem>
                <MenuItem value={"retired"}>
                  Retired
                </MenuItem>
                <MenuItem value={"dns"}>
                  Did not start
                </MenuItem>
                <MenuItem value={"dnf"}>
                  Did not finish
                </MenuItem>
              </Select>
            </FormControl>

            {
              selectedHorse.name && selectedHorse.status &&
              <React.Fragment>

                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%' }} className="m-2 p-2">
                    <FormControl>
                      <label>Jockey</label>
                      <Dropdown disabled={selectedHorse.status === "retired"} options={jockeys} filter={true} value={selectedHorse.jockey} onChange={onJockeyChange} />
                    </FormControl>

                    <div>
                      <TextField id="jockeyweight" disabled={selectedHorse.status === "retired"}
                        label="Jockey Weight" type="number" onChange={e => setSelectedHorse({ ...selectedHorse, "jockeyWeight": Number(e.target.value) })} keyfilter="pint" value={selectedHorse.jockeyWeight} margin="normal" variant="outlined" />
                    </div>

                    <div>
                      <FormControlLabel
                        control={<Checkbox checked={selectedHorse.claimed} onChange={e => setSelectedHorse({ ...selectedHorse, claimed: e.target.checked, claimedBy: "" })} value="true" />}
                        label="Claimed"
                        labelPlacement="start"
                      />
                    </div>
                    <div>
                      <label>Stable</label>
                      <Dropdown options={stables} filter={true} value={selectedHorse.stable} onChange={e => setSelectedHorse({ ...selectedHorse, stable: e.target.value })} />
                      <label>New Stable</label>
                      <Dropdown disabled={!selectedHorse.claimed} options={stables} filter={true} value={selectedHorse.claimedBy} onChange={onStableSelection} />
                    </div>

                    <div className="d-flex flex-column" >

                      <div className="d-flex m-1" >
                        <div className="d-flex p-2">

                          <div className="d-flex m-1" >
                            <InputLabel>Positions</InputLabel>
                          </div>

                          <div className="d-flex m-1" >
                            <InputLabel>by</InputLabel>
                          </div>
                          <div className="d-flex m-1" >
                            <InputLabel>Length</InputLabel>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex m-1" >
                        <div className="d-flex p-2 align-items-center">
                          <div style={{ marginRight: '10px' }}>
                            <InputLabel>Started</InputLabel>
                          </div>
                          <div>
                            <Select
                              value={selectedHorse.positions.start || ''}
                              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, start: e.target.value } })}
                              input={<OutlinedInput name="start" id="outlined-start-simple" />}
                              disabled={selectedHorse.status === "retired"}
                              style={{ minWidth: 70 }}
                            >
                              {
                                positions.map(el => { return <MenuItem value={el} key={el}>{el}</MenuItem> })
                              }

                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex m-1" >

                        <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
                          <div >
                            <InputLabel>1/4</InputLabel>
                          </div>
                          <div>
                            <Select
                              value={selectedHorse.positions.quarterMile || ''}
                              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, quarterMile: e.target.value } })}
                              input={<OutlinedInput name="quarterMile" />}
                              disabled={selectedHorse.status === "retired"}
                              style={{ minWidth: 70 }}
                            >
                              {
                                positions.map(el => {
                                  return <MenuItem value={el} key={el}>{el}</MenuItem>
                                })
                              }
                            </Select>
                          </div>
                          <div className="d-flex flex-column">
                            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                              control={
                                <Checkbox checked={checkBodyLength("quarterMile", "HD")}
                                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                                  value="HD"
                                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, quarterMile: e.target.value } })}
                                />
                              }
                              label="HD" />
                            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                              control={
                                <Checkbox checked={checkBodyLength("quarterMile", "NK")}
                                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                                  value="NK"
                                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, quarterMile: e.target.value } })}
                                />
                              }
                              label="NK" />
                          </div>

                          <div>
                            <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "quarterMile")} disabled={false} type="number" value={getLengthValue("quarterMile")} margin="normal" variant="outlined" />
                          </div>

                          <div>
                            <FormGroup>
                              <FormControlLabel style={{ margin: '-10px -5px' }}
                                control={<Checkbox checked={getLongBodyLength("quarterMile", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "quarterMile", "¼")} />}
                                label="¼"
                              />
                              <FormControlLabel style={{ margin: '-10px -5px' }}
                                control={<Checkbox checked={getLongBodyLength("quarterMile", "½")} value="½" onChange={(e) => setLongBodyLength(e, "quarterMile", "½")} />}
                                label="½"
                              />
                              <FormControlLabel style={{ margin: '-10px -5px' }}
                                control={<Checkbox checked={getLongBodyLength("quarterMile", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "quarterMile", "¾")} />}
                                label="¾"
                              />
                            </FormGroup>
                          </div>

                        </div>
                      </div>

                      <div className="d-flex m-1" >
                        <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
                          <div >
                            <InputLabel>1/2</InputLabel>
                          </div>
                          <div>
                            <Select
                              value={selectedHorse.positions.halfMile || ''}
                              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, halfMile: e.target.value } })}
                              input={<OutlinedInput name="halfMile" />}
                              disabled={selectedHorse.status === "retired"}
                              style={{ minWidth: 70 }}
                            >
                              {
                                positions.map(el => {
                                  return <MenuItem value={el} key={el}>{el}</MenuItem>
                                })
                              }
                            </Select>
                          </div>
                          <div className="d-flex flex-column">
                            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                              control={
                                <Checkbox checked={checkBodyLength("halfMile", "HD")}
                                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                                  value="HD"
                                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, halfMile: e.target.value } })}
                                />
                              }
                              label="HD" />
                            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                              control={
                                <Checkbox checked={checkBodyLength("halfMile", "NK")}
                                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                                  value="NK"
                                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, halfMile: e.target.value } })}
                                />
                              }
                              label="NK" />
                          </div>

                          <div>
                            <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "halfMile")} disabled={false} type="number" value={getLengthValue("halfMile")} margin="normal" variant="outlined" />
                          </div>
                          <div>
                            <FormGroup>
                              <FormControlLabel style={{ margin: '-10px -5px' }}
                                control={<Checkbox checked={getLongBodyLength("halfMile", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "halfMile", "¼")} />}
                                label="¼"
                              />
                              <FormControlLabel style={{ margin: '-10px -5px' }}
                                control={<Checkbox checked={getLongBodyLength("halfMile", "½")} value="½" onChange={(e) => setLongBodyLength(e, "halfMile", "½")} />}
                                label="½"
                              />
                              <FormControlLabel style={{ margin: '-10px -5px' }}
                                control={<Checkbox checked={getLongBodyLength("halfMile", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "halfMile", "¾")} />}
                                label="¾"
                              />
                            </FormGroup>
                          </div>

                        </div>
                      </div>

                      {
                        selectedHorse.distance > 1200 && (
                          <div className="d-flex m-1" >
                            <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
                              <div >
                                <InputLabel>3/4</InputLabel>
                              </div>
                              <div>
                                <Select
                                  value={selectedHorse.positions.thirdQuarter || 0}
                                  onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, thirdQuarter: e.target.value } })}
                                  input={<OutlinedInput name="thirdQuarter" />}
                                  disabled={selectedHorse.status === "retired"}
                                  style={{ minWidth: 70 }}
                                >
                                  {
                                    positions.map(el => {
                                      return <MenuItem value={el} key={el}>{el}</MenuItem>
                                    })
                                  }
                                </Select>
                              </div>


                              <div className="d-flex flex-column">
                                <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                                  control={
                                    <Checkbox checked={checkBodyLength("thirdQuarter", "HD")}
                                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                                      value="HD"
                                      onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, thirdQuarter: e.target.value } })}
                                    />
                                  }
                                  label="HD" />
                                <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                                  control={
                                    <Checkbox checked={checkBodyLength("thirdQuarter", "NK")}
                                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                                      value="NK"
                                      onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, thirdQuarter: e.target.value } })}
                                    />
                                  }
                                  label="NK" />
                              </div>

                              <div>
                                <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "thirdQuarter")} disabled={false} type="number" value={getLengthValue("thirdQuarter")} margin="normal" variant="outlined" />
                              </div>
                              <div>
                                <FormGroup>
                                  <FormControlLabel style={{ margin: '-10px -5px' }}
                                    control={<Checkbox checked={getLongBodyLength("thirdQuarter", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "thirdQuarter", "¼")} />}
                                    label="¼"
                                  />
                                  <FormControlLabel style={{ margin: '-10px -5px' }}
                                    control={<Checkbox checked={getLongBodyLength("thirdQuarter", "½")} value="½" onChange={(e) => setLongBodyLength(e, "thirdQuarter", "½")} />}
                                    label="½"
                                  />
                                  <FormControlLabel style={{ margin: '-10px -5px' }}
                                    control={<Checkbox checked={getLongBodyLength("thirdQuarter", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "thirdQuarter", "¾")} />}
                                    label="¾"
                                  />
                                </FormGroup>
                              </div>

                            </div>
                          </div>
                        )
                      }


                      {
                        selectedHorse.distance > 1400 && (
                          <div className="d-flex m-1" >
                            <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
                              <div >
                                <InputLabel>Mile</InputLabel>
                              </div>
                              <div>
                                <Select
                                  value={selectedHorse.positions.mile || 0}
                                  onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, mile: e.target.value } })}
                                  input={<OutlinedInput name="mile" />}
                                  disabled={selectedHorse.status === "retired"}
                                  style={{ minWidth: 70 }}
                                >
                                  {
                                    positions.map(el => {
                                      return <MenuItem value={el} key={el}>{el}</MenuItem>
                                    })
                                  }
                                </Select>
                              </div>

                              <div className="d-flex flex-column">
                                <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                                  control={
                                    <Checkbox checked={checkBodyLength("mile", "HD")}
                                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                                      value="HD"
                                      onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, mile: e.target.value } })}
                                    />
                                  }
                                  label="HD" />
                                <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                                  control={
                                    <Checkbox checked={checkBodyLength("mile", "NK")}
                                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                                      value="NK"
                                      onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, mile: e.target.value } })}
                                    />
                                  }
                                  label="NK" />
                              </div>

                              <div>
                                <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "mile")} disabled={false} type="number" value={getLengthValue("mile")} margin="normal" variant="outlined" />
                              </div>
                              <div>
                                <FormGroup>
                                  <FormControlLabel style={{ margin: '-10px -5px' }}
                                    control={<Checkbox checked={getLongBodyLength("mile", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "mile", "¼")} />}
                                    label="¼"
                                  />
                                  <FormControlLabel style={{ margin: '-10px -5px' }}
                                    control={<Checkbox checked={getLongBodyLength("mile", "½")} value="½" onChange={(e) => setLongBodyLength(e, "mile", "½")} />}
                                    label="½"
                                  />
                                  <FormControlLabel style={{ margin: '-10px -5px' }}
                                    control={<Checkbox checked={getLongBodyLength("mile", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "mile", "¾")} />}
                                    label="¾"
                                  />
                                </FormGroup>
                              </div>

                            </div>
                          </div>
                        )
                      }

                      <div className="d-flex m-1" >
                        <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
                          <div >
                            <InputLabel>Fin</InputLabel>
                          </div>
                          <div>
                            <Select
                              value={selectedHorse.positions.finish || ''}
                              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, finish: e.target.value } })}
                              input={<OutlinedInput name="finish" />}
                              disabled={selectedHorse.status === "retired"}
                              style={{ minWidth: 70 }}
                            >
                              {
                                positions.map(el => {
                                  return <MenuItem value={el} key={el}>{el}</MenuItem>
                                })
                              }
                            </Select>
                          </div>
                          <div className="d-flex flex-column">

                            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                              control={
                                <Checkbox checked={checkBodyLength("finish", "NO")}
                                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                                  value="NO"
                                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, finish: e.target.value } })}
                                />
                              }
                              label="NO"
                            />
                            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                              control={
                                <Checkbox checked={checkBodyLength("finish", "HD")}
                                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                                  value="HD"
                                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, finish: e.target.value } })}
                                />
                              }
                              label="HD" />
                            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                              control={
                                <Checkbox checked={checkBodyLength("finish", "NK")}
                                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                                  value="NK"
                                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, finish: e.target.value } })}
                                />
                              }
                              label="NK" />

                          </div>
                          <div>
                            <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "finish")} disabled={false} type="number" value={getLengthValue("finish")} margin="normal" variant="outlined" />
                          </div>
                          <div>
                            <FormGroup>
                              <FormControlLabel style={{ margin: '-10px -5px' }}
                                control={<Checkbox checked={getLongBodyLength("finish", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "finish", "¼")} />}
                                label="¼"
                              />
                              <FormControlLabel style={{ margin: '-10px -5px' }}
                                control={<Checkbox checked={getLongBodyLength("finish", "½")} value="½" onChange={(e) => setLongBodyLength(e, "finish", "½")} />}
                                label="½"
                              />
                              <FormControlLabel style={{ margin: '-10px -5px' }}
                                control={<Checkbox checked={getLongBodyLength("finish", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "finish", "¾")} />}
                                label="¾"
                              />
                            </FormGroup>
                          </div>

                        </div>
                      </div>

                    </div>

                  </div>


                  <div style={{ width: '50%' }} className="m-2 p-2">
                    <div style={{ marginBottom: '15px' }}>
                      <InputLabel htmlFor="formatted-text-mask-input">Finish Time</InputLabel>
                      <Input
                        value={selectedHorse.finishTime}
                        onFocus={(e) => e.target.select()}
                        onBlur={e => {
                          if (e.target.value.trim().length === 6 && e.target.value !== selectedHorse.finishTime) {
                            setSelectedHorse({ ...selectedHorse, finishTime: e.target.value });
                          }
                        }}
                        id="formatted-text-mask-input"
                        inputComponent={TextMaskCustom}
                        disabled={selectedHorse.status === "retired"}
                      />
                    </div>

                    <div>
                      <label>Bet</label>
                      <Dropdown disabled={selectedHorse.status === "retired"} options={bettingList.map(bet => { return { label: bet, value: bet } })} filter={true} value={selectedHorse.bet} onChange={e => setSelectedHorse({ ...selectedHorse, bet: e.target.value })} />
                    </div>

                    <div>
                      <FormLabel component="legend">Horse Equipments</FormLabel>
                      <FormGroup style={{ flexDirection: "row" }}>
                        {
                          horseEquipments.map(eq => {
                            return (
                              <FormControlLabel disabled={selectedHorse.status === "retired"} key={eq}
                                control={<Checkbox checked={selectedHorse.horseEquipments.indexOf(eq) > -1} onChange={onEquipMedicationChange(eq, "horseEquipments")} value={eq} />}
                                label={eq}
                              />
                            )
                          })
                        }
                      </FormGroup>
                    </div>

                    <div>
                      <FormLabel component="legend">Horse Medications</FormLabel>
                      <FormGroup style={{ flexDirection: "row" }}>
                        <FormControlLabel disabled={selectedHorse.status === "retired"}
                          control={<Checkbox checked={selectedHorse.horseMedications.indexOf("L") > -1} onChange={onEquipMedicationChange("L", "horseMedications")} value="L" />}
                          label="L"
                        />
                        <FormControlLabel disabled={selectedHorse.status === "retired"}
                          control={<Checkbox checked={selectedHorse.horseMedications.indexOf("B") > -1} onChange={onEquipMedicationChange("B", "horseMedications")} value="B" />}
                          label="B"
                        />
                      </FormGroup>
                    </div>

                    <div>
                      <h3>Comments</h3>
                      <InputTextarea rows={5} cols={30} value={selectedHorse.comments || ""} onChange={(e) => setSelectedHorse({ ...selectedHorse, comments: e.target.value })} autoResize={true} />
                    </div>

                    <div>
                      <FormControlLabel
                        control={<Checkbox checked={selectedHorse.confirmed} onChange={e => setSelectedHorse({ ...selectedHorse, confirmed: e.target.checked })} value="true" />}
                        label="Confirmed"
                      />
                    </div>

                  </div>
                </div>


              </React.Fragment>
            }
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseHorseRaceDetails} >
            Close
          </Button>
          <Button color="primary" onClick={saveHorseRaceDetailsHandler}>
            Save
          </Button>
        </DialogActions>

      </Dialog>*/}
      {/* HORSE RACE DETAILS DIALOG ENDING*/}


      {/* Loader and Spinner*/}
      {
        loading &&
        <React.Fragment>
          <Backdrop />
          <Spinner />
        </React.Fragment>
      }

      <MainDialog id="mainDialog">
        {dialogList}
      </MainDialog>

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
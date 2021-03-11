import React, { useEffect, useState } from 'react';

import { Dialog } from 'primereact/dialog'

import {
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Input,
  Checkbox, ListItemText, Chip, TextField,
  MenuItem,
  Button
} from '@material-ui/core';

import MaskedInput from 'react-text-mask';

import './RaceDetailsDialog.css';

const RaceDetailsDialog = props => {
  const { ...other } = props;

  const [raceDetails, setRaceDetails] = useState({
    times: {
      quarterMile: "",
      halfMile: '',
      thirdQuarter: '',
      mile: '',
      finish: ''
    },
    totalHorses: props.raceSelected.horses.length,
    hasRaceDetails: true,
    trackCondition: "L",
    raceUrl: "",
    positions: Array(props.raceSelected.horses.length).fill({}),
    finalStraightUrl: ""
  });

  const [selectedRetiredHorses, setSelectedRetiredHorses] = useState([]);

  const horseNameList = []

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
  const horseRaceDetailsIds = props.raceSelected.horses.map(horse => {
    let detail = horse.raceDetails.find(detail => props.date.toISOString() === detail.date);
    horseNameList.push(horse.name)
    return {
      ...detail,
      name: horse.name,
      horseId: horse._id,
      bestTime: horse.bestTimes[props.raceSelected.distance] || ""
    }
  });
  const [timeLeader, setTimeLeader] = useState({
    quarterMile: "23.0",
    halfMile: '47.0',
    thirdQuarter: '1:08.0',
    mile: "1:35.0",
    finish: '0:57.0'
  });

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

  useEffect(() => {
    const totalHorses = props.raceSelected.horses.length - selectedRetiredHorses.length
    setRaceDetails({ ...raceDetails, totalHorses: totalHorses, positions: Array(totalHorses).fill({}) });
  }, [selectedRetiredHorses])

  function handleRetirementChange(e) {
    setSelectedRetiredHorses(e.target.value);
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
        raceId: props.raceSelected._id,
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
        props.loadRace(props.raceSelected._id, props.raceSelected.event)
        props.onClose()
        //props.loadProgramRaces();
      })
      .catch(error => {
        console.log(error)
        //setLoading(false);
      })
  }

  function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={ref => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={props.mask}
        placeholderChar={'\u2000'}
        showMask
      />
    );
  }

  return (
    <Dialog
      {...other}
      onHide={props.onClose}
      disableBackdropClick
      disableEscapeKeyDown
      header="Race Details"
      onClose={props.onClose}
    >
      <DialogContent>
        <form className="details-form">
          <FormControl >
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
          <FormControl>

            <InputLabel htmlFor="formatted-text-mask-input">Track Condition</InputLabel>
            <Select
              value={raceDetails.trackCondition}
              onChange={(e) => setRaceDetails({ ...raceDetails, trackCondition: e.target.value })}
            >
              <MenuItem value={"L"}>L</MenuItem>
              <MenuItem value={"F"}>F</MenuItem>
              <MenuItem value={"H"}>H</MenuItem>
            </Select>

          </FormControl>

          <FormControl>
            <InputLabel htmlFor="formatted-quarter-input">1/4</InputLabel>
            <Input
              value={raceDetails.times.quarterMile}
              onFocus={(e) => e.target.select()}
              onBlur={e => {
                if (e.target.value > 20) {
                  setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, quarterMile: e.target.value } });
                }
                else {
                  setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, quarterMile: '' } });
                }
              }}
              id="formatted-quarter-input"
              inputComponent={TextMaskCustom}
              inputProps={{
                mask: [/[0-2]/, /[1-9]/, '.', /[0-4]/]
              }}
            />

          </FormControl>

          <FormControl>

            <InputLabel htmlFor="formatted-half-input">1/2</InputLabel>
            <Input
              value={raceDetails.times.halfMile}
              onFocus={(e) => e.target.select()}
              onBlur={e => {
                if (e.target.value > 44) {
                  setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, halfMile: e.target.value } });
                }
                else {
                  setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, halfMile: '' } });
                }
              }}
              id="formatted-half-input"
              inputComponent={TextMaskCustom}
              inputProps={{
                mask: [/[4-5]/, /[0-9]/, '.', /[0-4]/]
              }}
            />

          </FormControl>

          {
            props.raceSelected.distance > 1200 &&
            <FormControl>
              <InputLabel htmlFor="formatted-third-quarter-input">3/4</InputLabel>
              <Input
                value={raceDetails.times.thirdQuarter}
                onFocus={(e) => e.target.select()}
                onBlur={e => {
                  if (e.target.value.trim().length === 6) {
                    setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, thirdQuarter: e.target.value } });
                  }
                  else {
                    setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, thirdQuarter: '' } });
                  }
                }}
                id="formatted-third-quarter-input"
                inputComponent={TextMaskCustom}
                inputProps={{
                  mask: [/[1]/, ':', /[1-2]/, /[0-9]/, '.', /[0-4]/]
                }}
              />

            </FormControl>
          }

          {
            props.raceSelected.distance > 1400 &&
            <FormControl>
              <InputLabel htmlFor="formatted-mile-input">Mile</InputLabel>
              <Input
                value={raceDetails.times.mile}
                onFocus={(e) => e.target.select()}
                onBlur={e => {
                  if (e.target.value.trim().length === 6) {
                    setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, mile: e.target.value } });
                  }
                  else {
                    setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, mile: '' } });
                  }
                }}
                id="formatted-mile-input"
                inputComponent={TextMaskCustom}
                inputProps={{
                  mask: [/[1]/, ':', /[3-4]/, /[0-9]/, '.', /[0-4]/]
                }}
              />
            </FormControl>
          }


          <FormControl>
            <InputLabel htmlFor="formatted-finish-input">Finish</InputLabel>
            <Input
              value={raceDetails.times.finish}
              onFocus={(e) => e.target.select()}
              onBlur={e => {
                if (e.target.value.trim().length === 6) {
                  setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, finish: e.target.value } });
                }
                else {
                  setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, finish: '' } });
                }
              }}
              id="formatted-finish-input"
              inputComponent={TextMaskCustom}
              inputProps={{
                mask: props.raceSelected.distance > 1000 ? [/[1-2]/, ':', /[0-5]/, /[0-9]/, '.', /[0-4]/] : [/[0-1]/, ':', /[0-9]/, /[0-9]/, '.', /[0-4]/]
              }}
            />
          </FormControl>

          <TextField label="Race url" value={raceDetails.raceUrl} onChange={e => setRaceDetails({ ...raceDetails, raceUrl: e.target.value })} />

          <TextField label="Finals url" value={raceDetails.finalStraightUrl} onChange={e => setRaceDetails({ ...raceDetails, finalStraightUrl: e.target.value })} />

        </form>

      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} >
          Close
        </Button>
        <Button color="primary" onClick={saveRaceDetailsHandler}>
          Save
        </Button>
      </DialogActions>

    </Dialog>
  )
}

export default RaceDetailsDialog;
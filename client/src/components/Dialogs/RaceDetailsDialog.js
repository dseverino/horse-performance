import React, { useEffect, useMemo, useState } from 'react';

import { Dialog } from 'primereact/dialog'

import {
  Box,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox, ListItemText, Chip, TextField,
  MenuItem,
  Button
} from '@mui/material';

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

  const horseRaceDetailsList = useMemo(() => (props.raceSelected.horses.map(horse => {
    let detail = horse.raceDetails.find(detail => props.date.toISOString() === detail.date);
    horseNameList.push(horse.name)
    return {
      ...detail,
      name: horse.name,
      horseId: horse._id,
      bestTime: horse.bestTimes[props.raceSelected.distance] || ""
    }
  })), [props.raceSelected.horses]);

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
        horseRaceDetailIds: horseRaceDetailsList.map(val => val._id)
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
      style={{ width: '50vw' }}
    >
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>

          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="select-multiple-checkbox">Select Retired Horses</InputLabel>
              <Select
                multiple
                labelId="select-multiple-checkbox"
                id="multiple-chip"
                value={selectedRetiredHorses}
                onChange={handleRetirementChange}
                input={<OutlinedInput id="multiple-select" />}
                renderValue={selected => (
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selected.map(value => (
                      <Chip key={value} label={horseRaceDetailsList.find(detail => detail._id === value).name} style={{ display: 'flex', flexWrap: 'wrap' }} />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {
                  horseRaceDetailsList.map(raceDetail => (
                    <MenuItem key={raceDetail._id} value={raceDetail._id}>
                      <Checkbox checked={selectedRetiredHorses.indexOf(raceDetail._id) > -1} />
                      <ListItemText primary={raceDetail.name} />
                    </MenuItem>
                  ))
                }
              </Select>

            </FormControl>

            <FormControl sx={{ m: 1, width: '25ch' }}>

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

          </div>



          <div>

            <MaskedInput
              mask={[/[2]/, /[1-9]/, '.', /[0-4]/]}
              className="form-control"
              placeholder="1/4"
              label="1/4"
              guide={false}
              onFocus={(e) => e.target.select()}
              onBlur={(e) => {
                if (e.target.value.length < 4) {
                  e.target.select();
                }
              }}
              onChange={(e) => setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, quarterMile: e.target.value } })}
            />
            <MaskedInput
              mask={[/[4-5]/, /[0-9]/, '.', /[0-4]/]}
              className="form-control"
              placeholder="1/2"
              guide={false}
              label="1/2"
              onFocus={(e) => e.target.select()}
              onBlur={(e) => {
                if (e.target.value.length < 4) {
                  e.target.select();
                }
              }}
              onChange={(e) => setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, halfMile: e.target.value } })}
            />

            {
              props.raceSelected.distance > 1200 && (
                <MaskedInput
                  mask={[/[1]/, ':', /[1-2]/, /[0-9]/, '.', /[0-4]/]}
                  className="form-control"
                  placeholder="3/4"
                  guide={false}
                  label="3/4"
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => {
                    if (e.target.value.length < 6) {
                      e.target.select();
                    }
                  }}
                  onChange={(e) => setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, thirdQuarter: e.target.value } })}
                />
              )
            }

            {
              props.raceSelected.distance > 1400 &&
              <MaskedInput
                mask={[/[1]/, ':', /[3-4]/, /[0-9]/, '.', /[0-4]/]}
                className="form-control"
                placeholder="mile"
                guide={false}
                label="mile"
                onFocus={(e) => e.target.select()}
                onBlur={(e) => {
                  if (e.target.value.length < 6) {
                    e.target.select();
                  }
                }}
                onChange={(e) => setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, mile: e.target.value } })}
              />
            }

            <MaskedInput
              mask={props.raceSelected.distance > 1000 ? [/[1-2]/, ':', /[0-5]/, /[0-9]/, '.', /[0-4]/] : [/[0-1]/, ':', /[0-9]/, /[0-9]/, '.', /[0-4]/]}
              className="form-control"
              placeholder="Finish"
              guide={false}
              label="Finish"
              onFocus={(e) => e.target.select()}
              onBlur={(e) => {
                if (e.target.value.length < 6) {
                  e.target.select();
                }
              }}
              onChange={(e) => setRaceDetails({ ...raceDetails, times: { ...raceDetails.times, finish: e.target.value } })}
            />

            <TextField fullWidth sx={{ m: 1 }} label="Race url" value={raceDetails.raceUrl} onChange={e => setRaceDetails({ ...raceDetails, raceUrl: e.target.value })} />

            <TextField sx={{ m: 1, width: '25ch' }} label="Ending url" value={raceDetails.finalStraightUrl} onChange={e => setRaceDetails({ ...raceDetails, finalStraightUrl: e.target.value })} />

          </div>
        </Box>

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
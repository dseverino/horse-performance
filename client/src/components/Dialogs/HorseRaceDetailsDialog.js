import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  Button,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Input,
  Checkbox,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Select,
  TextField,
  useTheme,
  Chip
} from '@mui/material';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import { makeStyles } from '@material-ui/core';

import { IMaskInput } from 'react-imask';
import * as XLSX from 'xlsx';

import { Dialog } from "primereact/dialog";

import { AuthContext } from "../../context/auth-context";
import FreeSoloCreateOptionDialog from './FreeSoloCreateOptionDialog';
import Positions from '../Positions';

import './HorseRaceDetailsDialog.css';
import { saveStable } from '../../services/Services';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch !important',
    },
  },
}));
function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : 900,
  };
}
const HorseRaceDetailsDialog = ({ raceSelected, date, loading, loadRace, onClose, header, visible }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fileRef = useRef();
  let detailsLoaded = useRef([])

  const [autoCompleteValues, setAutoCompleteValues] = useState({
    stable: { name: '', value: '' },
    jockey: { name: '', value: '' },
    claimedBy: { name: '', value: '' }
  })

  const authContext = useContext(AuthContext);

  const [selectedHorse, setSelectedHorse] = useState({ _id: "", status: "", claimedBy: "", comments: "", positions: {}, finishTime: '' })

  const [fullWidth, setFullWidth] = useState(false);

  const horseRaceDetailsList = useMemo(() => {
    return raceSelected.horses.map(horse => {
      let detail = horse.raceDetails.find(detail => date.toISOString() === detail.date);
      return {
        ...detail,
        name: horse.name,
        horseId: horse._id,
        bestTime: horse.bestTimes[raceSelected.distance] || ""
      }
    })
  }, [raceSelected]);

  const [state, setState] = useState({})

  useEffect(() => {
    const elements = ['NO', 'NK', 'HD', "¼", "½", "¾"]
    const parts = ['', "¼", "½", "¾"]
    for (let index = 1; index < 100; index++) {
      for (let j = 0; j < 4; j++) {
        elements.push(`${index}${parts[j]}`);
      }
    }

    setState({
      lengthList: elements.map((val, index) => {
        return <option key={index} value={val}>{val}</option>
      }),
      positions: [...Array(raceSelected.totalHorses).keys()].map(el => ++el).map((val, index) => {
        return <option key={index} value={val}>{val}</option>
      }),
      bettingList: ["1/9", "1/5", "2/5", "1/2", "3/5", "4/5", "1", "6/5", "7/5", "3/2", "8/5", "9/5", "2", "5/2", "3", "7/2", "4", "9/2"].concat([...Array(100).keys()].filter(el => el > 4)).map((val, index) => {
        return <option key={index} value={val}>{val}</option>
      }),
      jockeys: authContext.jockeys.map(jockey => {
        return { name: jockey.name, value: jockey._id }
      }),
      stables: authContext.stables.map(stable => {
        return { name: stable.name, value: stable._id }
      }),
    })
  }, [])

  const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
        mask="#:%0.$"
        definitions={{
          "#": /[0-2]/,
          "%": /[0-9]/,
          "$": /[0-4]/
        }}
        placeholderChar={'\u2000'}
      />
    );
  })

  function handleHorseChange(e, i) {
    const horseRaceDetailSelected = horseRaceDetailsList.find((detail) => detail._id === e.target.value);
    setSelectedHorse({
      ...horseRaceDetailSelected,
      bet: horseRaceDetailSelected.bet || '',
      claimedBy: null,
      trackCondition: raceSelected.trackCondition,
      times: raceSelected.times,
      claimed: false,
      jockey: horseRaceDetailSelected.jockey._id,
      trainer: horseRaceDetailSelected.trainer._id,
      stable: horseRaceDetailSelected.stable._id,
      totalHorses: raceSelected.totalHorses,
      horseEquipments: horseRaceDetailSelected.horseEquipments.slice(),
      horseMedications: horseRaceDetailSelected.horseMedications.slice(),
      beatenLengths: { ...horseRaceDetailSelected.beatenLengths },
      byLengths: { ...horseRaceDetailSelected.byLengths },
      positions: { ...horseRaceDetailSelected.positions },
      status: horseRaceDetailSelected.status || "finished",
      comments: horseRaceDetailSelected.comments || ""
    });
    setAutoCompleteValues({ ...autoCompleteValues, jockey: { name: horseRaceDetailSelected.jockey.name, value: horseRaceDetailSelected.jockey._id }, stable: { name: horseRaceDetailSelected.stable.name, value: horseRaceDetailSelected.stable._id } })
    //setSelectedHorse( JSON.parse( JSON.stringify( horseRaceDetailSelected  ) ) );
  }

  function saveHorseRaceDetailsHandler() {
    loading(true)
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
        loading(false);
        //props.setOpenHorseRaceDetails(false)
        setSelectedHorse({ _id: "", status: "" })
        loadRace(raceSelected._id, raceSelected.event)
        onClose()
      })
      .catch(error => {
        console.log(error)
        loading(false);
      })
  }

  const readExcel = async (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[3];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        fileRef.current.value = '';
        resolve(data);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    });

    promise.then((detailsList) => {
      detailsLoaded.current = detailsList;
      if (detailsList.length) {
        console.log(detailsList)
        //saveRacesHandler(detailsList)
      }
    })
  }

  function handleCloseHorseRaceDetails() {
    setSelectedHorse({ _id: "", status: "" });
    setFullWidth(false)

    onClose();
  }

  function onJockeyChange(id) {
    setSelectedHorse({ ...selectedHorse, jockey: id, jockeyChanged: selectedHorse.jockey._id !== id });
  }

  const onStableSelection = id => {
    if (id === selectedHorse.stable._id) {
      setSelectedHorse({ ...selectedHorse, claimed: false, claimedBy: '' })
    }
    else {
      setSelectedHorse({ ...selectedHorse, claimedBy: id })
    }
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

  async function savedStable(name) {
    loading(true);
    const stable = await saveStable(name)
    loading(false);
    if (stable) {
      setSelectedHorse({ ...selectedHorse, claimedBy: stable._id });
      authContext.addStable(stable);
      setAutoCompleteValues({ ...autoCompleteValues, claimedBy: { name: stable.name, value: stable._id } });
    }
  }


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <React.Fragment>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        onHide={onClose}
        onClose={onClose}
        maxWidth='sm'
        fullWidth={fullWidth}
        header={header}
        visible={visible}
      >
        <DialogContent>
          <>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel id="horse-name-label">Select Horse</InputLabel>
              <Select
                value={selectedHorse._id}
                onChange={handleHorseChange}
                labelId="horse-name-label"
                id="horse-name"
                label="Select Horse"
              >
                {
                  horseRaceDetailsList.map(detail => {
                    return <MenuItem disabled={detail.confirmed} key={detail._id} value={detail._id}>{detail.name}</MenuItem>
                  })
                }
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 200 }} disabled={!selectedHorse.name} >
              <InputLabel>Status result</InputLabel>
              <Select value={selectedHorse.status}
                label="Status result"
                disabled={selectedHorse.status === "retired"}
                onChange={e => setSelectedHorse({ ...selectedHorse, status: e.target.value })}
              >
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
            <FormControl sx={{ m: 1, minWidth: 50 }}>
              <input
                ref={fileRef}
                onChange={(e) => readExcel(e.target.files[0])}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                style={{ display: 'none' }} id="icon-button-file"
                type="file"
              />
              <label htmlFor="icon-button-file">
                <IconButton disabled={!date} component="span" > <i className="pi pi-file-excel" style={{ 'fontSize': '1em' }}></i></IconButton>
              </label>
            </FormControl>
          </>
          {
            selectedHorse.name && selectedHorse.status &&

            (
              <React.Fragment>
                <div className={classes.root} style={{ maxWidth: '490px' }}>
                  <FormControl>
                    <FreeSoloCreateOptionDialog
                      disabled={selectedHorse.status === "retired"}
                      options={state.jockeys}
                      title="Jockey"
                      value={autoCompleteValues.jockey}
                      onChange={onJockeyChange}
                      onCreate={() => { }}
                    />
                  </FormControl>


                  <TextField id="jockeyweight" disabled={selectedHorse.status === "retired"}
                    label="Jockey Weight"
                    type="number"
                    onChange={e => setSelectedHorse({ ...selectedHorse, "jockeyWeight": Number(e.target.value) })}
                    keyfilter="pint"
                    value={selectedHorse.jockeyWeight}
                    margin="normal"
                    variant="outlined"
                  />


                  <FormControl>
                    <FreeSoloCreateOptionDialog
                      options={state.stables}
                      title="Stable"
                      value={autoCompleteValues.stable}
                      onChange={(id) => setSelectedHorse({ ...selectedHorse, stable: id })}
                      onCreate={() => { }}
                    />
                  </FormControl>

                  <FormControlLabel
                    control={<Checkbox checked={selectedHorse.claimed} onChange={e => setSelectedHorse({ ...selectedHorse, claimed: e.target.checked, claimedBy: "" })} value="true" />}
                    label="Claimed"
                  />

                  {
                    selectedHorse.claimed && (
                      <FormControl>
                        <FreeSoloCreateOptionDialog
                          options={state.stables}
                          title="New Stable"
                          value={autoCompleteValues.claimedBy}
                          onChange={onStableSelection}
                          onCreate={savedStable}
                        />
                      </FormControl>
                    )
                  }

                  <FormControl>
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
                  </FormControl>

                  <FormControl>
                    <InputLabel id="equip-chip-label">Equipments</InputLabel>
                    <Select
                      labelId="equip-chip-label"
                      id="equip-mutiple-chip"
                      disabled={selectedHorse.status === "retired"}
                      multiple
                      value={selectedHorse.horseEquipments}
                      onChange={(e) => setSelectedHorse({ ...selectedHorse, horseEquipments: e.target.value })}
                      input={<Input id="select-multiple-chip" />}
                      renderValue={(selected) => (
                        <div>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </div>
                      )}
                      MenuProps={MenuProps}
                    >
                      {['E', 'F', 'G', 'Gs', 'LA'].map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, selectedHorse.horseEquipments, theme)}
                          className="MenuItem"
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel shrink>Bet</InputLabel>
                    <Select
                      native
                      value={selectedHorse.bet}
                      onChange={(e) => setSelectedHorse({ ...selectedHorse, bet: e.target.value })}
                      disabled={selectedHorse.status === "retired"}
                      input={<Input id="bet-select-native" />}
                    >
                      <option aria-label="None" value="" />
                      {
                        state.bettingList
                      }
                    </Select>
                  </FormControl>

                  <FormControl>
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
                  </FormControl>

                </div>



                <div className="d-flex mt-3">
                  <form style={{ width: '35%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                      <InputLabel className="d-flex align-items-end">Positions</InputLabel>

                      <FormControl style={{ width: '3em' }}>
                        <InputLabel shrink>Start</InputLabel>
                        <Select
                          native
                          value={selectedHorse.positions.start}
                          onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, start: e.target.value } })}
                          input={<Input id="start-native" />}
                        >
                          <option aria-label="None" value="" />
                          {
                            state.positions
                          }
                        </Select>
                      </FormControl>
                    </div>

                    <div style={{ display: 'flex', marginBottom: '20px' }}>
                      <InputLabel className="d-flex align-items-end">By Lengths</InputLabel>
                    </div>
                    <div >
                      <InputLabel className="d-flex align-items-end">Beaten Lengths</InputLabel>
                    </div>
                  </form>

                  <form style={{ width: '65%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                    <div className="length-width">
                      <FormControl>
                        <InputLabel shrink>1/4</InputLabel>
                        <Select
                          native
                          value={selectedHorse.positions.quarterMile}
                          onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, quarterMile: e.target.value } })}
                          input={<Input id="quarter-dialog-native" />}
                        >
                          <option aria-label="None" value="" />
                          {
                            state.positions
                          }
                        </Select>
                      </FormControl>

                      <FormControl>
                        <InputLabel shrink>1/2</InputLabel>
                        <Select
                          native
                          value={selectedHorse.positions.halfMile}
                          onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, halfMile: e.target.value } })}
                          input={<Input id="halfMile-dialog-native" />}
                        >
                          <option aria-label="None" value="" />
                          {
                            state.positions
                          }
                        </Select>
                      </FormControl>

                      {
                        raceSelected.distance > 1200 && (
                          <FormControl>
                            <InputLabel shrink>3/4</InputLabel>
                            <Select
                              native
                              value={selectedHorse.positions.thirdQuarter}
                              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, thirdQuarter: e.target.value } })}
                              input={<Input id="thirdQuarter-dialog-native" />}
                            >
                              <option aria-label="None" value="" />
                              {
                                state.positions
                              }
                            </Select>
                          </FormControl>
                        )
                      }

                      {
                        raceSelected.distance > 1400 && (
                          <FormControl>
                            <InputLabel shrink>Mile</InputLabel>
                            <Select
                              native
                              value={selectedHorse.positions.mile}
                              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, mile: e.target.value } })}
                              input={<Input id="mile-dialog-native" />}
                            >
                              <option aria-label="None" value="" />
                              {
                                state.positions
                              }
                            </Select>
                          </FormControl>

                        )
                      }

                      <FormControl>
                        <InputLabel shrink>Finish</InputLabel>
                        <Select
                          native
                          value={selectedHorse.positions.finish}
                          onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, finish: e.target.value } })}
                          input={<Input id="finish-dialog-native" />}
                        >
                          <option aria-label="None" value="" />
                          {
                            state.positions
                          }
                        </Select>
                      </FormControl>

                    </div>


                    <div className="length-width">

                      <Select value={selectedHorse.byLengths.quarterMile}
                        native
                        onChange={(e) => setSelectedHorse({ ...selectedHorse, byLengths: { ...selectedHorse.byLengths, quarterMile: e.target.value } })}
                        input={<Input id="quarterMile-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        {
                          state.lengthList
                        }
                      </Select>

                      <Select value={selectedHorse.byLengths.halfMile}
                        native
                        onChange={(e) => setSelectedHorse({ ...selectedHorse, byLengths: { ...selectedHorse.byLengths, halfMile: e.target.value } })}
                        input={<Input id="halfMile-length-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        {
                          state.lengthList
                        }
                      </Select>

                      {
                        raceSelected.distance > 1200 && (
                          <Select value={selectedHorse.byLengths.thirdQuarter}
                            native
                            onChange={(e) => setSelectedHorse({ ...selectedHorse, byLengths: { ...selectedHorse.byLengths, thirdQuarter: e.target.value } })}
                            input={<Input id="third-length-dialog-native" />}
                          >
                            <option aria-label="None" value="" />
                            {
                              state.lengthList
                            }
                          </Select>
                        )
                      }

                      {
                        raceSelected.distance > 1400 && (
                          <Select value={selectedHorse.byLengths.mile}
                            native
                            onChange={(e) => setSelectedHorse({ ...selectedHorse, byLengths: { ...selectedHorse.byLengths, mile: e.target.value } })}
                            input={<Input id="mile-length-dialog-native" />}
                          >
                            <option aria-label="None" value="" />
                            {
                              state.lengthList
                            }
                          </Select>
                        )
                      }


                      <Select value={selectedHorse.byLengths.finish}
                        native
                        onChange={(e) => setSelectedHorse({ ...selectedHorse, byLengths: { ...selectedHorse.byLengths, finish: e.target.value } })}
                        input={<Input id="finish-length-native" />}
                      >
                        <option aria-label="None" value="" />
                        {
                          state.lengthList
                        }
                      </Select>
                    </div>

                    <div className="length-width">

                      <Select value={selectedHorse.beatenLengths.quarterMile}
                        native
                        onChange={(e) => setSelectedHorse({ ...selectedHorse, beatenLengths: { ...selectedHorse.beatenLengths, quarterMile: e.target.value } })}
                        input={<Input id="quarterMile-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        {
                          state.lengthList
                        }
                      </Select>

                      <Select value={selectedHorse.beatenLengths.halfMile}
                        native
                        onChange={(e) => setSelectedHorse({ ...selectedHorse, beatenLengths: { ...selectedHorse.beatenLengths, halfMile: e.target.value } })}
                        input={<Input id="halfMile-length-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        {
                          state.lengthList
                        }
                      </Select>

                      {
                        raceSelected.distance > 1200 && (
                          <Select value={selectedHorse.beatenLengths.thirdQuarter}
                            native
                            onChange={(e) => setSelectedHorse({ ...selectedHorse, beatenLengths: { ...selectedHorse.beatenLengths, thirdQuarter: e.target.value } })}
                            input={<Input id="third-length-dialog-native" />}
                          >
                            <option aria-label="None" value="" />
                            {
                              state.lengthList
                            }
                          </Select>
                        )
                      }

                      {
                        raceSelected.distance > 1400 && (
                          <Select value={selectedHorse.beatenLengths.mile}
                            native
                            onChange={(e) => setSelectedHorse({ ...selectedHorse, beatenLengths: { ...selectedHorse.beatenLengths, mile: e.target.value } })}
                            input={<Input id="mile-length-dialog-native" />}
                          >
                            <option aria-label="None" value="" />
                            {
                              state.lengthList
                            }
                          </Select>
                        )
                      }


                      <Select value={selectedHorse.beatenLengths.finish}
                        native
                        onChange={(e) => setSelectedHorse({ ...selectedHorse, beatenLengths: { ...selectedHorse.beatenLengths, finish: e.target.value } })}
                        input={<Input id="finish-length-native" />}
                      >
                        <option aria-label="None" value="" />
                        {
                          state.lengthList
                        }
                      </Select>
                    </div>

                  </form>
                </div>

                <div className={classes.root} style={{ marginTop: '1rem' }}>
                  <FormControl>
                    <TextField
                      id="comments"
                      label="Comments"
                      multiline
                      rows={5}
                      variant="outlined"
                      value={selectedHorse.comments}
                      onChange={(e) => setSelectedHorse({ ...selectedHorse, comments: e.target.value })}
                    />
                  </FormControl>


                  <FormControlLabel
                    control={<Checkbox checked={selectedHorse.confirmed} onChange={e => setSelectedHorse({ ...selectedHorse, confirmed: e.target.checked })} value="true" />}
                    label="Confirmed"
                  />
                </div>


              </React.Fragment>
            )


          }

        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseHorseRaceDetails} >
            Close
          </Button>
          <Button color="primary" onClick={saveHorseRaceDetailsHandler}>
            Save
          </Button>
        </DialogActions>

      </Dialog>


    </React.Fragment >
  )
}

export default HorseRaceDetailsDialog;
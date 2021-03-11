import React, { useContext, useState } from "react";

import "./AddHorseDialogPrime.css";

import Backdrop from "../Backdrop/Backdrop";
import Spinner from "../Spinner/Spinner";
import SnackbarSuccess from "../SnackBar/SnackBarSuccess";
import CreateHorseDialog from "../Dialogs/CreateHorseDialog";
import CreateJockeyPage from "../../pages/Jockey/CreateJockey";
import { AuthContext } from "../../context/auth-context";
import FreeSoloCreateOptionDialog from './test';
import { saveJockey, saveStable, saveTrainer } from '../../services/Services';
import HorseLoader from "../HorseLoader";

import { Fieldset } from 'primereact/fieldset';
import { Dialog } from 'primereact/dialog'

import {
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Input,
  InputLabel,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,  
  Chip,
  useTheme,
  makeStyles
} from '@material-ui/core';

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : 900,
    
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch !important',
    },
  },
}));

const AddHorseDialogPrime = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const authContext = useContext(AuthContext);

  const { onClose, open, visible, onHorseAdded, raceSelected, ...other } = props;
  const horsesqty = raceSelected.horses.length + 1;
  const jockeys = authContext.jockeys.map(jockey => {
    return { name: jockey.name, value: jockey._id }
  });

  const [horseNotFound, setHorseNotFound] = React.useState(false);
  const [openCreateJockey, setOpenCreateJockey] = React.useState(false);
  const [autoCompleteValues, setAutoCompleteValues] = useState({
    stable: { name: '', value: '' },
    trainer: { name: '', value: '' },
    jockey: { name: '', value: '' }
  })

  const [values, setValues] = React.useState({
    selectedHorse: null,
    selectedStable: { _id: "" }
  });

  const [openHorseDialog, setOpenHorseDialog] = React.useState(false);

  const [horseRaceDetail, setHorseRaceDetail] = React.useState({
    claiming: "",
    date: props.date,
    discarded: false,
    distance: raceSelected.distance,
    finishTime: "",
    horseAge: 0,
    horseEquipments: ["E", "F"],
    horseMedications: ["B"],
    horseWeight: 0,
    jockey: "",
    jockeyChanged: false,
    jockeyWeight: "",
    raceId: raceSelected._id,
    raceNumber: raceSelected.event,
    stable: "",
    startingPosition: horsesqty,
    trainer: ""
  });


  const [horse, setHorse] = React.useState({ name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "", procedence: "native" });

  const stables = authContext.stables.map(stable => {
    return { name: stable.name, value: stable._id }
  });

  const trainers = authContext.trainers.map(trainer => {
    return { name: trainer.name, value: trainer._id }
  });

  const claimings = (raceSelected.claimings || []).map(claiming => {
    return { label: claiming, value: claiming }
  });

  const [loading, setLoading] = React.useState(false);

  function handleCancel() {
    clearValues()

    onClose();
  }

  function clearValues() {
    setHorse({ name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "", procedence: "native" })
    setValues({ selectedHorse: null, E: true, F: true, G: false, Gs: false, LA: false, B: true, L: false })
    setHorseRaceDetail(prevState => (
      {
        claiming: "",
        date: props.date,
        discarded: false,
        distance: raceSelected.distance,
        finishTime: "",
        horseAge: 0,
        horseEquipments: ["E", "F"],
        horseMedications: ["B"],
        horseWeight: "",
        jockey: "",
        jockeyChanged: false,
        jockeyWeight: "",
        raceId: raceSelected._id,
        raceNumber: raceSelected.event,
        stable: "",
        startingPosition: prevState.startingPosition + 1,
        trainer: ""
      })
    );
  }

  function handleAdd() {
    setLoading(true);
    const requestBody = {
      query: `
        mutation CreateHorseRaceDetail($horseRaceDetail: HorseRaceDetailInput, $horseId: ID){
          createHorseRaceDetail(horseRaceDetail: $horseRaceDetail, horseId: $horseId){
            _id
            startingPosition
          }  
        }          
      `,
      variables: {
        horseRaceDetail: horseRaceDetail, horseId: values.selectedHorse._id
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
        setLoading(false);
        onHorseAdded(props.index, raceSelected._id, values.selectedHorse);
        clearValues()
        //props.onClose()
      })
      .catch(error => {
        console.log(error)
        //setLoading(false);
      })
  }


  const onHorseSelected = (horse) => {
    if (!horse) {
      return
    }
    var eqp = ["E", "F"];
    var medic = ["B"];
    var jockey = ""
    var jockeySelected = {name: '', value: ''}
    var details = horse.raceDetails;

    if (details && details.length === 1) {
      eqp = details[0].horseEquipments;
      medic = details[0].horseMedications;
      jockey = details[0].jockey._id;
      jockeySelected = { name: details[0].jockey.name, value: details[0].jockey._id }
    }
    else if (details.length > 1) {
      eqp = details[details.length - 1].horseEquipments;
      medic = details[details.length - 1].horseMedications;
      jockey = details[details.length - 1].jockey._id;
      jockeySelected = { name: details[details.length - 1].jockey.name, value: details[details.length - 1].jockey._id }
    }

    setHorseRaceDetail({ ...horseRaceDetail, horseAge: horse.age, stable: horse.stable._id, trainer: horse.stable.trainers && horse.stable.trainers.length === 1 ? horse.stable.trainers[0]._id : "", claiming: raceSelected.claimings.length === 1 ? raceSelected.claimings[0] : "", horseWeight: horse.weight || 0, horseEquipments: eqp, horseMedications: medic, jockey: jockey })
    setAutoCompleteValues({
      jockey: jockeySelected,
      stable: { name: horse.stable.name, value: horse.stable._id },
      trainer: { name: horse.stable.trainers[0]?.name || '', value: horse.stable.trainers[0]?._id || '' }
    });
    setValues({ ...values, "selectedHorse": horse });
  }



  const onEquipMedicationChange = (name, col) => event => {
    var ar = horseRaceDetail[col];
    if (event.target.checked) {
      ar.push(name);
      setHorseRaceDetail({ ...horseRaceDetail, [col]: ar })
    }
    else {
      ar.splice(horseRaceDetail[col].indexOf(name), 1)
      setHorseRaceDetail({ ...horseRaceDetail, [col]: ar })
    }
  }


  // React.useEffect(() => {
  //   console.log(autoCompleteValues.stable)
  // }, [autoCompleteValues])


  function onHorseWeightChange(e) {
    setHorseRaceDetail({ ...horseRaceDetail, "horseWeight": Number(e.target.value) || 0 });
  }


  function savedHorse(horse) {
    setSaved(true);
    setOpenHorseDialog(false);
    setHorse({ name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "", procedence: "native" })
    setValues({ ...values, selectedHorse: horse, selectedStable: "" });
    setHorseRaceDetail({ ...horseRaceDetail, horseWeight: horse.weight, horseAge: horse.age, stable: horse.stable._id, trainer: horse.stable.trainers && horse.stable.trainers.length === 1 ? horse.stable.trainers[0]._id : "", claiming: raceSelected.claimings.length === 1 ? raceSelected.claimings[0] : "" });
  }


  function onHorseNotFoundSnackBarClose() {
    setHorseNotFound(false);
    setOpenHorseDialog(true);
  }

  async function savedStable(name) {
    setLoading(true);
    const stable = await saveStable(name)
    setLoading(false);
    if (stable) {
      setHorse({ ...horse, stable: stable._id });
      authContext.addStable(stable);
      setAutoCompleteValues({ ...autoCompleteValues, stable: { name: stable.name, value: stable._id } });
      setHorseRaceDetail({ ...horseRaceDetail, stable: stable._id, trainer: stable.trainers && stable.trainers.length === 1 ? stable.trainers[0]._id : "" })

    }
  }

  async function savedJockey(name) {
    setLoading(true);
    const jockey = await saveJockey(name)
    setLoading(false);
    if (jockey) {
      setHorse({ ...horse, jockey: jockey._id });
      authContext.addJockey(jockey);
      setAutoCompleteValues({ ...autoCompleteValues, jockey: { name: jockey.name, value: jockey._id } });
      setHorseRaceDetail({ ...horseRaceDetail, jockey: jockey._id })
    }
  }

  async function savedTrainer(name) {
    setLoading(true);
    const trainer = await saveTrainer(name)
    setLoading(false);
    if (trainer) {
      setHorse({ ...horse, trainer: trainer._id });
      authContext.addTrainery(trainer);
      setAutoCompleteValues({ ...autoCompleteValues, trainer: { name: trainer.name, value: trainer._id } });
      setHorseRaceDetail({ ...horseRaceDetail, trainer: trainer._id })
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
      {/* Add Horse Dialog*/}
      <Dialog
        {...other}
        visible={visible}
        onHide={handleCancel}
        
      >

        <DialogContent dividers>
          <HorseLoader onHorseSelected={onHorseSelected} horse={horse} load={(val) => setLoading(val)} />
          <div>
            {
              values.selectedHorse &&
              <React.Fragment>
                <div style={{ display: "flex", margin: "10px", justifyContent: "space-between" }}>
                  <div><strong>{values.selectedHorse.name}</strong> Position <strong>{horsesqty}</strong></div>
                  <div>{values.selectedHorse.age} - {values.selectedHorse.color} - {values.selectedHorse.sex}</div>
                  <div>{values.selectedHorse.stable.name}</div>
                </div>
                <Fieldset legend="Race Details">
                  <div className={classes.root} style={{maxWidth: '550px'}}>                    

                    <FormControl>
                      <FreeSoloCreateOptionDialog
                        options={stables}
                        title="Stable"
                        value={autoCompleteValues.stable}
                        onChange={(id) => setHorseRaceDetail({ ...horseRaceDetail, stable: id })}
                        onCreate={savedStable}
                      />
                    </FormControl>

                    <FormControl>
                      <FreeSoloCreateOptionDialog
                        options={trainers}
                        title="Trainer"
                        value={autoCompleteValues.trainer}
                        onChange={(id) => setHorseRaceDetail({ ...horseRaceDetail, trainer: id })}
                        onCreate={savedTrainer}
                      />
                    </FormControl>

                    <FormControl>
                      <InputLabel id="equip-chip-label">Equipments</InputLabel>
                      <Select
                        labelId="equip-chip-label"
                        id="equip-mutiple-chip"
                        multiple
                        value={horseRaceDetail.horseEquipments}
                        onChange={(e) => setHorseRaceDetail({ ...horseRaceDetail, horseEquipments: e.target.value })}
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
                            style={getStyles(name, horseRaceDetail.horseEquipments, theme)}
                            className="MenuItem"
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel component="legend">Medications</FormLabel>
                      <FormGroup style={{ flexDirection: "row" }}>
                        <FormControlLabel
                          control={<Checkbox checked={horseRaceDetail.horseMedications.indexOf("L") > -1} onChange={onEquipMedicationChange("L", "horseMedications")} value="L" />}
                          label="L"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={horseRaceDetail.horseMedications.indexOf("B") > -1} onChange={onEquipMedicationChange("B", "horseMedications")} value="B" />}
                          label="B"
                        />
                      </FormGroup>
                    </FormControl>

                    <FormControl>
                      <FreeSoloCreateOptionDialog
                        options={jockeys}
                        title="Jockey"
                        value={autoCompleteValues.jockey}
                        onChange={(id) => setHorseRaceDetail({ ...horseRaceDetail, jockey: id })}
                        onCreate={savedJockey}
                      />
                    </FormControl>

                    <TextField name="jockeyweight"
                      label="Jockey Weight" type="number" 
                      onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "jockeyWeight": Number(e.target.value) }) } 
                      keyfilter="pint" value={horseRaceDetail.jockeyWeight} 
                      margin="normal" variant="outlined"
                    />

                    <TextField
                      name="weight" onFocus={(e) => e.target.select()}
                      label="Weight" type="number" onChange={onHorseWeightChange} keyfilter="pint" value={horseRaceDetail.horseWeight} margin="normal" variant="outlined"
                    />

                    <FormControl>
                      <InputLabel id="claiming-label">Claiming</InputLabel>
                      <Select
                        labelId="claiming-label"
                        id="claiming"
                        value={horseRaceDetail.claiming}
                        onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "claiming": e.target.value })}
                        label="Claiming"
                      >
                        {
                          claimings.map((claim, index) => {
                            return <MenuItem key={index} value={claim.value}>{claim.label}</MenuItem>
                          })
                        }
                      </Select>
                    </FormControl>    

                    <FormControlLabel
                      control={<Checkbox checked={horseRaceDetail.discarded} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, discarded: e.target.checked })} value="true" />}
                      label="Discarded"
                    />

                  </div>
                </Fieldset>
              </React.Fragment>
            }

          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button disabled={!raceSelected._id} onClick={handleAdd} color="primary">
            Add
        </Button>
        </DialogActions>
      </Dialog>



      {/* Loader and Spinner*/}
      {loading && <React.Fragment>
        <Spinner />
        <Backdrop />
      </React.Fragment>
      }

    </React.Fragment>

  )
}

export default AddHorseDialogPrime;
import React, { useContext, useEffect, useRef, useState } from "react";

import "./AddHorseDialogPrime.css";

import Backdrop from "../Backdrop/Backdrop";
import Spinner from "../Spinner/Spinner";
import { AuthContext } from "../../context/auth-context";
import FreeSoloCreateOptionDialog from './test';
import { loadHorses, saveJockey, saveStable, saveTrainer } from '../../services/Services';
import HorseLoader from "../HorseLoader";

import { Fieldset } from 'primereact/fieldset';
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast';

import * as XLSX from 'xlsx';

import {
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  makeStyles,
  IconButton
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch !important',
    },
  },
}));

const AddHorseDialogPrime = (props) => {
  const [createHorse, setCreateHorse] = useState({ visible: false });
  const [createStable, setCreateStable] = useState({ visible: false });
  const [createTrainer, setCreateTrainer] = useState({ visible: false });
  const [createJockey, setCreateJockey] = useState({ visible: false });

  let horsesLoaded = useRef([])
  let horseObject = useRef({});
  const classes = useStyles();
  const toast = useRef(null);
  const authContext = useContext(AuthContext);

  const { onClose, open, visible, onHorseAdded, raceSelected, ...other } = props;
  const horsesqty = raceSelected.horses.length + 1;
  const jockeys = authContext.jockeys.map(jockey => {
    return { name: jockey.name, value: jockey._id }
  });

  const [autoCompleteValues, setAutoCompleteValues] = useState({
    stable: { name: '', value: '' },
    trainer: { name: '', value: '' },
    jockey: { name: '', value: '' }
  })

  const [selectedHorse, setSelectedHorse] = React.useState({ name: '', stable: { name: '' } });

  const [horseRaceDetail, setHorseRaceDetail] = React.useState({
    claiming: "",
    date: props.date,
    discarded: false,
    distance: raceSelected.distance,
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
    trainer: "",
    finishTime: '0'
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
    setHorse({ name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "", procedence: "native" });
    setHorseRaceDetail(prevState => (
      {
        claiming: "",
        date: props.date,
        discarded: false,
        distance: raceSelected.distance,
        finishTime: "0",
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
    setSelectedHorse({ name: '', stable: { name: '' }, continue: false })
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
        horseRaceDetail: horseRaceDetail, horseId: selectedHorse._id
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

        onHorseAdded(props.index, raceSelected._id, selectedHorse).then((data) => {
          setLoading(false);
          clearValues();
          toast.current.show({ severity: 'success', summary: 'Horse added', detail: 'Horse added to race', life: 3000 });
        })
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
    if (horseObject.current) {
      horseObject.current._id = horse._id;
      horseObject.current.age = horse.age;
      horseObject.current.name = horse.name;
      verifyStable();
    }
    else {
      var eqp = ["E", "F"];
      var medic = ["B"];
      var jockey = ""
      var jockeySelected = { name: '', value: '' }
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
      setSelectedHorse({ ...horse });
    }
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

  async function savedStable(name) {
    setLoading(true);
    const stable = await saveStable(name)
    setLoading(false);
    if (stable) {
      authContext.addStable(stable);
      if (horseObject.current) {
        horseObject.current.stable = stable._id
        verifyTrainer();
      }
      else {
        setHorse({ ...horse, stable: stable._id });
        setAutoCompleteValues({ ...autoCompleteValues, stable: { name: stable.name, value: stable._id } });
        setHorseRaceDetail({ ...horseRaceDetail, stable: stable._id, trainer: stable.trainers && stable.trainers.length === 1 ? stable.trainers[0]._id : "" })
      }
    }
  }

  async function savedJockey(name) {
    setLoading(true);
    const jockey = await saveJockey(name)
    setLoading(false);
    if (jockey) {
      authContext.addJockey(jockey);
      if (horseObject.current) {
        horseObject.current.jockey = jockey._id;
        populateHorseRaceDetail();
      }
      else {
        setAutoCompleteValues({ ...autoCompleteValues, jockey: { name: jockey.name, value: jockey._id } });
        setHorseRaceDetail({ ...horseRaceDetail, jockey: jockey._id })
      }
    }
  }

  async function savedTrainer(name) {
    setLoading(true);
    const trainer = await saveTrainer(name)
    setLoading(false);
    if (trainer) {
      authContext.addTrainer(trainer);
      if (horseObject.current) {
        horseObject.current.trainer = trainer._id;
        verifyJockey();
      }
      else {
        setAutoCompleteValues({ ...autoCompleteValues, trainer: { name: trainer.name, value: trainer._id } });
        setHorseRaceDetail({ ...horseRaceDetail, trainer: trainer._id })
      }
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

  useEffect(() => {

    if (horseObject.current.saveHorse) {
      horseObject.current.saveHorse = false;
      handleAdd();
    }
    else if (!!horsesLoaded.current.length) {
      saveFileHorses();
    }
  }, [selectedHorse.continue])


  const readExcel = async (file) => {
    const promise = new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        res(data);
      }
      fileReader.onerror = (error) => {
        rej(error);
      }
    });

    promise.then((horseList) => {
      horsesLoaded.current = horseList;
      if (horseList.length) {
        saveFileHorses()
      }
    })
  }

  const saveFileHorses = () => {
    horseObject.current = horsesLoaded.current.splice(0, 1)[0];    
    loadHorses(horseObject.current.name).then(res => {
      return res.json()
    })
      .then(data => {
        const horses = data.data.horse;
        if (!!horses.length) {
          horseObject.current._id = horses[0]._id;
          horseObject.current.age = horses[0].age;
          horseObject.current.name = horses[0].name;
          setSelectedHorse({ ...horseObject.current })
          verifyStable()
        }
        else {
          setCreateHorse({ visible: true, name: horseObject.current.name, weight: horseObject.current.weight });
        }
      })
  }

  const verifyStable = () => {
    const st = stables.find(st => {
      return st.name.toLowerCase().includes(horseObject.current.stable.toLowerCase())
    })
    if (st) {
      horseObject.current.stable = st.value
      verifyTrainer()
    }
    else {
      setCreateStable({ visible: true, name: horseObject.current.stable });
    }
  }

  const verifyTrainer = () => {
    const tr = trainers.find(tr => {
      return tr.name.toLowerCase().includes(horseObject.current.trainer.toLowerCase())
    })
    if (tr) {
      horseObject.current.trainer = tr.value
      verifyJockey()
    }
    else {
      setCreateTrainer({ visible: true, name: horseObject.current.trainer })
    }
  }

  const verifyJockey = () => {
    const jo = jockeys.find(jo => {
      return jo.name.toLowerCase().includes(horseObject.current.jockey.toLowerCase())
    })
    if (jo) {
      horseObject.current.jockey = jo.value;
      populateHorseRaceDetail();
    }
    else {
      setCreateJockey({ visible: true, name: horseObject.current.jockey });
    }
  }

  const populateHorseRaceDetail = () => {
    horseObject.current.saveHorse = true;
    setHorseRaceDetail({
      ...horseRaceDetail,
      horseAge: horseObject.current.age,
      stable: horseObject.current.stable,
      trainer: horseObject.current.trainer,
      claiming: horseObject.current.claiming,
      horseWeight: horseObject.current.weight,
      horseEquipments: horseObject.current.equipments?.split(',') || [],
      horseMedications: horseObject.current.medications?.split(',') || [],
      jockey: horseObject.current.jockey,
      jockeyWeight: horseObject.current.jockeyWeight
    });
    setSelectedHorse({ ...horseObject.current });
  }

  return (
    <React.Fragment>
      {/* Add Horse Dialog*/}
      <Dialog
        {...other}
        visible={visible}
        onHide={handleCancel}
      >

        <DialogContent dividers>
          <div className="d-flex">
            <HorseLoader onHorseSelected={onHorseSelected} horse={horse} load={(val) => setLoading(val)} createHorse={createHorse} />
            <input onChange={(e) => readExcel(e.target.files[0])} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" style={{ display: 'none' }} id="icon-button-file" type="file" />
            <label htmlFor="icon-button-file">
              <IconButton component="span" > <i className="pi pi-file-excel" style={{ 'fontSize': '1em' }}></i></IconButton>
            </label>
          </div>

          <div>
            {
              selectedHorse.name &&
              <React.Fragment>
                <div style={{ display: "flex", margin: "10px", justifyContent: "space-between" }}>
                  <div><strong>{selectedHorse.name}</strong> Position <strong>{horsesqty}</strong></div>
                  <div>{selectedHorse.age} - {selectedHorse.color} - {selectedHorse.sex}</div>
                  <div>{selectedHorse.stable.name}</div>
                </div>
                <Fieldset legend="Race Details">

                  <div className={classes.root} style={{ maxWidth: '550px' }}>

                    <FormControl>
                      <FreeSoloCreateOptionDialog
                        options={stables}
                        title="Stable"
                        value={autoCompleteValues.stable}
                        onChange={(id, ref) => setHorseRaceDetail({ ...horseRaceDetail, stable: id })}
                        onCreate={savedStable}
                        create={createStable}
                      />
                    </FormControl>

                    <FormControl>
                      <FreeSoloCreateOptionDialog
                        options={trainers}
                        title="Trainer"
                        value={autoCompleteValues.trainer}
                        onChange={(id) => setHorseRaceDetail({ ...horseRaceDetail, trainer: id })}
                        onCreate={savedTrainer}
                        create={createTrainer}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel component="legend">Equipments</FormLabel>
                      <FormGroup style={{ flexDirection: "row" }}>
                        {
                          ['E', 'F', 'G', 'Gs', 'LA'].map((name) => (
                            <FormControlLabel
                              key={name}
                              label={name}
                              value={name}
                              labelPlacement="top"
                              style={{ margin: '0px 0px' }}
                              control={<Checkbox checked={horseRaceDetail.horseEquipments.includes(name)}
                                onChange={onEquipMedicationChange(name, "horseEquipments")}
                              />}
                            />
                          ))
                        }
                      </FormGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel component="legend">Medications</FormLabel>
                      <FormGroup style={{ flexDirection: "row" }}>
                        <FormControlLabel
                          labelPlacement="top"
                          style={{ margin: '0px 0px' }}
                          control={<Checkbox checked={horseRaceDetail.horseMedications.indexOf("L") > -1} onChange={onEquipMedicationChange("L", "horseMedications")} value="L" />}
                          label="L"
                        />
                        <FormControlLabel
                          labelPlacement="top"
                          style={{ margin: '0px 0px' }}
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
                        create={createJockey}
                      />
                    </FormControl>

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

                    <TextField name="jockeyweight"
                      label="Jockey Weight" type="number"
                      onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "jockeyWeight": Number(e.target.value) })}
                      keyfilter="pint" value={horseRaceDetail.jockeyWeight}
                      margin="normal" variant="outlined"
                    />

                    <TextField
                      name="weight" onFocus={(e) => e.target.select()}
                      label="Weight" type="number" onChange={onHorseWeightChange} keyfilter="pint" value={horseRaceDetail.horseWeight} margin="normal" variant="outlined"
                    />

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

      <Toast ref={toast} />


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
import React from "react";

import "./AddHorseDialog.css";

import Backdrop from "../Backdrop/Backdrop";
import Spinner from "../Spinner/Spinner";
import HorseNameInput from "../TextFields/HorseNameInput";
import SaveHorseButton from "../Buttons/SaveHorseButton";
import SnackbarSuccess from "../SnackBar/SnackBarSuccess";
import SaveStableButton from "../Buttons/SaveStableButton";
import StableInput from "../TextFields/StableNameInput";
import TrainerInput from "../TextFields/TrainerNameInput"
import SaveTrainerButton from "../Buttons/SaveTrainerButton";

import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from "primereact/dropdown";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

const AddHorseDialog = (props) => {

  const nameRef = React.createRef();

  React.useEffect(() => {
    if (props.open) {
      //nameRef.current.focus();
    }
  }, [props.open])

  const { onClose, open, onHorseAdded, raceId, horsesqty, ...other } = props;
  const jockeys = props.jockeys.map(jockey => {
    return { label: jockey.name, value: jockey._id }
  });

  const [saved, setSaved] = React.useState(false)
  const [horseNotFound, setHorseNotFound] = React.useState(false);
  const [createStable, setCreateStable] = React.useState(false);
  const [createTrainer, setCreateTrainer] = React.useState(false);
  const [stable, setStable] = React.useState({ name: "" })
  const [trainer, setTrainer] = React.useState({ name: "" })
  const [stableCreated, setStableCreated] = React.useState(false);
  const [trainerCreated, setTrainerCreated] = React.useState(false);

  const [values, setValues] = React.useState({
    selectedHorse: null,
    selectedStable: { _id: "" }
  });

  const [horseDialog, setHorseDialog] = React.useState(false);

  const [horseRaceDetail, setHorseRaceDetail] = React.useState({
    claiming: "",
    date: props.date,
    discarded: false,
    distance: props.distance,
    finishTime: "0",
    horseAge: 0,
    horseEquipments: ["E", "F"],
    horseMedications: ["B"],
    horseWeight: 0,
    jockey: "",
    jockeyChanged: false,
    jockeyWeight: "",
    raceId: props.raceId,
    raceNumber: props.racenumber,
    stable: "",
    startingPosition: horsesqty,
    trainer: ""
  });

  React.useEffect(() => {
    if (horsesqty) {
      setHorseRaceDetail({ ...horseRaceDetail, startingPosition: horsesqty });
    }
  }, [horsesqty, horseRaceDetail.horseWeight])

  const [horses, setHorses] = React.useState([]);

  const [horse, setHorse] = React.useState({ name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "", procedence: "native" });

  const [stables, setStables] = React.useState(props.stables.map(stable => {
    return { label: stable.name, value: stable._id }
  }));

  const [trainers, setTrainers] = React.useState(props.trainers.map(trainer => {
    return { label: trainer.name, value: trainer._id }
  }));
  const claimings = props.claimings.map(claiming => {
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
    setHorseRaceDetail(
      {
        claiming: "",
        date: props.date,
        discarded: false,
        distance: props.distance,
        finishTime: "0",
        horseAge: 0,
        horseEquipments: ["E", "F"],
        horseMedications: ["B"],
        horseWeight: "",
        jockey: "",
        jockeyChanged: false,
        jockeyWeight: "",
        raceId: props.raceId,
        raceNumber: props.racenumber,
        stable: "",
        startingPosition: horsesqty,
        trainer: ""
      }
    );
    setHorses([])
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
        onHorseAdded(props.index, raceId, values.selectedHorse);
        handleCancel();
      })
      .catch(error => {
        console.log(error)
        //setLoading(false);
      })
  }

  const onHorseHandleChange = e => {
    //let newHorse = Object.assign({}, horse)
    //newHorse[e.target.id] = e.target.value

    setHorse({ ...horse, name: e.target.value })
  }

  function fetchHorses() {
    //setLoading(true);
    const requestBody = {
      query: `
        query Horse($name: String){
          horse(name: $name) {
            _id
            name
            weight
            age
            color
            sex
            sire
            dam
            raceDetails{
              date
              horseEquipments
              horseMedications
              jockey {
                _id
              }
            }
            stable {         
              _id
              name
              trainers {
                _id
                name
              }
            }            
          }
        }
      `,
      variables: {
        name: horse.name
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
        if (resData.data.horse && resData.data.horse.length === 1) {
          var eqp = ["E", "F"];
          var medic = ["B"];
          var jockey = ""
          var details = resData.data.horse[0].raceDetails;
          setValues({ ...values, "selectedHorse": resData.data.horse[0] });
          if (details && details.length === 1) {
            eqp = details[0].horseEquipments;
            medic = details[0].horseMedications;
            jockey = details[0].jockey._id;
          }
          else if (details.length > 1) {
            eqp = details[details.length - 1].horseEquipments;
            medic = details[details.length - 1].horseMedications;
            jockey = details[details.length - 1].jockey._id;
          }

          setHorseRaceDetail(
            {
              ...horseRaceDetail,
              horseAge: resData.data.horse[0].age,
              stable: resData.data.horse[0].stable._id,
              trainer: resData.data.horse[0].stable.trainers && resData.data.horse[0].stable.trainers.length === 1 ? resData.data.horse[0].stable.trainers[0]._id : "",
              claiming: props.claimings.length === 1 ? props.claimings[0] : "",
              horseWeight: resData.data.horse[0].weight || 0,
              horseEquipments: eqp,
              horseMedications: medic,
              jockey: jockey
            }
          );
        }
        else if (resData.data.horse.length > 1) {
          setHorses(resData.data.horse);
          setValues({ ...values, "selectedHorse": null });

          setHorseRaceDetail(
            {
              jockey: "",
              date: props.date, jockeyChanged: false, finishTime: "",
              jockeyWeight: "", trainer: "", stable: "",
              horseWeight: "", startingPosition: props.horsesqty, raceNumber: props.racenumber,
              horseEquipments: ["E", "F"], horseMedications: ["B"], horseAge: 0, distance: props.distance
            }
          );
        }
        else {
          setHorseNotFound(true);
        }
      })
      .catch(error => {
        console.log(error)
        //setLoading(false);
      })
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

  const onHorseSelectionChange = (e) => {
    setValues({ ...values, "selectedHorse": e.value });
    setHorseRaceDetail(
      {
        ...horseRaceDetail,
        horseAge: e.value.age,
        stable: e.value.stable._id,
        trainer: e.value.stable.trainers && e.value.stable.trainers.length === 1 ? e.value.stable.trainers[0]._id : "",
        claiming: props.claimings.length === 1 ? props.claimings[0] : "",
        horseEquipments: e.value.raceDetails.length ? e.value.raceDetails[e.value.raceDetails.length - 1].horseEquipments : ["E", "F"],
        horseMedications: e.value.raceDetails.length ? e.value.raceDetails[e.value.raceDetails.length - 1].horseMedications : ["B"],
        jockey: e.value.raceDetails.length ? e.value.raceDetails[e.value.raceDetails.length - 1].jockey._id : ""
      }
    );
  }

  React.useEffect(() => {
    if (values.selectedHorse) {
      setHorseRaceDetail({ ...horseRaceDetail, horseWeight: values.selectedHorse.weight || "" });
    }
  }, [values.selectedHorse])

  const onStableSelection = (e) => {
    const trainers = values.selectedHorse.stable.trainers;

    setHorseRaceDetail({ ...horseRaceDetail, "stable": e.value, "trainer": trainers.length === 1 ? trainers[0]._id : "" });
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      fetchHorses();
    }
  }

  function onAddTrainerIconClick(event) {
    setCreateTrainer(true);
  }

  function onHorseWeightChange(e) {
    setHorseRaceDetail({ ...horseRaceDetail, "horseWeight": Number(e.target.value) || 0 });
  }

  function onAddHoseIconClick() {
    setHorseDialog(true)
  }

  function closeHorseDialog() {
    setHorseDialog(false)
    setHorse({ name: "", weight: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", procedence: "native" });
    setValues({ ...values, selectedStable: {} })
  }

  function onHorseValueChangeHandler(name, value) {
    setHorse({ ...horse, [name]: value })
  }

  function savedHorse(horse) {
    setSaved(true);
    setHorseDialog(false);
    setHorse({ name: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "", procedence: "native" })
    setValues({ ...values, selectedHorse: horse, selectedStable: "" });
    setHorseRaceDetail({ ...horseRaceDetail, horseWeight: horse.weight, horseAge: horse.age, stable: horse.stable._id, trainer: horse.stable.trainers && horse.stable.trainers.length === 1 ? horse.stable.trainers[0]._id : "", claiming: props.claimings.length === 1 ? props.claimings[0] : "" });
  }

  function onValidateHorse(horse) {
    if (horse) {
      setHorse(
        {
          name: "",
          weight: 0,
          age: 3,
          color: "Z",
          sex: "M",
          sire: "",
          dam: "",
          stable: ""

        }
      )
    }
  }

  function onHorseSnackBarClose(e, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSaved(false);
    setHorse({ name: "", weight: "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", procedence: "native" });
    setValues({ ...values, selectedStable: {} })
  }

  function onHorseNotFoundSnackBarClose() {
    setHorseNotFound(false);
    setHorseDialog(true);
  }

  function onHorseStableChangeHandler(e) {
    setHorse({ ...horse, stable: e.target.value })
    setValues({ ...values, selectedStable: e.target.value })
  }

  function onCloseCreateStableDialog() {
    setCreateStable(false);
    setStable({ name: "" })
  }

  function onCloseCreateTrainerDialog() {
    setCreateTrainer(false);
    setTrainer({ name: "" })
  }

  function onStableNameHandlerChange(value) {
    setStable({ name: value })
  }

  function onTrainerNameHandlerChange(value) {
    setTrainer({ name: value })
  }

  function onValidateStable(stable) {
    if (stable) {
      setStable({ name: "" })
    }
  }

  function onValidateTrainer(trainer) {
    if (trainer) {
      setTrainer({ name: "" })
    }
  }

  function onAddStableIconClick() {
    setCreateStable(true);
  }

  function savedStable(stable) {
    if (stable) {
      setCreateStable(false);
      setStableCreated(true);
      let newHorse = Object.assign({}, horse);
      newHorse["stable"] = stable._id;
      setHorse(newHorse);
      setValues({ ...values, selectedStable: stable._id });
      setStables([...stables, { label: stable.name, value: stable._id }]);
    }
  }

  function savedTrainer(trainer) {
    if (trainer) {
      setCreateTrainer(false);
      setTrainerCreated(true);
      setTrainers([...trainers, { label: trainer.name, value: trainer._id }]);
      setHorseRaceDetail({ ...horseRaceDetail, "trainer": trainer._id })
    }
  }

  function onStableSnackBarClose() {
    setStableCreated(false);
    setStable({ name: "" })
  }

  function onTrainerSnackBarClose() {
    setTrainerCreated(false);
    setTrainer({ name: "" })
  }

  function handleChangeHorseProcedence(e) {
    setHorse({ ...horse, procedence: e.target.value })
  }

  return (
    <React.Fragment>
      {/* Add Horse Dialog*/}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={open}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Add Horse</DialogTitle>
        <DialogContent dividers>
          <div>
            <InputLabel htmlFor="component-simple">Name</InputLabel>
            <Input inputRef={nameRef} name="name" value={horse.name} onChange={onHorseHandleChange} onKeyPress={handleKeyPress} />

            <Button variant="outlined" onClick={fetchHorses} style={{ marginLeft: "15px", marginBottom: "5px" }}>
              Search
            </Button>
            <span>
              <AddIcon color="secondary" onClick={onAddHoseIconClick}></AddIcon>
            </span>
          </div>
          <div>
            {
              horses.length > 0 && !values.selectedHorse &&
              <DataTable value={horses} selectionMode="single" selection={values.selectedHorse} onSelectionChange={onHorseSelectionChange}>
                <Column selectionMode="single" style={{ width: '3em' }} />
                <Column field="name" header="Name" />
                <Column field="age" header="Age" />
                <Column field="color" header="Color" />
                <Column field="sex" header="Sex" />
                <Column field="stable.name" header="Stable" />
              </DataTable>
            }
            {
              values.selectedHorse &&
              <React.Fragment>
                <div style={{ display: "flex", margin: "10px", justifyContent: "space-between" }}>
                  <div><strong>{values.selectedHorse.name}</strong></div>
                  <div>{values.selectedHorse.age} - {values.selectedHorse.color} - {values.selectedHorse.sex}</div>
                  <div>{values.selectedHorse.stable.name}</div>
                </div>
                <Fieldset legend="Race Details">
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "50%" }}>
                      <div>
                        Starting Position <strong>{horsesqty}</strong>
                      </div>
                      <div>
                        <label>Jockey</label>
                        <Dropdown options={jockeys} filter={true} value={horseRaceDetail.jockey} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "jockey": e.value })} />
                      </div>
                      <div>
                        <TextField name="jockeyweight"
                          label="Jockey Weight" type="number" onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "jockeyWeight": Number(e.target.value) })} keyfilter="pint" value={horseRaceDetail.jockeyWeight} margin="normal" variant="outlined" />
                      </div>
                      <div>
                        <label>Stable</label>
                        <Dropdown options={stables} filter={true} value={horseRaceDetail.stable} onChange={onStableSelection} />
                      </div>
                      <div>
                        <label>Trainer</label>
                        <div>
                          <Dropdown options={trainers} filter={true} value={horseRaceDetail.trainer} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "trainer": e.value })} />
                          <span>
                            <AddIcon color="secondary" onClick={onAddTrainerIconClick}></AddIcon>
                          </span>
                        </div>
                      </div>
                      <div>
                        <FormControlLabel
                          control={<Checkbox checked={horseRaceDetail.discarded} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, discarded: e.target.checked })} value="true" />}
                          label="Discarded" labelPlacement="start"
                        />
                      </div>
                    </div>
                    <div style={{ width: "50%" }}>
                      <div>
                        <TextField name="weight"
                          label="Weight" type="number" onChange={onHorseWeightChange} keyfilter="pint" value={horseRaceDetail.horseWeight} margin="normal" variant="outlined" />
                      </div>
                      <div>
                        <label>Claiming</label>
                        <Dropdown options={claimings} filter={true} value={horseRaceDetail.claiming} onChange={e => setHorseRaceDetail({ ...horseRaceDetail, "claiming": e.value })} />
                      </div>
                      <div>
                        <FormLabel component="legend">Horse Equipments</FormLabel>
                        <FormGroup style={{ flexDirection: "row" }}>
                          <FormControlLabel
                            control={<Checkbox checked={horseRaceDetail.horseEquipments.indexOf("E") > -1} onChange={onEquipMedicationChange("E", "horseEquipments")} value="E" />}
                            label="E"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={horseRaceDetail.horseEquipments.indexOf("F") > -1} onChange={onEquipMedicationChange("F", "horseEquipments")} value="F" />}
                            label="F"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={horseRaceDetail.horseEquipments.indexOf("G") > -1} disabled={horseRaceDetail.horseEquipments.indexOf("Gs") > -1} onChange={onEquipMedicationChange("G", "horseEquipments")} value="G" />}
                            label="G"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox checked={horseRaceDetail.horseEquipments.indexOf("Gs") > -1} disabled={horseRaceDetail.horseEquipments.indexOf("G") > -1} onChange={onEquipMedicationChange("Gs", "horseEquipments")} value="Gs" />}
                            label="Gs"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox checked={horseRaceDetail.horseEquipments.indexOf("LA") > -1} onChange={onEquipMedicationChange("LA", "horseEquipments")} value="LA" />}
                            label="LA"
                          />
                        </FormGroup>
                      </div>
                      <div>
                        <FormLabel component="legend">Horse Medications</FormLabel>
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
                      </div>
                    </div>
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
          <Button disabled={!props.raceId} onClick={handleAdd} color="primary">
            Add
        </Button>
        </DialogActions>
      </Dialog>


      {/* Create Horse Dialog
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={horseDialog}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Create Horse</DialogTitle>
        <DialogContent dividers style={{ display: "flex" }}>
          <div style={{ margin: "0px 10px" }}>
            <div>
              <HorseNameInput validateHorse={onValidateHorse} id="name" change={onHorseHandleChange} nameValue={horse.name} />
            </div>
            <div>
              <TextField
                name="weight"
                type="number"
                variant="outlined"
                label="Weight"
                value={horse.weight}
                onChange={e => onHorseValueChangeHandler(e.target.name, parseInt(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Lbs</InputAdornment>,
                }}
              />
            </div>
            <div>
              <label htmlFor="age">Age</label>
              <select className="form-control" onChange={e => onHorseValueChangeHandler(e.target.name, parseInt(e.target.value))} name="age" value={horse.age}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
              </select>
            </div>
            <div>
              <label htmlFor="color">Color</label>
              <select className="form-control" onChange={e => onHorseValueChangeHandler(e.target.name, e.target.value)} name="color" value={horse.color}>
                <option value="Z">Z</option>
                <option value="Zo">Zo</option>
                <option value="A">A</option>
                <option value="R">R</option>
                <option value="Ro">Ro</option>
              </select>
            </div>
            <div>
              <RadioGroup
                aria-label="procedence"
                name="procedence"
                value={horse.procedence}
                onChange={handleChangeHorseProcedence}
              >
                <FormControlLabel
                  value="native"
                  control={<Radio color="primary" />}
                  label="Native"
                />
                <FormControlLabel
                  value="imported"
                  control={<Radio color="primary" />}
                  label="Imported"
                />
              </RadioGroup>
            </div>
          </div>
          <div style={{ margin: "0px 10px" }}>
            <div>
              <label htmlFor="sex">Sex</label>
              <select className="form-control" name="sex" value={horse.sex} onChange={e => onHorseValueChangeHandler(e.target.name, e.target.value)}>
                <option value="M">M</option>
                <option value="Mc">Mc</option>
                <option value="H">H</option>
              </select>
            </div>
            <div>
              <TextField label="Sire" name="sire" onChange={e => onHorseValueChangeHandler(e.target.name, e.target.value)} value={horse.sire} margin="normal" variant="outlined" />
            </div>
            <div>
              <TextField label="Dam" name="dam" onChange={e => onHorseValueChangeHandler(e.target.name, e.target.value)} value={horse.dam} margin="normal" variant="outlined" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="stable">Stable</label>
              <div>
                <Dropdown name="stable" filter={true} value={values.selectedStable} options={stables} onChange={onHorseStableChangeHandler} placeholder="Select a Stable" />
                <span>
                  <AddIcon color="secondary" onClick={onAddStableIconClick}></AddIcon>
                </span>
              </div>
            </div>

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHorseDialog} >
            Close
          </Button>
          <SaveHorseButton horse={horse} savedHorse={savedHorse}></SaveHorseButton>
        </DialogActions>
      </Dialog>
      {/*Create Horse Dialog END....*/}


      {/* Create Stable Dialog */}
      {/* <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={createStable}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Create Stable</DialogTitle>
        <DialogContent dividers style={{ display: "flex" }}>
          <div style={{ margin: "0px 10px" }}>
            <StableInput validateStable={onValidateStable} change={onStableNameHandlerChange} name={stable.name} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseCreateStableDialog} >
            Cancel
          </Button>
          <SaveStableButton stable={stable} savedStable={savedStable} />
        </DialogActions>
      </Dialog> */}


      {/* Create Trainer Dialog */}
      {/* <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={createTrainer}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Create Trainer</DialogTitle>
        <DialogContent dividers style={{ display: "flex" }}>
          <div style={{ margin: "0px 10px" }}>
            <TrainerInput validateTrainer={onValidateTrainer} change={onTrainerNameHandlerChange} name={trainer.name} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseCreateTrainerDialog} >
            Cancel
          </Button>
          <SaveTrainerButton trainer={trainer} savedTrainer={savedTrainer} />
        </DialogActions>
      </Dialog> */}


      {/*Horse Created Snackbar*/}
      <SnackbarSuccess
        open={saved}
        onClose={onHorseSnackBarClose}
        variant={"success"}
        message={`Horse ${horse.name} Created!`}
        autoHideDuration={5000}
      >
      </SnackbarSuccess>

      {/*Horse Not Exist Snackbar*/}
      <SnackbarSuccess
        open={horseNotFound}
        onClose={onHorseNotFoundSnackBarClose}
        variant={"warning"}
        message="Horse not found!"
        autoHideDuration={1000}
      >
      </SnackbarSuccess>

      {/*Stable Created Snackbar*/}
      <SnackbarSuccess
        open={stableCreated}
        onClose={onStableSnackBarClose}
        variant={"success"}
        message={`Stable ${stable.name} created!`}
        autoHideDuration={3000}
      >
      </SnackbarSuccess>

      {/*Trainer Created Snackbar*/}
      <SnackbarSuccess
        open={trainerCreated}
        onClose={onTrainerSnackBarClose}
        variant={"success"}
        message={`Trainer ${trainer.name} created!`}
        autoHideDuration={3000}
      >
      </SnackbarSuccess>


      {/* Loader and Spinner*/}
      {loading && <React.Fragment>
        <Spinner />
        <Backdrop />
      </React.Fragment>
      }

    </React.Fragment>

  )
}

export default AddHorseDialog;
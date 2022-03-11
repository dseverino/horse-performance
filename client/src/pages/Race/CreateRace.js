import React, { useRef, useContext, useState, useEffect } from "react";

import { AuthContext } from "../../context/auth-context";

import SnackbarSuccess from "../../components/SnackBar/SnackBarSuccess";

import {
  Button,
  Chip,
  Grid,
  Input,
  OutlinedInput,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  FormLabel,
  FormGroup,
  Checkbox,
  FormControlLabel,
  IconButton
} from '@material-ui/core';

import {
  TextField
} from '@mui/material';

import AddIcon from '@material-ui/icons/Add';

import { Calendar } from 'primereact/calendar';
import NumberFormat from 'react-number-format';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button as BtnPrime } from 'primereact/button';

import Backdrop from "../../components/Backdrop/Backdrop";
import Spinner from "../../components/Spinner/Spinner";

import * as XLSX from 'xlsx';
///import NumberFormat from 'react-number-format';

import "./Race.css"
import { saveRaces } from "../../services/Services";

export default function CreateRacePage(props) {
  const authContext = useContext(AuthContext);
  const toast = useRef();
  const fileRef = useRef();
  let racesLoaded = useRef([])

  let events = [
    1,
    2,
    3,
    4,
    5,
    6,
  ]


  const [state, setState] = useState({
    creating: false,
    races: [],
    isLoading: false,
    programExist: false,
    programNotExist: false,
    programNumber: '',
    programId: '',
    visible: false,
    created: false,
    labelWidth: 0,
    raceDialog: false
  })
  const [race, setRace] = useState({
    event: 1,
    distance: 1100,
    procedences: [],
    horseAge: "3 Años y Mayores",
    claimings: [],
    purse: 0,
    date: "",
    programId: "",
    spec: ""
  })
  const [date, setDate] = useState('');

  const onProgramDateChange = (e) => {
    setDate(e.target.value);
  }

  useEffect(() => {
    if (date) {
      loadProgram()
    }
  }, [date])

  const loadProgram = () => {
    setState({ ...state, isLoading: true })
    const requestBody = {
      query: `
        query SingleProgram($date: String!) {
          singleProgram(date: $date) {
            _id
            number
            races{
              event
              distance
              procedences
              horseAge
              claimings
              purse
              spec
            }
          }
        }
      `,
      variables: {
        date
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
        return result.json()
      })
      .then(resData => {
        if (resData && resData.data.singleProgram) {
          setState({ ...state, programExist: true, isLoading: false, programId: resData.data.singleProgram._id, races: resData.data.singleProgram.races, programNumber: resData.data.singleProgram.number });
        }
        else {
          setState({ ...state, isLoading: false, programNotExist: true, programExist: false });
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const clearValuesHandler = () => {
    let newRrace = {
      ...race,
      event: race.event + 1,
      distance: 1100,
      procedences: [],
      horseAge: "3 Años y Mayores",
      claimings: [],
      purse: 0,
      spec: ""
    }
    setRace({ ...newRrace })
  }

  const notExistHandler = () => {
    setState({ ...state, programNotExist: false })
    props.history.push("/createprogram")
  }

  const onHandleChange = (e) => {
    let newRace = Object.assign({}, race);
    newRace[e.target.id || e.target.name] = e.target.value;
    setRace({ ...newRace });
  }

  const onNumberChangeHandler = (e) => {
    setRace({ ...race, purse: parseInt(e.target.value) });
  }

  const saveHandler = (event) => {
    setState({ ...state, isLoading: true })
    const requestBody = {
      query: `
        mutation CreateRace($race: RaceInput) {
          createRace(raceInput: $race) {
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
        race: race
      }
    }

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
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Race created', life: 5000 })
        setState({ ...state, races: [...races, resData.data.createRace], isLoading: false });
        clearValuesHandler();
      })
      .catch(error => {
        console.log(error);
      })
  }

  const onProcedencesChange = (e) => {
    let newRace = Object.assign({}, race);
    if (e.target.checked)
      newRace.procedences.push(e.target.value);
    else
      newRace.procedences.splice(newRace.procedences.indexOf(e.target.value), 1);
    setRace({ ...newRace });
  }

  const handleClose = (event, reason) => {
    setState({ ...state, created: false });
  };

  const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        prefix="$"
      />
    );
  });

  const raceDialogFooter = (
    <React.Fragment>
      <BtnPrime label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setState({ ...state, raceDialog: false })} />
      <BtnPrime label="Save" icon="pi pi-check" className="p-button-text" onClick={saveHandler} />
    </React.Fragment>
  );

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Races</h5>
    </div>
  );

  const claimingsBodyTemplate = (rowData) => {
    return <span>{rowData.claimings.join(", ")}</span>;
  }

  const readExcel = async (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[2];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        fileRef.current.value = '';
        resolve(data);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    });

    promise.then((racesList) => {
      racesLoaded.current = racesList;
      if (racesList.length) {
        saveRacesHandler(racesList)
      }
    })
  }

  const saveRacesHandler = async (raceList) => {
    setState({ ...state, isLoading: true })
    const list = raceList.map((rac) => (
      {
        ...rac,
        programId: state.programId,
        date,
        horseAge: String(rac.horseAge),
        procedences: rac.procedences.split(","),
        claimings: rac.claimings.split(",").map((c) => c.trim())
      }
    ))
    const savedRaces = await saveRaces(list);
    if(savedRaces){
      setState({ ...state, races: savedRaces, isLoading: false })
    }
  }


  const distances = [
    { label: "1,000 Metros", value: 1000 },
    { label: "1,100 Metros", value: 1100 },
    { label: "1,200 Metros", value: 1200 },
    { label: "1,300 Metros", value: 1300 },
    { label: "1,400 Metros", value: 1400 },
    { label: "1,700 Metros", value: 1700 },
    { label: "1,800 Metros", value: 1800 },
    { label: "1,900 Metros", value: 1900 },
    { label: "2,000 Metros", value: 2000 },
  ]
  const claimings = [
    { label: "60,000 Libres", value: "L 60,000" },
    { label: "100,000 Libres", value: "L 100,000" },
    { label: "100,000 Ganadores de 1 y 2 primeras", value: "G 100,000" },
    { label: "100,000 No Ganadores", value: "M 100,000" },
    { label: "150,000 Libres", value: "L 150,000" },
    { label: "150,000 Ganadores de 1 y 2 primeras", value: "G 150,000" },
    { label: "150,000 No Ganadores", value: "M 150,000" },
    { label: "190,000 Libres", value: "L 190,000" },
    { label: "175,000 Ganadores de 1 y 2 primeras", value: "G 175,000" },
    { label: "190,000 No Ganadores", value: "M 190,000" },
    { label: "225,000 Libres", value: "L 225,000" },
    { label: "225,000 Ganadores de 1 y 2 primeras", value: "G 225,000" },
    { label: "225,000 No Ganadores", value: "M 225,000" },
    { label: "300,000 Libres", value: "L 300,000" },
    { label: "300,000 Ganadores de 1 y 2 primeras", value: "G 300,000" },
    { label: "300,000 No Ganadores", value: "M 300,000" },
    { label: "325,000 Ganadores de 1 y 2 primeras", value: "G 325,000" },
    { label: "325,000 No Ganadores", value: "M 325,000" },
    { label: "No Reclamables Libres", value: "L NoRec" },
    { label: "No Reclamables, Ganadores de 1 y 2 primeras", value: "G NoRec" },
    { label: "No Reclamables, No Ganadores", value: "M NoRec" }

  ];
  const ages = [
    { label: "2 Años", value: "2 Años" },
    { label: "3 Años", value: "3 Años" },
    { label: "3 Años y Mayores", value: "3 Años y Mayores" }
  ];

  return (
    <React.Fragment>
      <Toast ref={toast} />

      <Grid container justify="flex-start" alignItems="center" spacing={3}>
        <Grid item>
          <Calendar
            readOnlyInput
            dateFormat="dd/mm/yy"
            placehoder="Date"
            id="date"
            value={date} onChange={onProgramDateChange} showIcon
          />
        </Grid>
        <Grid item>
          <TextField id="number" style={{ marginTop: '7px' }}
            label="Number" disabled={true} keyfilter="pint" value={state.programNumber} margin="normal" variant="outlined"
          />
        </Grid>
        <Grid item>
          <Button disabled={!state.programExist} style={{ height: '57px' }} onClick={() => setState({ ...state, raceDialog: true })} color="secondary" variant="outlined" startIcon={<AddIcon />}>
            New
          </Button>
        </Grid>
        <Grid item>
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
        </Grid>
        <Grid item>
          <label htmlFor="icon-button-file">
            <IconButton disabled={!date} component="span" > <i className="pi pi-arrow-right" style={{ 'fontSize': '1em' }}></i></IconButton>
          </label>
        </Grid>
      </Grid>

      <Toolbar style={{ paddingLeft: 2, paddingRight: 1 }}><Typography style={{ flex: '1 1 100%' }} variant="h6" component="div">Races</Typography></Toolbar>
      <DataTable value={state.races} dataKey='id'>
        <Column field="event" header="Event"></Column>
        <Column field="distance" header="Distance"></Column>
        <Column field="procedences" header="Procedences" body={(data) => <span>{data.procedences.join(", ")}</span>}></Column>
        <Column field="horseAge" header="Age"></Column>
        <Column field="claimings" header="Claimings" body={claimingsBodyTemplate}></Column>
        <Column field="purse" header="Purse" body={(rowData) => <span>{parseInt(rowData.purse).toLocaleString()}</span>}></Column>
        <Column field="spec" header="Spec"></Column>
      </DataTable>


      {/* <button disabled={!state.programExist} className="btn btn-secondary">
          Cancel
        </button>
        <button disabled={!state.programExist} onClick={saveHandler} className="btn btn-primary">
          Save
        </button> */}

      {
        state.isLoading &&
        <React.Fragment>
          <Backdrop />
          <Spinner />
        </React.Fragment>
      }

      <Dialog visible={state.raceDialog} header="Race Details" modal className="p-fluid" footer={raceDialogFooter} onHide={() => setState({ ...state, raceDialog: false })}>
        <form className="container-dialog p-fluid">

          <TextField disabled={true} value={race.event} id="event" label="Event" />

          <FormControl style={{ width: "200px" }}>
            <InputLabel htmlFor="distance">
              Distance
            </InputLabel>
            <Select value={race.distance} native onChange={(e) => setRace({ ...race, distance: parseInt(e.target.value) })} name="distance" id="distance" >
              {
                distances.map(distance => {
                  return <option key={distance.value} value={distance.value}>{distance.label}</option>
                })
              }
            </Select>
          </FormControl>

          <TextField id="purse" label="Purse"
            onChange={onNumberChangeHandler}
            value={race.purse}
            margin="normal"
            onFocus={(e) => e.target.select()}
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />

          <FormControl component="fieldset" style={{ margin: 3 }}>
            <FormLabel component="legend">Procedence</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={race.procedences.includes("Nativos")} value="Nativos" onChange={onProcedencesChange} name="Nativos" />}
                label="Nativos"
              />
              <FormControlLabel
                control={<Checkbox checked={race.procedences.includes("Importados")} value="Importados" onChange={onProcedencesChange} name="Importados" />}
                label="Importados"
              />
            </FormGroup>
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="horseAge">
              Age
            </InputLabel>
            <Select value={race.horseAge} onChange={onHandleChange} name="horseAge" id="horseAge" >
              {
                ages.map(age => {
                  return <MenuItem key={age.value} value={age.value}>{age.label}</MenuItem>
                })
              }
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="claimings-label">Claimings</InputLabel>
            <Select labelId="claimings-label" name="claimings" multiple value={race.claimings} onChange={onHandleChange} input={<Input />}
              renderValue={(selected) => (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} style={{ margin: 2 }} />
                  ))}
                </div>
              )}>
              {claimings.map((claiming) => (
                <MenuItem key={claiming.value} value={claiming.value} >
                  {claiming.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Spec" type="text" margin="normal" onChange={onHandleChange} id="spec" value={race.spec} />
        </form>


      </Dialog>

      <Dialog header="Not exists!" visible={state.programNotExist} style={{ width: '50vw' }} modal={true} onHide={notExistHandler}>
        Program {race.prorgramId} does not exist!
      </Dialog>

      <SnackbarSuccess
        open={state.created}
        onClose={handleClose}
        message="Race Created"
        variant="success"
      >
      </SnackbarSuccess>

    </React.Fragment >
  );

}

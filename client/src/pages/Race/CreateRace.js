import React, { Component, createRef } from "react";

import { AuthContext } from "../../context/auth-context";

import SnackbarSuccess from "../../components/SnackBar/SnackBarSuccess";

import {
  Chip,
  DialogActions,
  Input,
  OutlinedInput,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
  FormLabel,
  FormGroup,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { Calendar } from 'primereact/calendar';
import NumberFormat from 'react-number-format';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button as BtnPrime } from 'primereact/button';

import Spinner from "../../components/Spinner/Spinner";

///import NumberFormat from 'react-number-format';

import "./Race.css"

class CreateRacePage extends Component {
  static contextType = AuthContext
  toast = createRef();

  constructor(props) {
    super(props)

    this.events = [
      1,
      2,
      3,
      4,
      5,
      6,
    ]
  }

  state = {
    creating: false,
    races: [],
    isLoading: false,
    programExist: false,
    programNotExist: false,
    programNumber: '',
    visible: false,
    created: false,
    labelWidth: 0,
    raceDialog: false,
    race: {
      event: 1,
      distance: 1100,
      procedences: [],
      horseAge: "3 Años y Mayores",
      claimings: [],
      purse: 0,
      date: "",
      programId: "",
      spec: ""
    }
  }

  onProgramDateChange = (e) => {
    let newRace = Object.assign({}, this.state.race);
    newRace[e.target.id || e.target.name] = e.target.value;
    this.setState({ race: newRace }, () => this.loadProgram());
  }

  loadProgram = () => {
    this.setState({ isLoading: true })
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
        date: this.state.race.date
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
          this.setState({ programExist: true, isLoading: false, races: resData.data.singleProgram.races });
          let newRace = Object.assign({}, this.state.race);
          newRace["programId"] = resData.data.singleProgram._id;

          if (resData.data.singleProgram.races.length) {
            newRace["event"] = resData.data.singleProgram.races.length + 1
          }
          this.setState({ race: newRace, programNumber: resData.data.singleProgram.number });
        }
        else {
          this.setState({ programNotExist: true, programExist: false });
        }
        this.setState({ isLoading: false })
      })
      .catch(error => {
        console.log(error);
      })
  }

  modalCancelHandler = (event) => {
    this.setState({ creating: false, created: false });
    this.setState({
      race: {
        event: this.state.race.event,
        distance: 1100,
        procedences: [],
        horseAge: "3 Años y Mayores",
        claimings: [],
        purse: 0,
        programId: this.state.race.programId,
        spec: ""
      }
    })
  }

  clearValuesHandler = () => {
    let newRrace = {
      ...this.state.race,
      event: this.state.race.event + 1,
      distance: 1100,
      procedences: [],
      horseAge: "3 Años y Mayores",
      claimings: [],
      purse: 0,
      spec: ""
    }
    this.setState({ race: newRrace })
  }

  notExistHandler = () => {
    this.setState({ programNotExist: false })
    this.props.history.push("/createprogram")
  }

  onHandleChange = (e) => {
    let newRace = Object.assign({}, this.state.race);
    newRace[e.target.id || e.target.name] = e.target.value;
    this.setState({ race: newRace });
  }

  onNumberChangeHandler = (e) => {
    let newRace = Object.assign({}, this.state.race);
    newRace["purse"] = parseInt(e.target.value);
    this.setState({ race: newRace });
  }

  saveHandler = (event) => {
    this.setState({ isLoading: true })
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
        race: this.state.race
      }
    }

    const token = this.context.token

    fetch("api/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Authorization": `Bearer ${token}`,
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
        this.toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Race created', life: 5000 })
        this.setState({ races: [...this.state.races, resData.data.createRace], isLoading: false });
        this.clearValuesHandler();
      })
      .catch(error => {
        console.log(error);
      })
  }

  onProcedencesChange = (e) => {
    let newRace = Object.assign({}, this.state.race);
    if (e.target.checked)
      newRace.procedences.push(e.target.value);
    else
      newRace.procedences.splice(newRace.procedences.indexOf(e.target.value), 1);
    this.setState({ race: newRace });
  }

  handleClose = (event, reason) => {
    this.setState({ created: false });
  };

  NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        thousandSeparator
        prefix="$"
      />
    );
  }

  raceDialogFooter = (
    <React.Fragment>
      <BtnPrime label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => this.setState({ raceDialog: false })} />
      <BtnPrime label="Save" icon="pi pi-check" className="p-button-text" onClick={this.saveHandler} />
    </React.Fragment>
  );

  header = (
    <div className="table-header">
      <h5 className="p-m-0">Races</h5>
    </div>
  );

  claimingsBodyTemplate = (rowData) => {
    return <span>{rowData.claimings.join(", ")}</span>;
  }

  render() {
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
        <Toast ref={this.toast} />

        <Grid container justify="flex-start" alignItems="center" spacing={3}>
          <Grid item>
            <Calendar
              readOnlyInput
              dateFormat="dd/mm/yy"
              placehoder="Date"
              id="date"
              value={this.state.race.date} onChange={this.onProgramDateChange} showIcon
            />
          </Grid>
          <Grid item>
            <TextField id="number" style={{ marginTop: '7px' }}
              label="Number" disabled={true} keyfilter="pint" value={this.state.programNumber} margin="normal" variant="outlined"
            />
          </Grid>
          <Grid item>
            <Button disabled={!this.state.programExist} style={{ height: '57px' }} onClick={() => this.setState({ raceDialog: true })} color="secondary" variant="outlined" startIcon={<AddIcon />}>
              New
            </Button>
          </Grid>
        </Grid>

        <Toolbar style={{ paddingLeft: 2, paddingRight: 1 }}><Typography style={{ flex: '1 1 100%' }} variant="h6" component="div">Races</Typography></Toolbar>
        <DataTable value={this.state.races} dataKey='id'>
          <Column field="event" header="Event"></Column>
          <Column field="distance" header="Distance"></Column>
          <Column field="procedences" header="Procedences" body={(data) => <span>{data.procedences.join(", ")}</span>}></Column>
          <Column field="horseAge" header="Age"></Column>
          <Column field="claimings" header="Claimings" body={this.claimingsBodyTemplate}></Column>
          <Column field="purse" header="Purse" body={(rowData) => <span>{parseInt(rowData.purse).toLocaleString()}</span>}></Column>
          <Column field="spec" header="Spec"></Column>
        </DataTable>


        {/* <button disabled={!this.state.programExist} className="btn btn-secondary">
          Cancel
        </button>
        <button disabled={!this.state.programExist} onClick={this.saveHandler} className="btn btn-primary">
          Save
        </button> */}

        <Dialog visible={this.state.raceDialog} header="Race Details" modal className="p-fluid" footer={this.raceDialogFooter} onHide={() => this.setState({ raceDialog: false })}>
          <form className="container-dialog p-fluid">

            <TextField disabled={true} value={this.state.race.event} id="event" label="Event" />

            <FormControl style={{ width: "200px" }}>
              <InputLabel htmlFor="distance">
                Distance
              </InputLabel>
              <Select value={this.state.race.distance} native onChange={(e) => this.setState(prev => ({ race: { ...prev.race, distance: parseInt(e.target.value) } }))} name="distance" id="distance" >
                {
                  distances.map(distance => {
                    return <option key={distance.value} value={distance.value}>{distance.label}</option>
                  })
                }
              </Select>
            </FormControl>

            <TextField id="purse" label="Purse" keyfilter="pint"
              onChange={this.onNumberChangeHandler} value={this.state.race.purse} margin="normal"
              onFocus={(e) => e.target.select()}
              InputProps={{
                inputComponent: this.NumberFormatCustom,
              }} />

            <FormControl component="fieldset" style={{ margin: 3 }}>
              <FormLabel component="legend">Procedence</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={this.state.race.procedences.includes("Nativos")} value="Nativos" onChange={this.onProcedencesChange} name="Nativos" />}
                  label="Nativos"
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.race.procedences.includes("Importados")} value="Importados" onChange={this.onProcedencesChange} name="Importados" />}
                  label="Importados"
                />
              </FormGroup>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="horseAge">
                Age
              </InputLabel>
              <Select value={this.state.race.horseAge} onChange={this.onHandleChange} name="horseAge" id="horseAge" >
                {
                  ages.map(age => {
                    return <MenuItem key={age.value} value={age.value}>{age.label}</MenuItem>
                  })
                }
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="claimings-label">Claimings</InputLabel>
              <Select labelId="claimings-label" name="claimings" multiple value={this.state.race.claimings} onChange={this.onHandleChange} input={<Input />}
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

            <TextField label="Spec" type="text" margin="normal" onChange={this.onHandleChange} id="spec" value={this.state.race.spec} />
          </form>


        </Dialog>

        <Dialog header="Not exists!" visible={this.state.programNotExist} style={{ width: '50vw' }} modal={true} onHide={this.notExistHandler}>
          Program {this.state.race.prorgramId} does not exist!
        </Dialog>

        <SnackbarSuccess
          open={this.state.created}
          onClose={this.handleClose}
          message="Race Created"
          variant="success"
        >
        </SnackbarSuccess>
        {
          this.state.isLoading && <Spinner />
        }
      </React.Fragment >
    );
  }
}

export default CreateRacePage

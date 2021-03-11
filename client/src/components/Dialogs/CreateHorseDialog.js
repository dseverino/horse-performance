import React from 'react';

import SaveHorseButton from "../Buttons/SaveHorseButton";
import { AuthContext } from "../../context/auth-context";

import {
  InputLabel,
  Select, 
  MenuItem, 
  FormControl, 
  TextField, 
  FormControlLabel, 
  RadioGroup,
  Radio,
  InputAdornment,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import { Dropdown } from "primereact/dropdown";

class CreateHorseDialog extends React.Component {

  // closeHorseDialog = () => {
  //   this.props.open = false
  //   console.log(this.props)
  // }
  static contextType = AuthContext;
  stables = this.context.stables.map(stable => {
    return { label: stable.name, value: stable._id }
  });;

  state = {
    name: this.props.horseName || "", age: 2, color: "Z", sex: "M", stable: "", sire: "", dam: "", weight: "", procedence: "native"
  }

  // submit = (e, f) => {

  //   e.preventDefault();
  //   console.log(e.target.name.value)
  //   console.log(e.target)
  //   const { name } = e.target
  //   console.log(name)
  //   console.log(e.target.elements)
  // }

  render() {
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={this.props.open}
      >
        <DialogTitle id="confirmation-dialog-title">Create Horse</DialogTitle>
        <DialogContent dividers style={{ display: "flex" }}>
          <div style={{ margin: "0px 10px" }}>

            <div style={{ margin: "20px 0px" }}>
              <TextField value={this.state.name} onChange={e => this.setState({ name: e.target.value })} style={{ width: "100%" }} label="Name" variant="outlined" />
            </div>
            <div>
              <TextField
                name="weight"
                type="number"
                variant="outlined"
                label="Weight"
                value={this.state.weight}
                onChange={e => this.setState({ weight: parseInt(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Lbs</InputAdornment>,
                }}
              />
            </div>
            <div>
              <TextField
                name="age"
                type="number"
                variant="outlined"
                label="Age"
                value={this.state.age}
                onFocus={(e) => e.target.select()}
                onChange={e => this.setState({ age: parseInt(e.target.value) })}
              />
            </div>
            <FormControl variant="outlined" style={{ margin: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-outlined-label">Color</InputLabel>
              <Select
                labelId="color-label"
                id="color"
                value={this.state.color}
                onChange={e => this.setState({ color: e.target.value })}
                label="Color"
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="R">R</MenuItem>
                <MenuItem value="Ro">Ro</MenuItem>
                <MenuItem value="Z">Z</MenuItem>
                <MenuItem value="Zo">Zo</MenuItem>

              </Select>
            </FormControl>
            <div>
              <RadioGroup
                aria-label="procedence"
                name="procedence"
                value={this.state.procedence}
                onChange={(e) => this.setState({ procedence: e.target.value })}
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
            <FormControl variant="outlined" style={{ margin: 1, minWidth: 120 }}>
              <InputLabel id="sex-label">Sex</InputLabel>
              <Select
                labelId="sex-label"
                id="sex"
                value={this.state.sex}
                onChange={e => this.setState({ sex: e.target.value })}
                label="Sex"
              >
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="Mc">Mc</MenuItem>
                <MenuItem value="H">H</MenuItem>
              </Select>
            </FormControl>
            <div>
              <TextField label="Sire" name="sire" onChange={e => this.setState({ sire: e.target.value })} value={this.state.sire} margin="normal" variant="outlined" />
            </div>
            <div>
              <TextField label="Dam" name="dam" onChange={e => this.setState({ dam: e.target.value })} value={this.state.dam} margin="normal" variant="outlined" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <Dropdown filter={true} value={this.state.stable} options={this.stables} onChange={(e) => this.setState({ stable: e.target.value })} placeholder="Stable" />
                <span>
                  <AddIcon color="secondary" onClick={() => { this.props.addDialog("stable") }}></AddIcon>
                </span>
              </div>
            </div>

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.close} >
            Close
          </Button>
          <SaveHorseButton horse={this.state} savedHorse={this.props.savedHorse}></SaveHorseButton>
        </DialogActions>
      </Dialog>
    )
  }
}

export default CreateHorseDialog;



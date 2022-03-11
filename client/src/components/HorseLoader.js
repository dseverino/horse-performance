import React, { useEffect, useRef, useState, useContext } from 'react';

import {
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputAdornment,
  Input
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Dialog } from 'primereact/dialog';

import { loadHorses, saveStable, saveHorse } from '../services/Services';
import { AuthContext } from '../context/auth-context';
import FreeSoloCreateOptionDialog from './Dialogs/FreeSoloCreateOptionDialog';

const filter = createFilterOptions();
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch !important',
    },
  },
}));

const HorseLoader = (props) => {
  const formRef = useRef(null);
  const authContext = useContext(AuthContext);
  const [horse, setHorse] = useState(props.horse)
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [name, setName] = useState('');
  const loading = open && options.length === 0;
  const [openDialog, toggleOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState({
    name: '',
    color: 'A',
    age: 3,
    procedence: 'N',
    sex: 'M',
    stable: '',
    sire: '',
    dam: '',
    weight: 0
  });
  const stables = authContext.stables.map(stable => {
    return { name: stable.name, value: stable._id }
  });

  const handleClose = () => {
    setDialogValue({
      name: '',
      color: 'A',
      age: 3,
      procedence: 'N',
      sex: 'M',
      stable: '',
      sire: '',
      dam: '',
      weight: 0
    });

    toggleOpen(false);
  };
  const addHorse = async (event) => {
    event.preventDefault();
    props.load(true)
    const savedHorse = await saveHorse({ ...dialogValue, name: dialogValue.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) });
    props.load(false)
    //setHorse({ ...savedHorse, name: dialogValue.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) })
    setName(dialogValue.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))
    props.onHorseSelected(savedHorse);
    handleClose();
  };

  useEffect(() => {
    let active = true;

    if (!horse || horse.name.length != 4) {
      return undefined;
    }

    (async () => {
      const response = await loadHorses(horse.name);
      const horses = await response.json().then(res => res.data.horse);

      if (horse && !!horse.name.length) {
        setOptions(!!horses.length ? horses : [{ name: '' }]);
      }
    })();

    return () => {
      active = false;
    };
  }, [open && horse && horse.name.length]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (props.createHorse.visible) {
      setDialogValue({ ...dialogValue, name: props.createHorse.name.toLowerCase(), weight: props.createHorse.weight });
      toggleOpen(true);
    }
  }, [props.createHorse.visible])

  async function savedStable(name) {
    props.load(true);
    const stable = await saveStable(name)
    props.load(false);
    if (stable) {
      authContext.addStable(stable);
      setDialogValue({ ...dialogValue, stable: stable._id });
    }
  }

  return (
    <React.Fragment>
      <Autocomplete
        id="asynchronous-demo"
        style={{ width: 300 }}
        open={open}
        value={name}
        onFocus={(e) => e.target.select()}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                ...dialogValue,
                name: newValue,
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              ...dialogValue,
              name: newValue.inputValue
            });
          } else {
            setHorse(newValue);
            props.onHorseSelected(newValue)
          }
        }}
        onInputChange={(ev, value) => setHorse({ ...horse, name: value })}
        renderOption={(option) => option.name}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        options={options}
        loading={loading}
        freeSolo
        autoSelect
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Name"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth='sm'
        style={{ width: '37em' }}
        showHeader={false}
        onHide={() => { }}
        fullWidth={true}
        onEntering={() => {
          if (formRef.current != null) {
            formRef.current.focus()
          }
        }}
        visible={openDialog}
        onClose={handleClose}
      >
        <DialogTitle id="form-dialog-title">Add a new Horse</DialogTitle>
        <DialogContent dividers>
          <form ref={formRef} className={classes.root}>
            <TextField
              margin="dense"
              autoFocus
              id="name"
              value={dialogValue.name}
              onChange={(event) => setDialogValue({ ...dialogValue, name: event.target.value })}
              label="Name"
              type="text"
              autoComplete="off"
            />

            <TextField
              name="age"
              type="number"
              margin="dense"
              label="Age"
              value={dialogValue.age}
              onFocus={(e) => e.target.select()}
              onChange={e => setDialogValue({ ...dialogValue, age: parseInt(e.target.value) })}
            />

            <FormControl>
              <InputLabel>Color</InputLabel>
              <Select
                native
                value={dialogValue.color}
                onChange={(e) => setDialogValue({ ...dialogValue, color: e.target.value })}
                input={<Input id="color-select-native" />}
              >
                <option aria-label="None" value="" />
                {
                  ['A', 'R', 'Ro', 'Z', 'Zo'].map((col) => <option key={col} value={col} >{col}</option>)
                }
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Sex</InputLabel>
              <Select
                native             
                value={dialogValue.sex}
                onChange={e => setDialogValue({ ...dialogValue, sex: e.target.value })}
                input={<Input id="sex-select-native" />}
              >
                {
                  ['M', 'Mc', 'H'].map((col) => <option key={col} value={col} >{col}</option>)
                }
              </Select>
            </FormControl>

            <TextField
              name="weight"
              type="number"
              label="Weight"
              value={dialogValue.weight}
              onFocus={(e) => e.target.select()}
              onChange={e => setDialogValue({ ...dialogValue, weight: parseInt(e.target.value) })}
              InputProps={{
                endAdornment: <InputAdornment position="end">Lbs</InputAdornment>,
              }}
            />
            <TextField label="Sire" name="sire" onChange={e => setDialogValue({ ...dialogValue, sire: e.target.value })} value={dialogValue.sire} margin="normal" margin="dense" />

            <TextField label="Dam" name="dam" onChange={e => setDialogValue({ ...dialogValue, dam: e.target.value })} value={dialogValue.dam} margin="normal" margin="dense" />
            
            <FormControl>
              <FreeSoloCreateOptionDialog
                options={stables}
                title="Stable"
                value={dialogValue.stable}
                onChange={(id) => setDialogValue({ ...dialogValue, stable: id })}
                onCreate={savedStable}
                variant='standard'
              />
            </FormControl>
            
            <FormControl>
              <RadioGroup
                row
                aria-label="procedence"
                name="procedence"
                value={dialogValue.procedence}
                onChange={(e) => setDialogValue({ ...dialogValue, procedence: e.target.value })}
              >
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" color="primary" />}
                  label="Native"
                />
                <FormControlLabel
                  value="I"
                  control={<Radio size="small" color="primary" />}
                  label="Imported"
                />
              </RadioGroup>
            </FormControl>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
            </Button>
          <Button onClick={addHorse} color="primary">
            Add
          </Button>
        </DialogActions>

      </Dialog>
    </React.Fragment>
  );
}

export default HorseLoader;
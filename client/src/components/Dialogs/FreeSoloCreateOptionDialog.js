import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

export default function FreeSoloCreateOptionDialog(props) {
  const [value, setValue] = React.useState(props.value);
  const [open, toggleOpen] = React.useState(false);
  const { options } = props;

  useEffect(() => {    
    if (props.create?.visible) {
      setDialogValue({ ...dialogValue, name: props.create.name.toLowerCase() })
      toggleOpen(true);
    }
  }, [props.create])
  
  const handleClose = () => {
    setDialogValue({
      name: ''
    });

    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    name: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = dialogValue.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    handleClose();
    props.onCreate(name)
    setValue({
      name: name
    });    
  };

  

  // useEffect(() => {
  //   console.log(value)
  // }, [value])

  return (
    <React.Fragment>
      <Autocomplete
        value={value}
        disabled={props.disabled}
        freeSolo
        
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                name: newValue,
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
            });
          } else if (newValue) {
            setValue(newValue);
            props.onChange(newValue.value)
          }
        }}
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
        options={options}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        
        renderOption={(option) => option.name}
        

        onFocus={(e) => e.target.select()}
        renderInput={(params) => (
          <TextField
            {...params} label={props.title} variant={props.variant || 'outlined'}
          />
        )}
      />

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Add a new {props.title}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) => setDialogValue({ ...dialogValue, name: event.target.value })}
              label="Name"
              type="text"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}


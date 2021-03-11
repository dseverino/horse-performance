import React from 'react';

import {
  Button,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogActions,
  Input,
  Checkbox,
  FormLabel,
  FormGroup,
  FormControlLabel,
  TextField,
  OutlinedInput,
  makeStyles,
  Paper,
  Tabs,
  Tab,
  Typography,
  Box,
  useTheme,
  Chip
} from '@material-ui/core';

const Positions = props => {

  const selectedHorse = props;

  return (
    <div className="d-flex flex-column" style={{ minWidth: '490px' }}>

      <div className="d-flex m-1" >
        <div className="d-flex p-2 align-items-center">
          <div style={{ marginRight: '10px' }}>
            <InputLabel>Started</InputLabel>
          </div>
          <div>
            <Select
              value={selectedHorse.positions.start || ''}
              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, start: e.target.value } })}
              input={<OutlinedInput name="start" id="outlined-start-simple" />}
              disabled={selectedHorse.status === "retired"}
              style={{ minWidth: 70 }}
            >
              {
                positions.map(el => { return <MenuItem value={el} key={el}>{el}</MenuItem> })
              }

            </Select>
          </div>
        </div>
      </div>

      <div className="d-flex m-1" >

        <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div >
            <InputLabel>1/4</InputLabel>
          </div>
          <div>
            <Select
              value={selectedHorse.positions.quarterMile || ''}
              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, quarterMile: e.target.value } })}
              input={<OutlinedInput name="quarterMile" />}
              disabled={selectedHorse.status === "retired"}
              style={{ minWidth: 70 }}
            >
              {
                positions.map(el => {
                  return <MenuItem value={el} key={el}>{el}</MenuItem>
                })
              }
            </Select>
          </div>
          <div className="d-flex flex-column">
            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
              control={
                <Checkbox checked={checkBodyLength("quarterMile", "HD")}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  value="HD"
                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, quarterMile: e.target.value } })}
                />
              }
              label="HD" />
            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
              control={
                <Checkbox checked={checkBodyLength("quarterMile", "NK")}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  value="NK"
                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, quarterMile: e.target.value } })}
                />
              }
              label="NK" />
          </div>

          <div>
            <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "quarterMile")} disabled={false} type="number" value={getLengthValue("quarterMile")} margin="normal" variant="outlined" />
          </div>

          <div>
            <FormGroup>
              <FormControlLabel style={{ margin: '-10px -5px' }}
                control={<Checkbox checked={getLongBodyLength("quarterMile", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "quarterMile", "¼")} />}
                label="¼"
              />
              <FormControlLabel style={{ margin: '-10px -5px' }}
                control={<Checkbox checked={getLongBodyLength("quarterMile", "½")} value="½" onChange={(e) => setLongBodyLength(e, "quarterMile", "½")} />}
                label="½"
              />
              <FormControlLabel style={{ margin: '-10px -5px' }}
                control={<Checkbox checked={getLongBodyLength("quarterMile", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "quarterMile", "¾")} />}
                label="¾"
              />
            </FormGroup>
          </div>

        </div>
      </div>

      <div className="d-flex m-1" >
        <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div >
            <InputLabel>1/2</InputLabel>
          </div>
          <div>
            <Select
              value={selectedHorse.positions.halfMile || ''}
              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, halfMile: e.target.value } })}
              input={<OutlinedInput name="halfMile" />}
              disabled={selectedHorse.status === "retired"}
              style={{ minWidth: 70 }}
            >
              {
                positions.map(el => {
                  return <MenuItem value={el} key={el}>{el}</MenuItem>
                })
              }
            </Select>
          </div>
          <div className="d-flex flex-column">
            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
              control={
                <Checkbox checked={checkBodyLength("halfMile", "HD")}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  value="HD"
                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, halfMile: e.target.value } })}
                />
              }
              label="HD" />
            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
              control={
                <Checkbox checked={checkBodyLength("halfMile", "NK")}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  value="NK"
                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, halfMile: e.target.value } })}
                />
              }
              label="NK" />
          </div>

          <div>
            <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "halfMile")} disabled={false} type="number" value={getLengthValue("halfMile")} margin="normal" variant="outlined" />
          </div>
          <div>
            <FormGroup>
              <FormControlLabel style={{ margin: '-10px -5px' }}
                control={<Checkbox checked={getLongBodyLength("halfMile", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "halfMile", "¼")} />}
                label="¼"
              />
              <FormControlLabel style={{ margin: '-10px -5px' }}
                control={<Checkbox checked={getLongBodyLength("halfMile", "½")} value="½" onChange={(e) => setLongBodyLength(e, "halfMile", "½")} />}
                label="½"
              />
              <FormControlLabel style={{ margin: '-10px -5px' }}
                control={<Checkbox checked={getLongBodyLength("halfMile", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "halfMile", "¾")} />}
                label="¾"
              />
            </FormGroup>
          </div>

        </div>
      </div>

      {
        selectedHorse.distance > 1200 && (
          <div className="d-flex m-1" >
            <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
              <div >
                <InputLabel>3/4</InputLabel>
              </div>
              <div>
                <Select
                  value={selectedHorse.positions.thirdQuarter || 1}
                  onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, thirdQuarter: e.target.value } })}
                  input={<OutlinedInput name="thirdQuarter" />}
                  disabled={selectedHorse.status === "retired"}
                  style={{ minWidth: 70 }}
                >
                  {
                    positions.map(el => {
                      return <MenuItem value={el} key={el}>{el}</MenuItem>
                    })
                  }
                </Select>
              </div>


              <div className="d-flex flex-column">
                <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                  control={
                    <Checkbox checked={checkBodyLength("thirdQuarter", "HD")}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      value="HD"
                      onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, thirdQuarter: e.target.value } })}
                    />
                  }
                  label="HD" />
                <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                  control={
                    <Checkbox checked={checkBodyLength("thirdQuarter", "NK")}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      value="NK"
                      onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, thirdQuarter: e.target.value } })}
                    />
                  }
                  label="NK" />
              </div>

              <div>
                <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "thirdQuarter")} disabled={false} type="number" value={getLengthValue("thirdQuarter")} margin="normal" variant="outlined" />
              </div>
              <div>
                <FormGroup>
                  <FormControlLabel style={{ margin: '-10px -5px' }}
                    control={<Checkbox checked={getLongBodyLength("thirdQuarter", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "thirdQuarter", "¼")} />}
                    label="¼"
                  />
                  <FormControlLabel style={{ margin: '-10px -5px' }}
                    control={<Checkbox checked={getLongBodyLength("thirdQuarter", "½")} value="½" onChange={(e) => setLongBodyLength(e, "thirdQuarter", "½")} />}
                    label="½"
                  />
                  <FormControlLabel style={{ margin: '-10px -5px' }}
                    control={<Checkbox checked={getLongBodyLength("thirdQuarter", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "thirdQuarter", "¾")} />}
                    label="¾"
                  />
                </FormGroup>
              </div>

            </div>
          </div>
        )
      }


      {
        selectedHorse.distance > 1400 && (
          <div className="d-flex m-1" >
            <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
              <div >
                <InputLabel>Mile</InputLabel>
              </div>
              <div>
                <Select
                  value={selectedHorse.positions.mile || 1}
                  onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, mile: e.target.value } })}
                  input={<OutlinedInput name="mile" />}
                  disabled={selectedHorse.status === "retired"}
                  style={{ minWidth: 70 }}
                >
                  {
                    positions.map(el => {
                      return <MenuItem value={el} key={el}>{el}</MenuItem>
                    })
                  }
                </Select>
              </div>

              <div className="d-flex flex-column">
                <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                  control={
                    <Checkbox checked={checkBodyLength("mile", "HD")}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      value="HD"
                      onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, mile: e.target.value } })}
                    />
                  }
                  label="HD" />
                <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
                  control={
                    <Checkbox checked={checkBodyLength("mile", "NK")}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      value="NK"
                      onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, mile: e.target.value } })}
                    />
                  }
                  label="NK" />
              </div>

              <div>
                <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "mile")} disabled={false} type="number" value={getLengthValue("mile")} margin="normal" variant="outlined" />
              </div>
              <div>
                <FormGroup>
                  <FormControlLabel style={{ margin: '-10px -5px' }}
                    control={<Checkbox checked={getLongBodyLength("mile", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "mile", "¼")} />}
                    label="¼"
                  />
                  <FormControlLabel style={{ margin: '-10px -5px' }}
                    control={<Checkbox checked={getLongBodyLength("mile", "½")} value="½" onChange={(e) => setLongBodyLength(e, "mile", "½")} />}
                    label="½"
                  />
                  <FormControlLabel style={{ margin: '-10px -5px' }}
                    control={<Checkbox checked={getLongBodyLength("mile", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "mile", "¾")} />}
                    label="¾"
                  />
                </FormGroup>
              </div>

            </div>
          </div>
        )
      }

      <div className="d-flex m-1" >
        <div className="d-flex p-2 align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div >
            <InputLabel>Fin</InputLabel>
          </div>
          <div>
            <Select
              value={selectedHorse.positions.finish || ''}
              onChange={(e) => setSelectedHorse({ ...selectedHorse, positions: { ...selectedHorse.positions, finish: e.target.value } })}
              input={<OutlinedInput name="finish" />}
              disabled={selectedHorse.status === "retired"}
              style={{ minWidth: 70 }}
            >
              {
                positions.map(el => {
                  return <MenuItem value={el} key={el}>{el}</MenuItem>
                })
              }
            </Select>
          </div>
          <div className="d-flex flex-column">

            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
              control={
                <Checkbox checked={checkBodyLength("finish", "NO")}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  value="NO"
                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, finish: e.target.value } })}
                />
              }
              label="NO"
            />
            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
              control={
                <Checkbox checked={checkBodyLength("finish", "HD")}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  value="HD"
                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, finish: e.target.value } })}
                />
              }
              label="HD" />
            <FormControlLabel style={{ margin: 0 }} disabled={selectedHorse.status === "retired"}
              control={
                <Checkbox checked={checkBodyLength("finish", "NK")}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  value="NK"
                  onChange={(e) => setSelectedHorse({ ...selectedHorse, lengths: { ...selectedHorse.lengths, finish: e.target.value } })}
                />
              }
              label="NK" />

          </div>
          <div>
            <TextField size="small" label="Length" style={{ width: 80 }} onChange={(e) => setLengthTextField(e, "finish")} disabled={false} type="number" value={getLengthValue("finish")} margin="normal" variant="outlined" />
          </div>
          <div>
            <FormGroup>
              <FormControlLabel style={{ margin: '-10px -5px' }}
                control={<Checkbox checked={getLongBodyLength("finish", "¼")} value="¼" onChange={(e) => setLongBodyLength(e, "finish", "¼")} />}
                label="¼"
              />
              <FormControlLabel style={{ margin: '-10px -5px' }}
                control={<Checkbox checked={getLongBodyLength("finish", "½")} value="½" onChange={(e) => setLongBodyLength(e, "finish", "½")} />}
                label="½"
              />
              <FormControlLabel style={{ margin: '-10px -5px' }}
                control={<Checkbox checked={getLongBodyLength("finish", "¾")} value="¾" onChange={(e) => setLongBodyLength(e, "finish", "¾")} />}
                label="¾"
              />
            </FormGroup>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Positions;
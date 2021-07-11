import React, { useState } from "react";
/// Material UI ///
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

function toFixed(x) {
    var e = 0;
    if (Math.abs(x) < 1.0) {
      e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x.toString();
}

const SetAmountDialog = (props) => {
    const [value, setValue] = useState(0);

    const handleOnChange = (e) => {
        setValue(e.target.value);
    }

    const handleOnSetValue = () => {
        var v = value * 10**18;
        console.log(v);
        props.onSetValue(toFixed(v));
    }

    return (
        <Dialog open={props.open} onClose={props.handleCloseDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.text}
                </DialogContentText>
            <TextField
                id="outlined-number"
                label={props.symbol}
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                value={value}
                onChange={handleOnChange}
            />
            </DialogContent>  
            <DialogActions>
                <Button onClick={props.handleCloseDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOnSetValue} color="primary">
                    {props.acceptLabel}
                </Button>
            </DialogActions>
        </Dialog>      
    )
}

export default SetAmountDialog;
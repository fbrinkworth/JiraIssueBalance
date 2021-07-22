import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import {web3State} from "./ContractUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const ContractAddress = (props) => {
    const classes = useStyles();

    const handleClick = (address) => {
      navigator.clipboard.writeText(address);
    };

    if(props.show) {
      return (
        <div className={classes.root}>
            <br/>
            <span>Debe agregar el token JIT a Metamask, click para copiar la dirección del contrato al portapapeles</span>
            <Chip avatar={<Avatar>C</Avatar>} label={web3State.contract._address} clickable color="primary" onClick={handleClick.bind(null, web3State.contract._address)} />            
        </div>
      );
    } else {
      return (<br/>);
    }
}

export default ContractAddress;
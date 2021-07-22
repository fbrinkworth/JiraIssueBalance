import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { web3State, walletConnect, mintJIT, recoverETH } from "./ContractUtils";
import ShowMessage from "./Messages";
import SetAmount from "./SetAmount";
import ContractAddress from "./ContractAddress"

/// Material UI ///
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    textTransform: 'none'
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  title: {
    flexGrow: 1,
  },
}));

const Home = (error) => {
    const history = useHistory();
    const classes = useStyles();
    const [openMint, setOpenMint] = useState(false);
    const [openRecover, setOpenRecover] = useState(false);
    const [connected, setConected] = useState(web3State.accounts != null);
    const messages = useRef();
  
    // similar to componentDidMount and componentDidUpdate
    useEffect(() => {
      if(error === "1") {    
        messages.current.showError("Must connect a wallet to use this application!");
        history.push("/");
      }
    });  
  
    const handleWalletConnect = (e) => {
      walletConnect(() => {setConected(true); messages.current.showSuccess("Connected");}, messages.current.showError);
    }
  
    // Begin mint Handlers //
    const handleOpenMintDialog = (e) => {
        if (web3State.accounts != null) {
            setOpenMint(true);
        } else {
            messages.current.showError("Must connect a wallet to use this application!");
        }     
    }

    const handleCloseMintDialog = () => {
        setOpenMint(false);
    };

    const handleSetMintValue = (value) => {
        if(value > 0) {
            setOpenMint(false);
            mintJIT(value, messages.current.showSuccess, messages.current.showError);
        } else {
            messages.current.showError("The mint value must be greater than zero");
        }
    }
    // End mint Handlers //

    // Begin recover Handlers //
    const handleOpenRecoverDialog = (e) => {
      if (web3State.accounts != null) {
        setOpenRecover(true);
      } else {
        messages.current.showError("Must connect a wallet to use this application!");
      }     
    }
  
    const handleCloseRecoverDialog = () => {
      setOpenRecover(false);
    };
  
    const handleSetRecoverValue = (value) => {
        if(value > 0) {
            setOpenRecover(false);
            recoverETH(value, messages.current.showSuccess, messages.current.showError);
        } else {
            messages.current.showError("The recover value must be greater than zero");
        }
    } 
    // End recover Handlers //
  
    const handleJiraIssuesBalance = (e) => {
      if (web3State.accounts != null) {
        history.push("/jiraissuesbalance");
      } else {
        messages.current.showError("Must connect a wallet to use this application!");
      }     
    }
  
    return (
      <div className="App">
        <h1>Bienvenido a Jira Balance Priority</h1>
        <h2>
          Trabajo de certificación del curso de<br/>
          Programación de contratos inteligentes con solidity de<br/>
          <a target="_blank" rel="noreferrer" href="https://www.blockchainacademy.cl/">Blockchain Academy Chile</a>
        </h2>
        <span>
          <br/>
          Para el uso de esta aplicación es necesario conectar Metamask sobre la tesnet Rinkeby<br/>
        </span>
        <div>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<AccountBalanceWalletIcon />}
            onClick={handleWalletConnect}
            disabled={connected}
          >
            Connect Wallet
          </Button>
        </div>
        <div>
          <ContractAddress show={connected} />
        </div>
        <span>
          <br/>
          Para obtener JIT debe enviar ETH, recibirá (1 JIT = 1 USD)
        </span>
        <div>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<MonetizationOnIcon />}
            onClick={handleOpenMintDialog}
            disabled={!connected}
          >
            Mint JIT
          </Button>
        </div>
        <span>
          <br/>
          Para recuperar ETH debe enviar JIT, formula: ETH=BalanceETHContrato*JIT/TotalJITEmitidos. Los JIT entregados se queman.
        </span>
        <div>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<MonetizationOnIcon />}
            onClick={handleOpenRecoverDialog}
            disabled={!connected}
          >
            Recover ETH
          </Button>
        </div>
        <span>
          <br/>
          Teniendo un balance de JIT aquí podrá depositarlos en los Issues de Jira que desee promover
        </span>
        <div>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<ViewComfyIcon />}
            onClick={handleJiraIssuesBalance}
            disabled={!connected}
          >
            Jira Issues Balance
          </Button>
        </div>
        <div className={classes.root}>
            <ShowMessage ref={messages} />
        </div>
        <div>
            <SetAmount
                open={openMint}
                title="Mint JIT"
                text="Enter the amount in ethereum, you will receive as many JIT tokens as the value of eth in USD."
                symbol="ETH"
                acceptLabel="Mint"
                onSetValue={handleSetMintValue}
                handleCloseDialog={handleCloseMintDialog}
            />
        </div>
        <div>
            <SetAmount
                open={openRecover}
                title="Recover ETH"
                text="Enter the amount in JIT, you will receive ETH and burn JIT."
                symbol="JIT"
                acceptLabel="Recover"
                onSetValue={handleSetRecoverValue}
                handleCloseDialog={handleCloseRecoverDialog}
            />        
        </div>
      </div>
    );
  }

  export default Home;
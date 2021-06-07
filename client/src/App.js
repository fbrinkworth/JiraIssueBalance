import React, { Component, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import "./App.scss";

/// Material UI ///
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import MaterialTable from "material-table";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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

/// JIRA Stuff begin ///
var jiraToken = Buffer.from('federico.brinkworth@gmail.com:XvEC7c5jayKiKKf1Y2FeAC60').toString('base64');
var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Basic " + jiraToken);

var jiraRequestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
/// JIRA Stuff end ///

/// WEB3 ///
const state = { storageValue: 0, web3: null, accounts: null, contract: null };
///

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Home}/>
          <Route path='/error/:id' exact render={({match}) => (
            <Home 
              error={match.params.id}
            />
          )}/>
          <Route path='/jiras' exact component={Jiras}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const walletConnect = async (callback, showError) => {
  try {
    console.log("Get network provider and web3 instance.");
    // Get network provider and web3 instance.
    // const web3 = await getWeb3();
    state.web3 = await getWeb3();

    console.log("Use web3 to get the user's accounts.");
    // Use web3 to get the user's accounts.
    // const accounts = await web3.eth.getAccounts();
    state.accounts = await state.web3.eth.getAccounts();

    console.log("Get the contract instance.");
    // Get the contract instance.
    const networkId = await state.web3.eth.net.getId();
    const deployedNetwork = SimpleStorageContract.networks[networkId];
    // const instance = new web3.eth.Contract(
    //   SimpleStorageContract.abi,
    //   deployedNetwork && deployedNetwork.address,
    // );
    state.contract = new state.web3.eth.Contract(
      SimpleStorageContract.abi,
      deployedNetwork && deployedNetwork.address,
    );

    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    // this.setState({ web3, accounts, contract: instance }, this.runExample);
    callback();
  } catch (error) {
    // Catch any errors for any of the above operations.
    // alert(error);
    state.web3 = null;
    state.accounts = null;
    state.contract = null;
    console.error(error);
    showError();
  }
};

const runExample = async () => {
  const { accounts, contract } = this.state;

  // Stores a given value, 5 by default.
  await contract.methods.set(5).send({ from: accounts[0] });

  // Get the value from the contract to prove it worked.
  const response = await contract.methods.get().call();

  // Update state with the result.
  this.setState({ storageValue: response });
};

function Home(props) {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const error = props.error;

  // similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    if(error === "1") {    
      showError();
      history.push("/");
    }
  });  

  const showError = () => {
    setOpen(true);
  };

  const closeError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = (e) => {
    walletConnect(() => {history.push("/jiras");}, showError);
  }

  return (
    <div className="App">
      <h1>Wellcome to Jira Balance Priority</h1>
      <h2>{error}</h2>
      <div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<AccountBalanceWalletIcon />}
          onClick={handleSubmit}
        >
          Connect Wallet
        </Button>
      </div>
      <div className={classes.root}>
        <Snackbar open={open} autoHideDuration={6000} onClose={closeError}>
          <Alert onClose={closeError} severity="error">
            Must connect a wallet to use this application!
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

function Jiras() {
  const history = useHistory();
  const classes = useStyles();

  if (state.accounts == null) {
    history.push("/error/1");
  } 

  const handleSubmit = async (e) => {
    state.web3 = null;
    history.push("/");
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Wallect connected
          </Typography>
          <Button  className={classes.button} color="inherit" onClick={handleSubmit}>{state.accounts[0]}</Button>
        </Toolbar>
      </AppBar>
      <MaterialTable
        options={{
          search: false,
          actionsColumnIndex: -1,
          sorting: false
        }}
        columns={[
          { title: "Issue", field: "key" },
          { title: "Type", field: "fields.issuetype.name" },
          { title: "Priority", field: "fields.priority.name" },
          { title: "Summary", field: "fields.summary" },
          { title: "Wallet", field: "fields.customfield_10055" }
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            let url = "http://localhost:8080/https://brinkworth.atlassian.net/rest/api/3/search?";
            url += "jql=project = CBP order by key";
            url += "&startAt=" + (query.page * query.pageSize);
            url += "&maxResults=" + query.pageSize;
            
            console.log(url);

            fetch(url, jiraRequestOptions)
              .then(response => response.json())
              .then(result => {
                  resolve({
                    data: result.issues,
                    page: query.page,
                    totalCount: result.total
                  })
                }
              )
              .catch(error => { 
                  console.log('error', error); 
                  return resolve({
                      data: [],
                      page: 0,
                      totalCount: 0
                  })
              });
          })
        }
        actions={[
          rowData => ({
            icon: 'attach_money',
            tooltip: 'Add Money',
            onClick: (event, rowData) => alert("You deposit in " + rowData.key).App,
            disabled: rowData.fields.customfield_10055 === null
          }),
          rowData => ({
            icon: 'money_off',
            tooltip: 'Withdraw Money',
            onClick: (event, rowData) => alert("You withdraw of " + rowData.key),
            disabled: rowData.fields.customfield_10055 === null
          }),
          rowData => ({
            icon: 'account_balance_wallet',
            tooltip: 'Create wallet',
            onClick: (event, rowData) => alert("You create wallet for " + rowData.key),
            disabled: rowData.fields.customfield_10055 !== null
          })
        ]}
        title="Jira Issues"
      />
    </div>        
  );
}

export default App;
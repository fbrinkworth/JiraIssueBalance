import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";

import { web3State, depositJIT, withdrawJIT } from "./ContractUtils";
import ShowMessage from "./Messages";
import Balance from "./Balance.js";
import SetAmount from "./SetAmount";

/// Material UI ///
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from "material-table";
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
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Basic " + jiraToken);

var jiraRequestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
/// JIRA Stuff end ///

const JiraIssuesBalance = () => {
    const history = useHistory();
    const classes = useStyles();
    const tableRef = React.createRef();
    const messages = useRef();
    const [openDeposit, setOpenDeposit] = useState(false);
    const [openWithdraw, setOpenWithdraw] = useState(false);
    const [currentAccount, setCurrentAccount] = useState("");
    const serverUrl = window.location.protocol + "//" + window.location.hostname + ":8080/";
  
    if (web3State.accounts == null) {
      history.push("/error/1");
    } 
  
    const backHome = async (e) => {
      web3State.web3 = null;
      history.push("/");
    }
  
    // Begin deposit Handlers //
    const handleOpenDepositDialog = (account) => {
        if (web3State.accounts !== null) {
            setOpenDeposit(true);
            setCurrentAccount(account);
        } else {
            messages.current.showError("Must connect a wallet to use this application!");
        }     
    }

    const handleCloseDepositDialog = () => {
        setOpenDeposit(false);
    };

    const handleSetDepositValue = (value) => {
        if(value > 0) {
            if(currentAccount !== "") {
                setOpenDeposit(false);
                depositJIT(currentAccount, value, messages.current.showSuccess, messages.current.showError, tableRef.current.onQueryChange);
            } else {
                messages.current.showError("The account is not valid");
            }
        } else {
            messages.current.showError("The deposit value must be greater than zero");
        }
    }
    // End deposit Handlers //

    // Begin withdraw Handlers //
    const handleOpenWithdrawDialog = (account) => {
        if (web3State.accounts !== null) {
            setOpenWithdraw(true);
            setCurrentAccount(account);
        } else {
            messages.current.showError("Must connect a wallet to use this application!");
        }     
    }

    const handleCloseWithdrawDialog = () => {
        setOpenWithdraw(false);
    };

    const handleSetWithdrawValue = (value) => {
        if(value > 0) {
            if(currentAccount !== "") {
                setOpenWithdraw(false);
                withdrawJIT(currentAccount, value, messages.current.showSuccess, messages.current.showError, tableRef.current.onQueryChange);
            } else {
                messages.current.showError("The account is not valid");
            }
        } else {
            messages.current.showError("The withdraw value must be greater than zero");
        }
    }
    // End withdraw Handlers //

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Wallect connected
            </Typography>
            <Button  className={classes.button} color="inherit" onClick={backHome}>{web3State.accounts[0]}</Button>
          </Toolbar>
        </AppBar>
        <div className={classes.root}>
            <ShowMessage ref={messages} />
        </div>
        <div>
            <SetAmount
                open={openDeposit}
                title="Deposit JIT"
                text="Enter the amount to deposit in this Issue"
                symbol="JIT"
                acceptLabel="Deposit"
                onSetValue={handleSetDepositValue}
                handleCloseDialog={handleCloseDepositDialog}
            />
        </div>        
        <div>
            <SetAmount
                open={openWithdraw}
                title="Withdraw JIT"
                text="Enter the amount to withdraw in this Issue"
                symbol="JIT"
                acceptLabel="Withdraw"
                onSetValue={handleSetWithdrawValue}
                handleCloseDialog={handleCloseWithdrawDialog}
            />
        </div>        
        <MaterialTable
          tableRef={tableRef}
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
            { title: "Wallet", field: "fields.customfield_10055" },
            { title: "Balance", render: (rowData) => <Balance account={rowData.fields.customfield_10055} />}
          ]}
          data={query =>
            new Promise((resolve, reject) => {
              let url = serverUrl + "https://brinkworth.atlassian.net/rest/api/3/search?";
              url += "jql=project = CBP order by key";
              url += "&startAt=" + (query.page * query.pageSize);
              url += "&maxResults=" + query.pageSize;
              
              //console.log(url);
  
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
              onClick: (event, rowData) => {
                handleOpenDepositDialog(rowData.fields.customfield_10055);
              },
              disabled: rowData.fields.customfield_10055 === null
            }),
            rowData => ({
              icon: 'money_off',
              tooltip: 'Withdraw Money',
              onClick: (event, rowData) => {
                handleOpenWithdrawDialog(rowData.fields.customfield_10055);
              },
              disabled: rowData.fields.customfield_10055 === null
            }),
            rowData => ({
              icon: 'account_balance_wallet',
              tooltip: 'Create wallet',
              onClick: (event, rowData) => {
                var account = web3State.web3.eth.accounts.create(web3State.web3.utils.randomHex(32));
                              
                var raw = JSON.stringify({
                  "fields": {
                      "customfield_10055": account.address
                    }
                });
  
                var jiraUpdateOptions = {
                  method: 'PUT',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };
  
                event.target.disabled = true;
  
                fetch(serverUrl + "https://brinkworth.atlassian.net/rest/api/3/issue/" + rowData.key, jiraUpdateOptions)
                .then(() => {tableRef.current.onQueryChange(); messages.current.showSuccess("Wallet created");})
                .catch(error => {messages.current.showError(error);});              
                //alert("You create wallet " + account.address + " for " + rowData.key);
              },
              disabled: rowData.fields.customfield_10055 !== null
            })
          ]}
          title="Jira Issues"
        />
      </div>        
    );
  }

  export default JiraIssuesBalance;
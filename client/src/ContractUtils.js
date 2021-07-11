import JiraIssueTokenContract from "./contracts/JiraIssueToken.json";
import getWeb3 from "./getWeb3";

const web3State = { web3: null, accounts: null, contract: null };

const walletConnect = async (callback, showError) => {
    try {
      console.log("Get network provider and web3 instance.");
      // Get network provider and web3 instance.
      // const web3 = await getWeb3();
      web3State.web3 = await getWeb3();
  
      console.log("Use web3 to get the user's accounts.");
      // Use web3 to get the user's accounts.
      // const accounts = await web3.eth.getAccounts();
      web3State.accounts = await web3State.web3.eth.getAccounts();
  
      console.log("Get the contract instance.");
      // Get the contract instance.
      const networkId = await web3State.web3.eth.net.getId();
      //const deployedNetwork = SimpleStorageContract.networks[networkId];
      const deployedNetwork = JiraIssueTokenContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );
      web3State.contract = new web3State.web3.eth.Contract(
        JiraIssueTokenContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
  
      callback();
    } catch (error) {
      // Catch any errors for any of the above operations.
      // alert(error);
      web3State.web3 = null;
      web3State.accounts = null;
      web3State.contract = null;
      console.error(error);
      showError("Must connect a wallet to use this application!");
    }
  };
  
  const mintJIT = async (value, showSuccess, showError) => {
    await web3State.contract.methods.mintJIT().send({from: web3State.accounts[0], value: value})
    .then(res => {console.log('Success!', res); showSuccess(res.transactionHash);})
    .catch(err => {console.log(err); showError(err.message);}) 
  };
  
  const recoverETH = async (value, showSuccess, showError) => {
    await web3State.contract.methods.recoverETH(value).send({from: web3State.accounts[0]})
    .then(res => {console.log('Success!', res); showSuccess(res.transactionHash);})
    .catch(err => {console.log(err); showError(err.message);}) 
  };

  const JITBalance = (walletAddress) => web3State.contract.methods.balanceOf(walletAddress).call();

  const depositJIT = async (account, value, showSuccess, showError, refreshView) => {
    await web3State.contract.methods.deposit(account, value).send({from: web3State.accounts[0]})
    .then(res => {console.log('Success!', res); showSuccess(res.transactionHash); refreshView();})
    .catch(err => {console.log(err); showError(err.message);}) 
  };

  const withdrawJIT = async (account, value, showSuccess, showError, refreshView) => {
    await web3State.contract.methods.withdraw(account, value).send({from: web3State.accounts[0]})
    .then(res => {console.log('Success!', res); showSuccess(res.transactionHash); refreshView();})
    .catch(err => {console.log(err); showError(err.message);}) 
  };

  export { web3State, walletConnect, mintJIT, recoverETH, JITBalance, depositJIT, withdrawJIT };

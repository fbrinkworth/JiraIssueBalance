import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    const connect = async () => {
      console.log("Modern dapp browsers...");
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          console.log("Request account access if needed");
          // Request account access if needed
          await window.ethereum.enable();
          console.log("Acccounts now exposed");
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        console.log("Use Mist/MetaMask's provider.");
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        console.log("Fallback to localhost; use dev console port by default...");
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    }
    connect();
  }
);

export default getWeb3;

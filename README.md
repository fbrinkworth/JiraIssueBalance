# Jira Issue Token Connector

## Introduction

This project aims to connect Jira issues with an ERC20 token, named JiraIssueToken (JIT). The primary goal is to establish a clear link between tasks or items tracked in Jira and a quantifiable value or effort represented by cryptocurrency tokens on an Ethereum-compatible blockchain.

By associating Jira issues with JIT tokens, this system allows for tracking, managing, or representing the value, budget, or effort related to specific development tasks, bug fixes, or any other work item managed within Jira. Users can interact with these JIT tokens, for instance, by checking the token balance associated with a particular Jira issue's designated wallet. Depending on the capabilities implemented in the underlying smart contract, further operations such as transferring tokens could also be supported.

This project has been developed as a certification requirement for the "Programación de Contratos Inteligentes con Solidity" course offered by Blockchain Academy Chile. It demonstrates the practical application of smart contract development and its integration with external project management tools like Jira.

## Core Functionality

### JiraIssueToken (JIT)

The JiraIssueToken (JIT) is an ERC20 standard token implemented on the Ethereum blockchain. Its primary purpose is to represent a quantifiable measure of value or effort that can be associated with specific issues or tasks tracked within Jira.

Key operations for JIT include:

*   **Minting:** Users can create new JIT tokens by sending Ether (ETH) to the JIT smart contract. The amount of JIT minted is dynamically calculated based on the current ETH/USD price feed obtained from Chainlink oracles. This ensures that the value of JIT is pegged to a real-world currency equivalent at the time of minting.
*   **Burning:** Users can "burn" (destroy) their JIT tokens to recover a proportional amount of ETH from the smart contract's balance. This provides a mechanism to redeem the value represented by the JIT tokens back into ETH.
*   **Deposit:** The contract allows users to deposit JIT tokens into an account specifically managed within the smart contract itself. This could be for various purposes, such as escrow or collective pooling.
*   **Withdraw:** Users can withdraw JIT tokens that they have previously deposited into their account within the smart contract.

These functions provide a flexible way to manage the token supply and its association with real-world value.

### Jira Integration

The system establishes a direct link between JIT tokens and individual Jira issues. This connection is achieved by:

1.  **Custom Jira Field:** A dedicated custom field (e.g., `customfield_10055` as seen in the client code) is configured within Jira for each issue.
2.  **Storing Wallet Addresses:** This custom field is used to store a unique Ethereum wallet address. This wallet is specifically associated with the Jira issue it's attached to.
3.  **Balance Association:** The client application reads this wallet address from the Jira issue and then queries the JIT smart contract to determine the JIT balance held by that specific address. This balance reflects the value or effort (in JIT) tied to the Jira issue.

To enable seamless communication between the client application (running in a web browser) and the Jira API (hosted on `atlassian.net`), a server-side component (`server/src/server.js`) is utilized. This server acts as a CORS (Cross-Origin Resource Sharing) proxy, relaying requests from the client to the Jira API and circumventing browser restrictions that would otherwise block such cross-domain communication.

### Client Application

The client application, located in the `client/` directory, is a web-based interface that allows users to interact with both the Jira issues and the JIT token system. Its main functionalities include:

*   **Wallet Connection:** Users can connect their Ethereum wallets (such as MetaMask) to the application, enabling them to perform blockchain transactions.
*   **Jira Issue Display:** The application fetches and displays issues from a configured Jira project. For each issue, it also shows the associated JIT balance by:
    *   Reading the Ethereum wallet address stored in the issue's custom field.
    *   Querying the JIT smart contract for the balance of that address.
*   **Minting JIT:** Provides an interface for users to send ETH to the JIT contract to mint new JIT tokens.
*   **Burning JIT (Recovering ETH):** Allows users to burn their JIT tokens and receive a corresponding amount of ETH back from the contract.
*   **Token Account Management:** Depending on the contract's capabilities, the client may also allow users to:
    *   Deposit JIT tokens into their designated account within the JIT smart contract.
    *   Withdraw JIT tokens from their account within the JIT smart contract.

## Requirements

Before you begin, ensure you have the following installed:

*   Node.js (v14.x or later recommended)
*   npm (usually comes with Node.js) or yarn
*   Truffle (for smart contract development and deployment)
*   Ganache (for a local blockchain environment) or access to a testnet/mainnet
*   A code editor (e.g., VS Code)
*   MetaMask browser extension (or a similar wallet)

For running the application in a production-like environment using `serve` and `pm2`:

*   Install `pm2` globally:
    ```bash
    npm install pm2 -g
    ```
*   Install `serve` globally (if you plan to serve the client build this way):
    ```bash
    npm install -g serve
    ```

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install Server Dependencies:**
    Navigate to the server directory and install its dependencies.
    ```bash
    cd server
    npm install
    # or
    # yarn install
    cd ..
    ```

3.  **Install Client Dependencies:**
    Navigate to the client directory and install its dependencies.
    ```bash
    cd client
    npm install
    # or
    # yarn install
    cd ..
    ```

4.  **Configure Environment Variables:**
    The client application requires a Jira API key. Create a `.env` file in the `client/` directory by copying the example:
    ```bash
    cd client
    cp .env.example .env
    ```
    Edit `client/.env` and add your Jira API key and other details:
    ```env
    REACT_APP_JIRA_API_KEY=your_jira_api_key_here
    REACT_APP_JIRA_USER_EMAIL=your_jira_email_here
    REACT_APP_JIRA_BASE_URL=https://your-domain.atlassian.net
    REACT_APP_JIRA_PROJECT_KEY=CBP
    ```
    **Note:**
    *   `REACT_APP_JIRA_BASE_URL`: The base URL for your Jira instance (e.g., `https://your-domain.atlassian.net`). The client application will append paths like `/rest/api/3/...` to this URL.
    *   `REACT_APP_JIRA_USER_EMAIL`: The email address associated with the Jira API Key.
    *   `REACT_APP_JIRA_PROJECT_KEY`: The key of the Jira project from which issues will be fetched (e.g., "CBP", "PROJ").

5.  **Compile and Migrate Smart Contracts:**
    If you are setting up the project for the first time or have made changes to the smart contracts:
    *   Ensure Ganache (or your chosen blockchain network) is running.
    *   Update the `truffle-config.js` file with the correct network details if you are not using the default Ganache settings.
    *   Compile the contracts:
        ```bash
        truffle compile
        ```
    *   Migrate the contracts to the network:
        ```bash
        truffle migrate --network <your_network_name> 
        # e.g., truffle migrate --network development
        ```
    *   After migration, Truffle will output contract addresses. You might need to update these addresses in your client application's configuration (e.g., in `client/src/ContractUtils.js` or a similar configuration file) if they are not dynamically fetched.

6.  **Build the Client Application:**
    For production deployment, build the client application.
    ```bash
    cd client
    npm run build
    # or
    # yarn build
    cd ..
    ```

## Running the Application

### 1. Start the Backend Server (CORS Proxy)

Navigate to the `server/` directory and start the Node.js server:

```bash
cd server
node src/server.js
```

This will typically start the server on `http://localhost:8080`. This server acts as a CORS proxy for Jira API requests.

### 2. Run the Client Application

#### Development Mode:

To run the client in development mode with hot reloading:

```bash
cd client
npm start
# or
# yarn start
```

This will usually open the application in your default web browser at `http://localhost:3000`.

#### Production Mode:

If you have built the client (using `npm run build` in the `client/` directory), you can serve the static files using a simple HTTP server like `serve` or manage it with `pm2`.

**Using `serve`:**

```bash
cd client/build
serve -s . -l 3000 
# The -s flag ensures that all requests are routed to index.html (for SPAs)
# -l 3000 specifies the port
```

**Using `pm2` (for more robust process management):**

First, ensure you have built the client. Then, you can serve the `client/build` directory.
You can create a simple `ecosystem.config.js` file in the project root for `pm2`:

```javascript
// ecosystem.config.js
module.exports = {
  apps : [{
    name   : "jit-client",
    script : "serve",
    env    : {
      PM2_SERVE_PATH: './client/build',
      PM2_SERVE_PORT: 3000,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html'
    }
  },{
    name   : "jit-server",
    script : "./server/src/server.js",
    watch  : true,
    env    : {
      NODE_ENV: "development", // or "production"
      PORT: 8080 // Ensure this matches client's expectation
    }
  }]
}
```

Then run pm2:
```bash
pm2 start ecosystem.config.js
```
To monitor processes: `pm2 list` or `pm2 monit`.
To stop processes: `pm2 stop <app_name>` or `pm2 delete <app_name>`.

### Accessing the Application

Once both the backend server and the client application are running:

*   Open your web browser and navigate to `http://localhost:3000` (or the port you configured).
*   Ensure MetaMask (or your chosen wallet) is connected to the correct Ethereum network (e.g., your local Ganache instance, or the testnet/mainnet you deployed to).

### Project Structure

*   `client/`: Contains the React frontend application. This is where the user interface for interacting with Jira and JIT tokens is located.
*   `contracts/`: Holds the Solidity smart contracts. The primary contract is likely `JiraIssueToken.sol` (or similar), defining the JIT ERC20 token and its associated logic (minting, burning, deposit, withdraw, etc.).
*   `migrations/`: Contains Truffle deployment scripts. These scripts handle the process of deploying the smart contracts to the Ethereum blockchain.
*   `server/`: Contains the Node.js backend server. Its main role is to act as a CORS proxy, enabling the client application to communicate with the Jira API without browser restrictions.
*   `test/`: Includes test files, primarily for the smart contracts (e.g., using Truffle, Mocha, and Chai to write unit tests for contract functions and behavior).

## Usage

This section explains how to use the client application to interact with your Jira issues and the JIT token.

### 1. Accessing the Application

*   Ensure that both the backend server (`server/src/server.js`) and the client application are running, as detailed in the "Running the Application" section.
*   Open your web browser and navigate to the client application's URL, which is typically `http://localhost:3000` by default if you're running it locally in development mode.

### 2. Connecting Your Wallet

*   Upon loading the application, the first step is usually to connect your Ethereum wallet. The application should prompt you or provide a button to connect (e.g., "Connect Wallet").
*   MetaMask is the most common wallet used for web-based DApps. Ensure it's installed in your browser.
*   Make sure your wallet is connected to the correct Ethereum network where your JIT smart contracts are deployed (e.g., a local Ganache instance, Rinkeby, Kovan, or the Ethereum mainnet). The specific network will depend on your `truffle-config.js` settings and where you migrated the contracts.

### 3. Main Interface Overview

*   Once your wallet is connected, you will see the main interface, which is primarily driven by the `JiraIssuesBalance` component.
*   **Jira Issues Display:** The application will fetch and display a list or table of Jira issues from the project specified in your `client/.env` configuration (`REACT_APP_JIRA_PROJECT_KEY`). Issues are retrieved via your Jira instance using the configured API key and base URL.
*   **JIT Balance per Issue:** For each Jira issue, the application will look for an Ethereum wallet address stored in the designated custom field (e.g., `customfield_10055`). If an address is present, the application will query the JIT smart contract to display the current JIT balance of that address. This directly shows the amount of JIT associated with each specific task or item.

### 4. Key Actions / Features

The client application provides several actions, typically available for each Jira issue that has an associated wallet address, or as global actions:

*   **Viewing JIT Balance:**
    *   The JIT balance for each Jira issue's associated wallet is displayed directly in the table of issues.

*   **Creating a Wallet for a Jira Issue:**
    *   If a Jira issue does not have an associated wallet address in its custom field, an option to "Create wallet" will be available.
    *   Clicking this will generate a new Ethereum account (address and private key - though the private key is handled by web3 and not directly exposed to the user in a typical setup for security).
    *   The new wallet's address will then be saved to the Jira issue's custom field via an API call to Jira. The table will refresh to show the new wallet.

*   **Depositing JIT into a Jira Issue's Wallet (Funding):**
    *   This corresponds to the "Add Money" (or similar) action for a Jira issue.
    *   This action allows you to transfer JIT tokens from your connected wallet to the specific wallet address associated with the Jira issue.
    *   You will be prompted to enter the amount of JIT to deposit.
    *   This is a standard ERC20 token transfer, and you will need to confirm the transaction in your wallet (e.g., MetaMask).

*   **Withdrawing JIT from a Jira Issue's Wallet:**
    *   This corresponds to the "Withdraw Money" (or similar) action.
    *   This allows you to transfer JIT tokens from the Jira issue's associated wallet back to your currently connected wallet.
    *   This functionality assumes that your connected wallet has the authority (e.g., is the owner or has been approved) to move tokens from the Jira issue's wallet. *Developer Note: The current implementation of `withdrawJIT` in `JiraIssuesBalance.js` and `ContractUtils.js` seems to imply withdrawing from a contract balance rather than directly from another external account. This part of the documentation should align with the actual smart contract logic for "withdraw". If it's withdrawing from a contract-held balance for that issue/account, the description needs to reflect that.*

*   **Minting JIT (Global Action):**
    *   The application should provide a general interface (not tied to a specific Jira issue initially) to mint new JIT tokens.
    *   You will need to specify the amount of Ether (ETH) you wish to convert into JIT.
    *   The JIT smart contract uses a Chainlink price feed (ETH/USD) to determine the current exchange rate, ensuring that the amount of JIT minted corresponds to the USD value of the ETH sent.
    *   This transaction also requires confirmation in your wallet.

*   **Recovering ETH by Burning JIT (Global Action):**
    *   The application should allow you to burn your JIT tokens to reclaim a proportional amount of ETH from the smart contract's balance.
    *   You will specify the amount of JIT you wish to burn.
    *   The contract calculates the ETH to return based on its current ETH balance and the total supply of JIT (or a similar mechanism defined in the contract).
    *   Confirm the transaction in your wallet. The ETH will be sent to your connected wallet address.

*   **Depositing JIT into Contract Account (User's General Deposit):**
    *   This refers to depositing JIT from your wallet into a general deposit account *within* the JIT smart contract, associated with your address (not a specific Jira issue's wallet).
    *   This typically involves two steps:
        1.  **Approve:** You first need to approve the JIT smart contract to spend a certain amount of JIT on your behalf. This is a standard ERC20 `approve` transaction.
        2.  **Deposit:** After approval, you call the contract's `deposit` function, which will then use the `transferFrom` ERC20 function to move the JIT from your wallet to your internal account in the contract.
    *   The client application should guide you through these steps.

*   **Withdrawing JIT from Contract Account (User's General Withdraw):**
    *   This allows you to retrieve JIT that you previously deposited into your general account within the smart contract.
    *   You specify the amount of JIT to withdraw, and the contract transfers it back to your wallet. This also requires a transaction confirmation.

### 5. Important Notes and Prerequisites for Usage

*   **Jira Instance:** A running and accessible Jira instance (Cloud or Server) is required. The base URL and project key must be correctly configured in the `client/.env` file.
*   **Jira Custom Field:** The designated custom field for storing Ethereum wallet addresses must be created in your Jira setup and available on the screens for the issues in the configured project.
*   **ETH for Gas and Minting:** You will need ETH in your connected wallet (on the correct network) to:
    *   Pay for gas fees for all blockchain transactions (minting, burning, transferring, approving, depositing, withdrawing, creating wallets on Jira issues).
    *   Provide as collateral when minting new JIT tokens.
*   **API Key Permissions:** The Jira API key used must have the necessary permissions to:
    *   Read issues from the specified project.
    *   Edit issues (specifically, to update the custom field with wallet addresses).

## Contributing

Contributions to the Jira Issue Token Connector project are welcome and greatly appreciated! Whether you're looking to fix a bug, add a new feature, improve documentation, or help with testing, your input is valuable.

### General Guidelines

If you'd like to contribute, please follow these general steps:

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally: `git clone https://github.com/your-username/jira-issue-token-connector.git`
3.  **Create a new branch** for your changes: `git checkout -b feature/your-feature-name` or `bugfix/your-bug-fix`.
4.  **Make your changes** and ensure they follow the existing code style.
5.  **Add tests** for any new functionality or bug fixes, if applicable.
6.  **Ensure all tests pass** locally.
7.  **Commit your changes** with a clear and descriptive commit message.
8.  **Push your branch** to your fork on GitHub: `git push origin feature/your-feature-name`.
9.  **Open a pull request** from your branch to the main repository's `main` (or `develop`) branch.
10. **Clearly describe** your changes in the pull request.

### Areas for Contribution

Here are a few areas where contributions would be particularly helpful:

*   **Bug Fixes:** If you find a bug, please open an issue first to discuss it, then feel free to submit a pull request with the fix.
*   **Feature Enhancements:** Ideas for new features that align with the project's goals are welcome. Consider discussing them in an issue first.
*   **Smart Contract Improvements:** Optimizations, security enhancements, or new functionalities for the JIT token contract.
*   **Client Application UI/UX:** Improvements to the user interface and user experience of the React client.
*   **Documentation:** Enhancements to this README, code comments, or other documentation.
*   **Testing:** Adding more comprehensive unit tests or end-to-end tests.

We look forward to your contributions!

## Security Considerations

*   **API Keys:** Your Jira API key (`REACT_APP_JIRA_API_KEY`) is sensitive. Do not commit it directly into your `.env` file if this file might be shared or committed. Consider using a secrets manager or ensure `.env` is in your `.gitignore` file. Be mindful of who has access to this key.
*   **Smart Contract Security:** While this project is for learning and demonstration, any real-world deployment of smart contracts should undergo a thorough security audit by professionals.
*   **Private Keys:** Always manage your Ethereum private keys securely. Do not expose them or commit them to repositories. Use tools like MetaMask or hardware wallets for interactions.
*   **CORS Proxy:** The provided `server.js` is a simple CORS proxy. For a production environment, ensure it's appropriately secured and hardened.
*   **Input Validation:** Ensure all user inputs, especially those interacting with smart contracts or external APIs, are properly validated.

## License

This project is licensed under the terms of the `LICENSE` file. Please see the `LICENSE` file in the root of the repository for more details.

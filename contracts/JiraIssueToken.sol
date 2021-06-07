// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JiraIssueToken is ERC20 {
    constructor() ERC20("JiraIssueToken", "JIT") {
    }

    function mintJIT() public payable {
    }    
}
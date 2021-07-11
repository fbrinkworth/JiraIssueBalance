// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract JiraIssueToken is ERC20 {
    // AggregatorV3Interface internal priceFeed;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    constructor() ERC20("JiraIssueToken", "JIT") {
        /**
         * Descomentar cuando incluya chainlink
         * Para kovan
         * priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
         * Para Rinkeby
         * priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
         */
    }

    /**
     * Acuña JIT tokens basados en el valor enviado en ETH
     */    
    function mintJIT() public payable {
        /*
         * Descomentar cuando incluya chainlink
        uint8 decimals = priceFeed.decimals();
        require(decimals > 0, "Price decimals must greater than zero.");
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        */
        uint8 decimals = 8;
        int price = 239248000000;

        // acuñará una cantidad de JIT equivalentes al precio en dólares de los eth enviados
        // hago la operación en dos partes para evitar el overflow
        // primero multiplico por la parte entera del precio
        uint value = uint(uint(price) / 10**decimals) * msg.value;
        // luego le sumo el resultado de multiplicar la parte decimal del precio
        value += (uint(price % 10**8) * msg.value) / 10**decimals;
        
        //uint value = (uint(price) * msg.value) / 10**decimals;

        _mint(msg.sender, value);
    }

    /**
     * Recupera ETH del contrato quemando JIT
     * 
     */
    function recoverETH(uint256 amount) public {
        require(amount <= totalSupply(), "JIT Amount exceeds total supply");

        /*
         * Calcula la cantidad de ETH en base al balance del contrato y el total de JIT en existencia
         * regla de tres simple
         */
        uint256 ethAmount = address(this).balance * amount / totalSupply();
        
        payable(msg.sender).transfer(ethAmount);
        _burn(msg.sender, amount);
    }    

    /**
     * Deposita JIT en una cuenta
     * El sender podrá luego retirar la misma cantidad
     */    
    function deposit(address account, uint256 amount) public {
        _transfer(msg.sender, account, amount);
        
        uint256 currentAllowance = allowance(msg.sender, account);
        if(currentAllowance == 0) {
            approve(account, amount);
        } else {
            increaseAllowance(account, amount);
        }
    }
    
    /**
     * Retira JIT de una cuenta
     * El sender tiene que estar habilitado y tener balance en la cuenta
     */    
    function withdraw(address account, uint256 amount) public {
        _transfer(account, msg.sender, amount);

        uint256 currentAllowance = allowance(msg.sender, account);
        require(currentAllowance >= amount, "ERC20: withdraw amount exceeds allowance");
    }
}
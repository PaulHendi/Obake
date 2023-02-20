// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


contract Obake is ERC1155, Ownable {
    using Counters for Counters.Counter; // Todo : check if this is needed

    Counters.Counter public supply;

    uint256 public cost = 0.01 ether; // Deploying on Fantom Opera, so 0.01 FTM 
    uint256 public maxSupply = 2500;
    uint256 public maxMintAmountPerTx = 5;

    bool public paused = true;

    uint256 public constant ID = 1;

    constructor(string memory uri) ERC1155(uri) {}

    /**
    * @return the name of the token.
    */
    function name() public pure returns (string memory) { 
        return "Obake"; 
    } 

    /**
    * @return the symbol of the token.
    */
    function symbol() public pure returns (string memory) { 
        // Function to return the token's symbol 
        return "OBK"; 
    } 

    /**
    * Modifier to check if the mint amount is valid and the total supply does not exceed the maximum supply.
    */
    modifier mintCompliance(uint256 _mintAmount) { 
        require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, "Invalid mint amount!"); 
        require(supply.current() + _mintAmount <= maxSupply, "Max supply exceeded!"); 
        _; 
    }

    /**
    * Function to mint tokens.
    * @param _mintAmount - amount of tokens to mint
    */
    function mint(uint256 _mintAmount) public payable mintCompliance(_mintAmount) { 
        // Requires the contract to not be paused 
        require(!paused, "The contract is paused!"); 
        // Requires that the payment is enough for all tokens being minted 
        require(msg.value >= cost * _mintAmount, "Insufficient funds!"); 

        // Update the supply
        for (uint256 i = 0; i < _mintAmount; i++) {
            supply.increment();
        }

        // Call to mint tokens 
        _mint(msg.sender, ID, _mintAmount, ""); 
    }


    /**
    * Function to set the cost per NFT (in FTM)
    * @param _cost - amount of tokens to burn
    */
    function setCost(uint256 _cost) public onlyOwner { 
        cost = _cost; 
    }

    /**
    * Function to set the maximum of NFT that can be minted per transaction.
    * @param _maxMintAmountPerTx - maximum supply of tokens
    */
    function setMaxMintAmountPerTx(uint256 _maxMintAmountPerTx) public onlyOwner {
        maxMintAmountPerTx = _maxMintAmountPerTx;
    }

    /**
    * Function the contract to paused/not paused.
    * @param _state - maximum supply of tokens
    */
    function setPaused(bool _state) public onlyOwner {
        paused = _state;
    }

    /**
    * Function to withdraw the FTM from the contract (callable by the owner).
    */
    function withdraw() public onlyOwner { 
        (bool os,) = payable(owner()).call{ value: address(this).balance }(""); 
        // Requires the transfer succeeds 
        require(os, "Failed to transfer funds to owner"); 
    }

}
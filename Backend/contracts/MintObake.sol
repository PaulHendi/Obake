// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./utils/ERC1155.sol";
import "./utils/Counters.sol";
import "./utils/Ownable.sol";


contract Obake is ERC1155, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public supply;

    uint256 public cost = 0.01 ether;      // Deploying on Fantom, so 0.01 FTM (TODO : change the price before launching)
    uint256 public maxSupply = 2500;       // Maximum supply of tokens
    uint256 public maxMintAmountPerTx = 5; // Maximum amount of tokens that can be minted per transaction

    // Paused state (to pause the minting of tokens)
    bool public paused = true;

    // Token ID (Unique for every NFT)
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
    * Function to mint tokens.
    * @param _mintAmount - amount of tokens to mint
    */
    function mint(uint256 _mintAmount) external payable { 

        // Requires the contract to not be paused 
        require(!paused, "The contract is paused!");         

        // Requires that the mint amount is greater than 0 and less than or equal to the maximum mint amount per transaction
        require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, "Invalid mint amount!"); 

        // Requires that the total supply does not exceed the maximum supply
        require(supply.current() + _mintAmount <= maxSupply, "Max supply reached!"); 

        // Requires that the payment is enough for all tokens being minted 
        require(msg.value == cost * _mintAmount, "Incorrect amount!");    

        // Update the supply
        for (uint256 i = 0; i < _mintAmount; i++) {
            supply.increment();
        }

        // Call to mint tokens 
        _mint(msg.sender, ID, _mintAmount, ""); 
    }


    /**
    * Function the contract to paused/not paused.
    * @param _state - maximum supply of tokens
    */
    function setPaused(bool _state) external onlyOwner {
        paused = _state;
    }


    /**
    * Function to withdraw the FTM from the contract (callable by the owner).
    */
    function withdraw() external onlyOwner { 
        (bool os,) = payable(owner()).call{ value: address(this).balance }(""); 
        // Requires the transfer succeeds 
        require(os, "Failed to transfer funds to owner"); 
    }


    /**
    * Function to set the maximum of NFT that can be minted in one tx (callable by the owner).
    * @param _maxMintAmountPerTx The max mint amount of NFT in one tx
    */    
    function setMaxMintAmountPerTx(uint256 _maxMintAmountPerTx) external onlyOwner {
        maxMintAmountPerTx = _maxMintAmountPerTx;
    }    

}
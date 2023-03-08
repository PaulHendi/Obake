// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./CoinFlip.sol";
import "./Raffle.sol";
import "./utils/VRFV2WrapperConsumerBase.sol";
import "./utils/Ownable.sol";


contract RandomNumberConsumer is VRFV2WrapperConsumerBase, Ownable {
    
    CoinFlip public flip_contract;
    Raffle public raffle_contract;

    // Mapping to store the caller of the request 
    mapping(uint256 => address) caller;

    // Mapping to store the random number
    mapping(uint256 => uint256) public random_numbers; 

    // The gas limit for the callback has been increased in case 
    // fund manager needs gas to swap to link and send FTM
    uint32 callbackGasLimit = 2400000; 

    // 3 confirmations
    uint16 requestConfirmations = 3; 

    // Only one random number at a time for both CoinFlip and Raffle
    uint32 numWords = 1;    

    // Address LINK - hardcoded for Fantom testnet (but can be changed with the setter function)
    address linkAddress = 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F;

    // address WRAPPER - hardcoded for Fantom testnet (but can be changed with the setter function)
    address wrapperAddress = 0x38336BDaE79747a1d2c4e6C67BBF382244287ca6;    

    // Counter to make sure the set_contracts can only be called once
    uint256 public only_once_counter = 0;

    modifier onlyOnce() {
        require(only_once_counter == 0, "Can only be called once");
        _;
    }



    constructor() VRFV2WrapperConsumerBase(linkAddress, wrapperAddress) {}


    /** 
     * Requests randomness from a user-provided seed
     * @dev This function is called by the CoinFlip/Raffle contract to request randomness
     */
    function getRandom() external returns (uint256) {

        // Make sure the function is called by the CoinFlip/Raffle contract
        require(msg.sender == address(flip_contract) || 
                msg.sender == address(raffle_contract),
                     "Only the CoinFlip/Raffle contract can call this function");
                    
        // Request randomness from the VRF_V2_WRAPPER contract             
        uint256 _requestId = requestRandomness(callbackGasLimit, requestConfirmations, numWords);

        // Store the request ID in the mapping
        random_numbers[_requestId] = 0; 

        // Store the caller in the mapping
        caller[_requestId] = msg.sender;

        // Return the request ID for further use
        return _requestId;       
    }



    /**
     * Callback function used by VRF Coordinator
     * @dev This function is called by the VRF Coordinator to fulfill the requestRandomness request
    * @param _requestId The ID of the request to fulfill
    * @param _randomWords The random result returned by the oracle
     */
    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
        require(msg.sender == address(VRF_V2_WRAPPER), "Only VRF_V2_WRAPPER can fulfill");
        random_numbers[_requestId] = _randomWords[0];

        // Call the raffle_result/flip_result function of the CoinFlip/Raffle contract
        address caller_address = caller[_requestId];
        if (caller_address == address(raffle_contract)){

            raffle_contract.raffle_result(_requestId, _randomWords[0]);
        }
        else if (caller_address == address(flip_contract)) {
        
            flip_contract.flip_result(_requestId, _randomWords[0]);
        }
        else {
            revert("Caller not recognized");
        }
    }



    // ***************************************************************************** //
    //                               SETTERS                                         //
    // ***************************************************************************** //


    /**
    * Sets the callback gas limit
    * @param gas_limit The gas limit for the callback
    */
    function set_callback_gas_limit(uint32 gas_limit) public onlyOwner{
        callbackGasLimit = gas_limit;
    }

    /**
     * Sets the number of request confirmations for a random number request
     * @param confirmations The number of confirmations
     */
    function set_request_confirmations(uint16 confirmations) public onlyOwner{
        requestConfirmations = confirmations;
    }

    /**
     * Sets the address of the LINK token
     * @param link_address The address of the LINK token
     */
    function set_link_address(address link_address) public onlyOwner{
        linkAddress = link_address;
    }

    /**
     * Sets the address of the VRF_V2_WRAPPER contract
     * @param wrapper_address The address of the VRF_V2_WRAPPER contract
     */
    function set_wrapper_address(address wrapper_address) public onlyOwner{
        wrapperAddress = wrapper_address;
    }


    /**
     * Sets the address of the CoinFlip and Raffle contracts
     * @param flip_address The address of the CoinFlip contract (payable because of it can receive FTM)
     * @param raffle_address The address of the Raffle contract
     */
    function set_contracts(address payable flip_address, address raffle_address) public onlyOnce onlyOwner{
        flip_contract = CoinFlip(flip_address);
        raffle_contract = Raffle(raffle_address);
        only_once_counter += 1;
    }


}


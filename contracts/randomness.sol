// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "./coin_flip.sol";
import "./lottery.sol";

contract RandomNumberConsumer is VRFV2WrapperConsumerBase {
    
    CoinFlip public flip_contract;
    Lottery public lottery_contract;

    mapping(uint256 => address) caller;


    mapping(uint256 => uint256) public random_numbers; 

    uint256 public counter = 0;
    address public owner;

    // Works for now
    uint32 callbackGasLimit = 1000000;

    // 5 confirmations
    uint16 requestConfirmations = 3; 

    // Only one random number at a time for both CoinFlip and Lottery
    uint32 numWords = 1;    

    // Address LINK - hardcoded for Fantom testnet (but can be changed with the setter function)
    address linkAddress = 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F;

    // address WRAPPER - hardcoded for Fantom testnet (but can be changed with the setter function)
    address wrapperAddress = 0x38336BDaE79747a1d2c4e6C67BBF382244287ca6;    

    modifier onlyOnce() {
        require(counter == 0, "Can only be called once");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
    

    constructor() VRFV2WrapperConsumerBase(linkAddress, wrapperAddress) {
        owner = msg.sender;
    }

    /**
    * @dev Sets the callback gas limit
    * @param gas_limit The gas limit for the callback
    */
    function set_callback_gas_limit(uint32 gas_limit) public onlyOwner{
        callbackGasLimit = gas_limit;
    }

    /**
     * @dev Sets the number of request confirmations for a random number request
     * @param confirmations The number of confirmations
     */
    function set_request_confirmations(uint16 confirmations) public onlyOwner{
        requestConfirmations = confirmations;
    }

    /**
     * @dev Sets the address of the LINK token
     * @param link_address The address of the LINK token
     */
    function set_link_address(address link_address) public onlyOwner{
        linkAddress = link_address;
    }

    /**
     * @dev Sets the address of the VRF_V2_WRAPPER contract
     * @param wrapper_address The address of the VRF_V2_WRAPPER contract
     */
    function set_wrapper_address(address wrapper_address) public onlyOwner{
        wrapperAddress = wrapper_address;
    }


    /**
     * @dev Sets the address of the CoinFlip contract
     * @param flip_address The address of the CoinFlip contract (payable because of it can receive FTM)
     * @param lottery_address The address of the Lottery contract
     */
    function set_contracts(address payable flip_address, address lottery_address) public onlyOnce onlyOwner{
        flip_contract = CoinFlip(flip_address);
        lottery_contract = Lottery(lottery_address);
        counter = counter + 1;
    }

    /** 
     * Requests randomness from a user-provided seed
     * @dev This function is called by the CoinFlip/Lottery contract to request randomness
     */
    function getRandom() external returns (uint256) {
        require(msg.sender == address(flip_contract) || 
                msg.sender == address(lottery_contract),
                     "Only the CoinFlip/Lottery contract can call this function");
                    
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

        // Call the lottery_result/flip_result function of the CoinFlip/Lottery contract
        address caller_address = caller[_requestId];
        if (caller_address == address(lottery_contract)){

            lottery_contract.lottery_result(_requestId, _randomWords[0]);
        }
        else if (caller_address == address(flip_contract)) {
        
            flip_contract.flip_result(_requestId, _randomWords[0]);
        }
        else {
            revert("Caller not recognized");
        }
    }


}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./randomness.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract Lottery  {

    // TODO : set a maximum ticket amount per tx

    event LotteryStarted(uint256 lotteryId, address NFTcontract, uint256 NFTid, uint256 ticket_amount, uint256 ticket_price);
    event LotteryEntered(uint256 lotteryId, address player, uint256 ticket_amount);
    event LotteryEnded(uint256 lotteryId, bool tickets_fully_sold);
    event LotteryWinner(uint256 lotteryId, address winner);

    enum LOTTERY_STATE { CLOSED, OPEN, CALCULATING_WINNER }

    RandomNumberConsumer public randomness_contract;
    
    // Address of the owner
    address public owner;

    // Address of the funds manager
    address public funds_manager;

    // Lottery struct to store lottery info
    struct lottery {
        address owner;                              // Owner of the lottery
        LOTTERY_STATE lottery_state;                // State of the lottery
        uint256 ticket_price;                       // Price of a ticket
        uint256 ticket_amount;                      // Amount of tickets to be sold
        uint256 ticket_sold;                        // Amount of tickets sold
        address NFTcontract;                        // NFT contract address to be won
        uint256 NFTid;                              // NFT id to be won
        address[] players;                          // Players who bought tickets
        mapping(address => uint256) player_total_paid; // Player => amount of tickets
    }

    // LotteryId => lottery
    mapping(uint256 => lottery) public lotteries;
    uint256 public lotteryId;

    // Owner => LotteryId
    mapping(address => uint256) public ownerLotteryId;

    // RequestId => LotteryId
    mapping(uint256 => uint256) public requestId_to_lotteryId;

    // Winning fee
    uint256 public winning_fee = 2;
    uint256 public winning_fee_divisor = 100;

    // Fee balance to be sent to the funds manager
    uint256 public fee_balance;
    
    bool canStartLottery = true;

    modifier lotteryCurrentlyStarting() {
        require(canStartLottery, "A new lottery has been started, wait just a bit");
        canStartLottery = false;
        _;
        canStartLottery = true;
    }    

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    
    constructor(address randomness_address, address _funds_manager) {
        owner = msg.sender;
        randomness_contract = RandomNumberConsumer(randomness_address);
        funds_manager = _funds_manager;
        lotteryId = 1;
    }



    /**
    * @dev Start a new lottery (A seller of an NFT can start a new lottery)
    * @param _NFTcontract Address of the NFT contract to be won
    * @param _NFTid Id of the NFT to be won
    * @param _ticket_price Price of a ticket
    * @param _ticket_amount Amount of tickets to be sold
    */
    function start_new_lottery(address _NFTcontract, 
                               uint256 _NFTid, 
                               uint256 _ticket_price,
                               uint256 _ticket_amount) public lotteryCurrentlyStarting {

        // Check if the ticket price is greater than 0
        require(_ticket_price > 0, "Ticket price can't be 0");
        
        // Check if the ticket amount is greater than 0
        require(_ticket_amount > 0, "Ticket amount can't be 0");

        // Check if the owner already has a lottery running                        
        require(ownerLotteryId[msg.sender] == 0, "You already have a lottery running");

        // Transfer the NFT to the contract
        // Note : Owner must approve the contract to transfer the NFT first
        IERC721(_NFTcontract).transferFrom(msg.sender, address(this), _NFTid);          

        // Set the lotteryId to the owner
        ownerLotteryId[msg.sender] = lotteryId;

        // Set the lottery info
        lotteries[lotteryId].owner = msg.sender;
        lotteries[lotteryId].ticket_price = _ticket_price;
        lotteries[lotteryId].lottery_state = LOTTERY_STATE.OPEN;
        lotteries[lotteryId].ticket_amount = _ticket_amount;
        lotteries[lotteryId].NFTcontract = _NFTcontract;
        lotteries[lotteryId].NFTid = _NFTid;

        // Increment the lotteryId for the next lottery
        lotteryId+=1;

        // Emit the event
        emit LotteryStarted(lotteryId, _NFTcontract, _NFTid, _ticket_amount ,_ticket_price);
    }


    /**
    * @dev Enter a lottery
    * @param _lotteryId Id of the lottery to enter
    * @param _ticket_amount Amount of tickets to buy
    */
    function enter(uint256 _lotteryId, uint256 _ticket_amount) public payable {

        // Requires the ticket price to be correct
        require(msg.value == _ticket_amount*lotteries[_lotteryId].ticket_price, "Wrong price, check the ticket price");

        // Requires the lottery to be opened
        require(lotteries[_lotteryId].lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");

        // Requires the lottery to not be fully sold
        require((lotteries[_lotteryId].ticket_sold + _ticket_amount) <= lotteries[_lotteryId].ticket_amount, "The lottery is full");

        // Add the address of the buyer to the lottery info
        lotteries[_lotteryId].players.push(msg.sender);

        // Add the amount of tickets bought by the player
        lotteries[_lotteryId].player_total_paid[msg.sender] += _ticket_amount*lotteries[_lotteryId].ticket_price;

        // Increment the amount of tickets sold
        lotteries[_lotteryId].ticket_sold += _ticket_amount;

        // Emit the event
        emit LotteryEntered(_lotteryId, msg.sender, _ticket_amount);
    }     
  

    /**
    * @dev End the lottery
    * @param _lotteryId Id of the lottery to end
    */
    function end_lottery(uint256 _lotteryId) public {

        // Requires the caller to be the owner of the lottery
        require(msg.sender == lotteries[_lotteryId].owner, "You are not the owner of this lottery");

        // Requires the lottery to still be opened
        require(lotteries[_lotteryId].lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");

        // Check if the lottery is fully sold
        bool _tickets_fully_sold;
        if (lotteries[_lotteryId].ticket_sold < lotteries[_lotteryId].ticket_amount) {

            // Transfer the NFT back to the owner if the lottery is not fully sold
            _tickets_fully_sold = false;
            lotteries[_lotteryId].lottery_state = LOTTERY_STATE.CLOSED;
            IERC721(lotteries[_lotteryId].NFTcontract).transferFrom(address(this), 
                                                                    lotteries[_lotteryId].owner, 
                                                                    lotteries[_lotteryId].NFTid);

            // Transfer the ticket price back to the players     
            for (uint256 i = 0; i < lotteries[_lotteryId].players.length; i++) {
                address _current_player = lotteries[_lotteryId].players[i];
                uint256 _total_paid = lotteries[_lotteryId].player_total_paid[_current_player];
                payable(_current_player).transfer(_total_paid);
            }        
            
            // Reset the lottery for the owner
            ownerLotteryId[msg.sender] = 0;
            
        }
        else {
            
            console.log("Calculating winner");
            // Ask ChainLink for a random number to calculate the winner if the lottery is fully sold
            _tickets_fully_sold = true;
            lotteries[_lotteryId].lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
            uint256 _requestId = randomness_contract.getRandom();

            // Set the lotteryId to the requestId (so we can get the lotteryId from the requestId in the callback)
            requestId_to_lotteryId[_requestId] = _lotteryId;
        }

        // Emit the event
        emit LotteryEnded(_lotteryId, _tickets_fully_sold);
    }


    /**
    * @dev Callback function called by ChainLink when the random number is ready
    * @param requestId Id of the request
    * @param randomness Random number generated by ChainLink
    */
    function lottery_result(uint256 requestId, uint256 randomness) external {

        // Get the lotteryId from the requestId
        uint256 curr_lottery_id = requestId_to_lotteryId[requestId];

        // Requires the caller to be the randomness contract
        require(msg.sender == address(randomness_contract), "Only the RandomNumberConsumer contract can call this function");

        // Requires the lottery to still be in the calculating winner stage
        require(lotteries[curr_lottery_id].lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "You aren't at that stage yet!");

        // Requires the randomness to be greater than 0
        require(randomness > 0, "random-not-found");

        // Set the lottery state to closed
        lotteries[curr_lottery_id].lottery_state = LOTTERY_STATE.CLOSED;
        // Reset the owner lotteryId
        ownerLotteryId[lotteries[curr_lottery_id].owner] = 0;

        // Calculate the winner
        uint256 index = randomness % lotteries[curr_lottery_id].players.length;
        address winner = lotteries[curr_lottery_id].players[index];

        // Transfer the NFT to the winner
        IERC721(lotteries[curr_lottery_id].NFTcontract).transferFrom(address(this), 
                                                                     winner, 
                                                                     lotteries[curr_lottery_id].NFTid);

        // Calculate the fee and the amount collected during the lottery                                                                    
        uint256 _amount_collected = lotteries[curr_lottery_id].ticket_price * lotteries[curr_lottery_id].ticket_amount;                                                                     
        uint256 _fee = (_amount_collected * winning_fee) / winning_fee_divisor;
        uint256 _owner_amount = _amount_collected - _fee;

        // Update the fee balance
        fee_balance += _fee;

        // Check if the fee balance is greater than 1 FTM and send it to the funds manager
        if (fee_balance>1 ether) {
            send_fee_balance();
        }

        // Transfer the amount collected to the owner
        payable(lotteries[curr_lottery_id].owner).transfer(_owner_amount);

        // Reset the lottery for the owner
        ownerLotteryId[msg.sender] == 0;

        // Emit the event
        emit LotteryWinner(curr_lottery_id, winner);
    }




    /**
    * @dev Function to send the fee balance to the funds manager
    */
    function send_fee_balance() internal {
        uint256 _fee_balance = fee_balance;
        fee_balance = 0;
        payable(funds_manager).transfer(_fee_balance);
    }

    /** 
    * @dev Getter to get the players of a given lottery
    * @param _lotteryId Id of the lottery
    */
    function get_players(uint256 _lotteryId) public view returns (address[] memory) {
        return lotteries[_lotteryId].players;
    }
    
    /**
    * @dev Getter to get current pot of a given lottery
    * @param _lotteryId Id of the lottery
    */
    function get_pot(uint256 _lotteryId) public view returns(uint256){
        return lotteries[_lotteryId].ticket_price * lotteries[_lotteryId].ticket_amount;
    }

    /**
    * @dev Getter to get the state of a given lottery
    * @param _lotteryId Id of the lottery
    */
    function get_lottery_state(uint256 _lotteryId) public view returns(LOTTERY_STATE){
        return lotteries[_lotteryId].lottery_state;
    }


}
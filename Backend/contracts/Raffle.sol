// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Random.sol";
import "./interfaces/IERC721.sol";
import "hardhat/console.sol";
import "./utils/Ownable.sol";

contract Raffle is Ownable {


    // Event to be emitted when a raffle is started
    event RaffleStarted(uint256 raffleId, address NFTcontract, uint256 NFTid, uint256 ticket_amount, uint256 ticket_price);
    
    // Event to be emitted when a player enters a raffle
    event RaffleEntered(uint256 raffleId, address player, uint256 ticket_amount);

    // Event to be emitted when a raffle is closed
    event RaffleEnded(uint256 raffleId, bool tickets_fully_sold);

    // Event to be emitted when a raffle is closed
    event RaffleWinner(uint256 raffleId, address winner);


    enum RAFFLE_STATE { CLOSED, OPEN, CALCULATING_WINNER }

    RandomNumberConsumer public random_contract;
    

    // Address of the funds manager
    address public funds_manager;

    // Raffle struct to store raffle info
    struct raffle {
        address owner;                              // Owner of the raffle
        RAFFLE_STATE raffle_state;                // State of the raffle
        uint256 ticket_price;                       // Price of a ticket
        uint256 ticket_amount;                      // Amount of tickets to be sold
        uint256 ticket_sold;                        // Amount of tickets sold
        address NFTcontract;                        // NFT contract address to be won
        uint256 NFTid;                              // NFT id to be won
        address[] players;                          // Players who bought tickets
        mapping(address => uint256) player_total_paid; // Player => amount of tickets
    }

    // RaffleId => raffle
    mapping(uint256 => raffle) public lotteries;
    uint256 public raffleId;

    // Owner => RaffleId
    mapping(address => uint256) public ownerRaffleId;

    // RequestId => RaffleId
    mapping(uint256 => uint256) public requestId_to_raffleId;

    // Winning fee
    uint256 public winning_fee = 2;
    uint256 public winning_fee_divisor = 100;

    // Fee balance to be sent to the funds manager
    uint256 public fee_balance;

    // Minimum fee to be sent to the funds manager
    uint256 public min_fee_balance = 0.02 ether; // TODO : to be changed before launching

    
    bool canStartRaffle = true;

    modifier raffleCurrentlyStarting() {
        require(canStartRaffle, "A new raffle has been started, just wait a bit");
        canStartRaffle = false;
        _;
        canStartRaffle = true;
    }    


    
    constructor(address random_address, address _funds_manager) {
        random_contract = RandomNumberConsumer(random_address);
        funds_manager = _funds_manager;
        raffleId = 1;
    }



    /**
    * Start a new raffle (A seller of an NFT can start a new raffle)
    * @param _NFTcontract Address of the NFT contract to be won
    * @param _NFTid Id of the NFT to be won
    * @param _ticket_price Price of a ticket
    * @param _ticket_amount Amount of tickets to be sold
    */
    function start_new_raffle(address _NFTcontract, 
                               uint256 _NFTid, 
                               uint256 _ticket_price,
                               uint256 _ticket_amount) public raffleCurrentlyStarting {

        // Check if the ticket price is greater than 0
        require(_ticket_price > 0, "Ticket price can't be 0");
        
        // Check if the ticket amount is greater than 0
        require(_ticket_amount > 0, "Ticket amount can't be 0");

        // Check if the owner already has a raffle running                        
        require(ownerRaffleId[msg.sender] == 0, "You already have a raffle running");

        // Transfer the NFT to the contract
        // Note : Owner must approve the contract to transfer the NFT first
        IERC721(_NFTcontract).transferFrom(msg.sender, address(this), _NFTid);          

        // Set the raffleId to the owner
        ownerRaffleId[msg.sender] = raffleId;

        // Set the raffle info
        lotteries[raffleId].owner = msg.sender;
        lotteries[raffleId].ticket_price = _ticket_price;
        lotteries[raffleId].raffle_state = RAFFLE_STATE.OPEN;
        lotteries[raffleId].ticket_amount = _ticket_amount;
        lotteries[raffleId].NFTcontract = _NFTcontract;
        lotteries[raffleId].NFTid = _NFTid;

        // Increment the raffleId for the next raffle
        raffleId+=1;

        // Emit the event
        emit RaffleStarted(raffleId, _NFTcontract, _NFTid, _ticket_amount ,_ticket_price);
    }


    /**
    * Enter a raffle
    * @param _raffleId Id of the raffle to enter
    * @param _ticket_amount Amount of tickets to buy
    */
    function enter(uint256 _raffleId, uint256 _ticket_amount) public payable {

        // Requires the ticket price to be correct
        require(msg.value == _ticket_amount*lotteries[_raffleId].ticket_price, "Wrong price, check the ticket price");

        // Requires the raffle to be opened
        require(lotteries[_raffleId].raffle_state == RAFFLE_STATE.OPEN, "The raffle hasn't even started!");

        // Requires the raffle to not be fully sold
        require((lotteries[_raffleId].ticket_sold + _ticket_amount) <= lotteries[_raffleId].ticket_amount, "The raffle is full");

        // Add the address of the buyer to the raffle info
        lotteries[_raffleId].players.push(msg.sender);

        // Add the amount of tickets bought by the player
        lotteries[_raffleId].player_total_paid[msg.sender] += _ticket_amount*lotteries[_raffleId].ticket_price;

        // Increment the amount of tickets sold
        lotteries[_raffleId].ticket_sold += _ticket_amount;

        // Emit the event
        emit RaffleEntered(_raffleId, msg.sender, _ticket_amount);
    }     
  

    /**
    * End the raffle
    * @param _raffleId Id of the raffle to end
    */
    function end_raffle(uint256 _raffleId) public {

        // Requires the caller to be the owner of the raffle
        require(msg.sender == lotteries[_raffleId].owner, "You are not the owner of this raffle");

        // Requires the raffle to still be opened
        require(lotteries[_raffleId].raffle_state == RAFFLE_STATE.OPEN, "The raffle hasn't even started!");

        // Check if the raffle is fully sold
        bool _tickets_fully_sold;
        if (lotteries[_raffleId].ticket_sold < lotteries[_raffleId].ticket_amount) {

            // Transfer the NFT back to the owner if the raffle is not fully sold
            _tickets_fully_sold = false;
            lotteries[_raffleId].raffle_state = RAFFLE_STATE.CLOSED;
            IERC721(lotteries[_raffleId].NFTcontract).transferFrom(address(this), 
                                                                    lotteries[_raffleId].owner, 
                                                                    lotteries[_raffleId].NFTid);

            // Transfer the ticket price back to the players     
            for (uint256 i = 0; i < lotteries[_raffleId].players.length; i++) {
                address _current_player = lotteries[_raffleId].players[i];
                uint256 _total_paid = lotteries[_raffleId].player_total_paid[_current_player];
                payable(_current_player).transfer(_total_paid);
            }        
            
            // Reset the raffle for the owner
            ownerRaffleId[msg.sender] = 0;
            
        }
        else {
            
            console.log("Calculating winner");
            // Ask ChainLink for a random number to calculate the winner if the raffle is fully sold
            _tickets_fully_sold = true;
            lotteries[_raffleId].raffle_state = RAFFLE_STATE.CALCULATING_WINNER;
            uint256 _requestId = random_contract.getRandom();

            // Set the raffleId to the requestId (so we can get the raffleId from the requestId in the callback)
            requestId_to_raffleId[_requestId] = _raffleId;
        }

        // Emit the event
        emit RaffleEnded(_raffleId, _tickets_fully_sold);
    }


    /**
    * Callback function called by ChainLink when the random number is ready
    * @param requestId Id of the request
    * @param random Random number generated by ChainLink
    */
    function raffle_result(uint256 requestId, uint256 random) external {

        // Get the raffleId from the requestId
        uint256 curr_raffle_id = requestId_to_raffleId[requestId];

        // Requires the caller to be the random contract
        require(msg.sender == address(random_contract), "Only the RandomNumberConsumer contract can call this function");

        // Requires the raffle to still be in the calculating winner stage
        require(lotteries[curr_raffle_id].raffle_state == RAFFLE_STATE.CALCULATING_WINNER, "You aren't at that stage yet!");

        // Requires the random to be greater than 0
        require(random > 0, "random-not-found");

        // Set the raffle state to closed
        lotteries[curr_raffle_id].raffle_state = RAFFLE_STATE.CLOSED;
        // Reset the owner raffleId
        ownerRaffleId[lotteries[curr_raffle_id].owner] = 0;

        // Calculate the winner
        uint256 index = random % lotteries[curr_raffle_id].players.length;
        address winner = lotteries[curr_raffle_id].players[index];

        // Transfer the NFT to the winner
        IERC721(lotteries[curr_raffle_id].NFTcontract).transferFrom(address(this), 
                                                                     winner, 
                                                                     lotteries[curr_raffle_id].NFTid);

        // Calculate the fee and the amount collected during the raffle                                                                    
        uint256 _amount_collected = lotteries[curr_raffle_id].ticket_price * lotteries[curr_raffle_id].ticket_amount;                                                                     
        uint256 _fee = (_amount_collected * winning_fee) / winning_fee_divisor;
        uint256 _owner_amount = _amount_collected - _fee;

        // Update the fee balance
        fee_balance += _fee;

        // Check if the fee balance is greater than min_fee_balance and send it to the funds manager
        if (fee_balance>min_fee_balance) {
            send_fee_balance();
        }

        // Transfer the amount collected to the owner
        payable(lotteries[curr_raffle_id].owner).transfer(_owner_amount);

        // Reset the raffle for the owner
        ownerRaffleId[msg.sender] == 0;

        // Emit the event
        emit RaffleWinner(curr_raffle_id, winner);
    }




    /**
    * Function to send the fee balance to the funds manager
    */
    function send_fee_balance() internal {
        uint256 _fee_balance = fee_balance;
        fee_balance = 0;
        payable(funds_manager).transfer(_fee_balance);
    }

    /** 
    * Getter to get the players of a given raffle
    * @param _raffleId Id of the raffle
    */
    function get_players(uint256 _raffleId) public view returns (address[] memory) {
        return lotteries[_raffleId].players;
    }
    
    /**
    * Getter to get current pot of a given raffle
    * @param _raffleId Id of the raffle
    */
    function get_pot(uint256 _raffleId) public view returns(uint256){
        return lotteries[_raffleId].ticket_price * lotteries[_raffleId].ticket_amount;
    }

    /**
    * Getter to get the state of a given raffle
    * @param _raffleId Id of the raffle
    */
    function get_raffle_state(uint256 _raffleId) public view returns(RAFFLE_STATE){
        return lotteries[_raffleId].raffle_state;
    }


    // ***************************************************************************** //
    //                               SETTERS                                         //
    // ***************************************************************************** //


    /**
    * Function to set the minimum fee balance
    * @param _min_fee_balance min fee balance
    */
    function setMinFeeBalance(uint256 _min_fee_balance) public onlyOwner {
        min_fee_balance = _min_fee_balance;
    }

}
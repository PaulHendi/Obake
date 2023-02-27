// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./FundsManager.sol";
import "./Random.sol";
import "./utils/Ownable.sol";


contract CoinFlip is Ownable {

    RandomNumberConsumer public random_contract;
    FundsManager public funds_manager;

    event FTMReceived(address sender, uint256 amount);
    event GamePlay(address player, uint256 amount, uint256 bet, uint256 request_id);
    event GameResult(address player, uint256 random_number, uint256 bet);

    // 3 possible amounts for a bet
    uint256[] public amounts = [0.1 ether, 0.5 ether, 1 ether]; // TODO : to be changed before launching

    // Minimum balance factor for the contract to accept new bets
    uint256 public min_balance_factor = 3; 

    // 5 percent is taken from every winning bet
    // 50/1000 = 5%
    // Note : with 1000 as denominator, the fee can have a decimal (i.e 4.5%)
    uint256 public winning_fee = 50; 
    uint256 public winning_fee_divisor = 1000;

    // 0 = heads, 1 = tails
    enum Bet {HEADS, TAILS}

    // Struct to store game data
    struct Game {
        address player;
        uint256 bet;
        uint256 amount;
        bool ended;
        bool won;
    }

    // Mapping to store games
    mapping(uint256 => Game) public games;

    // Mapping to store request ids
    mapping(address => uint256) public request_ids;

    // Mapping to check if the player is currently playing a game
    mapping(address => bool) isPlaying;

    // Fee balance to be sent to the funds manager
    uint256 public fee_balance;


    // Minimum fee to be sent to the funds manager
    uint256 public min_fee_balance = 0.01 ether; // TODO : to be changed before launching



    /**
        * @dev Constructor
        * @param _random_address Address of the RandomNumberConsumer contract
        * @param _funds_manager Address of the funds manager contract
    */
    constructor(address _random_address, address _funds_manager) {
        random_contract = RandomNumberConsumer(_random_address);
        funds_manager = FundsManager(_funds_manager);
    }

    /**
    * @dev Fallback function to receive FTM
    */
    fallback() external payable {
        emit FTMReceived(msg.sender, msg.value);
    }

    /**
    * @dev Receive function to receive FTM
    */    
    receive() external payable {
        emit FTMReceived(msg.sender, msg.value);
    }

    /**
    * @dev Function to play a game
    * @param _bet 0 = heads, 1 = tails
    */
    function play(uint256 _bet) public payable {

        // Check if the bet is valid
        require(_bet == uint256(Bet.HEADS) || _bet == uint256(Bet.TAILS), 
                "You must guess either heads or tails");

        // Check if the amount sent is valid
        require(msg.value == amounts[0] || msg.value == amounts[1] || msg.value == amounts[2], 
                "Amount sent not correct");

        // Check if the player is not already playing a game
        require(!isPlaying[msg.sender], "You are already playing a game, wait for the outcome");

        // Check if the contract has enough funds to pay the winner (better revert if not)
        require(address(this).balance >= (min_balance_factor * msg.value), "Contract balance too low");    
        

        // Call the getRandom function of the RandomNumberConsumer contract                                  
        uint256 requestId = random_contract.getRandom();

        // Store the game data
        games[requestId] = Game(msg.sender,
                                _bet, 
                                msg.value, 
                                false,
                                false); 
                                
        // Store the request id                                                                
        request_ids[msg.sender] = requestId; 
        
        // Set the player as playing
        isPlaying[msg.sender] = true;

        
        // Emit the GamePlay event
        emit GamePlay(msg.sender, msg.value, _bet, requestId);
                                        
    }

    function flip_result(uint256 requestId, uint256 random_number) public {

        // Check if the caller is the RandomNumberConsumer contract
        require(msg.sender == address(random_contract), 
                            "Only the RandomNumberConsumer contract can call this function");

        // Check if the game has not already ended
        require(games[requestId].ended == false, "Game already ended");

        // Check if the game exists
        require(games[requestId].player != address(0), "No game found with this id");

        // Set the game as ended
        games[requestId].ended = true;

        // Set the request id to 0 for the player
        isPlaying[games[requestId].player] = false;        

        // Get the side of the coin
        uint256 side = random_number % 2;

        // Check if the player won
        if (side == games[requestId].bet) {

            // Calculate the fee
            uint256 _fee = games[requestId].amount * winning_fee / winning_fee_divisor;

            // Update the fee balance
            fee_balance += _fee;


            // Check if the fee balance is greater than the minimum fee and send it to the funds manager
            if (fee_balance>=min_fee_balance) {
                send_fee_balance();
            }

            
            // Calculate the amount won
            uint256 amount_won = games[requestId].amount * 2 - _fee;

            // Send the amount won to the player
            payable(games[requestId].player).transfer(amount_won);

            // Set the game as won
            games[requestId].won = true;

        }

        // Emit the GameResult event
        emit GameResult(games[requestId].player, side, games[requestId].bet);
    }

    /**
    * Function to send the fee balance to the funds manager
    */
    function send_fee_balance() internal {
        uint256 _fee_balance = fee_balance;
        fee_balance = 0;
        funds_manager.handle_funds{value: _fee_balance}();
    }

    // Tmp function to withdraw funds TODO : remove before launching
    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    /**
    * Function to get the game info (for the frontend, one call instead of 2)
    * @param user Address of the player
    */
    function getGameInfo(address user) external view returns (Game memory) {
        return games[request_ids[user]];
    }


    // ***************************************************************************** //
    //                               SETTERS                                         //
    // ***************************************************************************** //

    /**
    * @dev Function to set the address of the RandomNumberConsumer contract
    * @param random_address Address of the RandomNumberConsumer contract
    */
    function setRandomContract(address random_address) public onlyOwner {
        random_contract = RandomNumberConsumer(random_address);
    }

    /**
    * @dev Function to set the contract of the funds manager
    * @param _funds_manager_address Address of the funds manager contract
    */
    function setFundsManagerContract(address _funds_manager_address) public onlyOwner {
        funds_manager = FundsManager(_funds_manager_address);
    }

    /**
    * @dev Function to set the winning fee
    */
    function setWinningFee(uint256 _winning_fee) public onlyOwner {
        winning_fee = _winning_fee;
    }

    /**
    * @dev Function to set the bet amounts
    */
    function setAmounts(uint256[] memory _amounts) public onlyOwner {
        require(_amounts.length == 3, "Array must have 3 elements");
        amounts = _amounts;
    }

    /**
    * @dev Function to set the minimum fee balance
    * @param _min_fee_balance Minimum fee balance
    */
    function setMinFee(uint256 _min_fee_balance) public onlyOwner {
        min_fee_balance = _min_fee_balance;
    }



}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./utils/ERC1155Holder.sol";
import "./interfaces/IERC1155.sol";
import "./utils/Ownable.sol";

contract Staking is ERC1155Holder, Ownable{


    IERC1155 public immutable stakingToken;

    event FTMReceived(address indexed sender, uint256 amount);
    event NFTStaked(address indexed sender, uint256 amount);
    event NFTUnstaked(address indexed sender, uint256 amount);
    event RewardsClaimed(address indexed sender, uint256 amount);


    // Total staked (store total amount of tokens staked by all users)
    uint public totalStaked;  


    // The default duration of staking is 1 day
    uint256 public staking_duration = 1 days;

    // The struct StakingInfo stores the start time and reward rate of the staking
    struct StakingInfo{
        uint256 start;
        uint256 reward_rate;
    }

    StakingInfo public staking_info; 

    // User address => rewards to be claimed
    mapping(address => uint) public rewards;

    // User address => staked amount
    mapping(address => uint) public balanceOf; 

    // Every time a user stakes/unstakes or claims rewards, the reward per token is updated
    // This mapping keeps track of the reward per token already taken into account for each user
    mapping(address => uint256) public userRewardPerTokenAccounted;    

    // updatedAt keeps track of the last time the reward per token was updated
    uint256 public updatedAt;

    // accumulatedRewardPerNFT keeps track of the total sum of reward per token
    uint256 public accumulatedRewardPerNFT;
    

    
    constructor(address _stakingNFT) {
        stakingToken = IERC1155(_stakingNFT);
    }


    // Modifier called every time a user stakes/unstakes or claims rewards
    // It basically updates the user's rewards info
    modifier updateRewards(address _account) {

        // First we update the accumulatedRewardPerNFT 
        // This changes the reward per token for all users
        accumulatedRewardPerNFT = getRewardPerToken();

        // Then set updateAt to the current time
        // For next time the modifier is called
        updatedAt = block.timestamp;


        // We update the rewards for the user
        rewards[_account] = getRewards(_account);
        userRewardPerTokenAccounted[_account] = accumulatedRewardPerNFT;
    
        _;
        
    }  


    

    /**
     * Main external function for user to stake tokens
     * @notice - user must approve the contract to transfer tokens before calling this function
     * @param _amount - amount of tokens to stake
     */
    function stake(uint _amount) external updateRewards(msg.sender) {
        require(_amount > 0, "amount = 0");
        
        // Transfers token from user to the contract
        stakingToken.safeTransferFrom(msg.sender, address(this), 1, _amount, "");

        // Updates total staked amount
        totalStaked += _amount;

        // Updates user's balance
        balanceOf[msg.sender] += _amount;


        emit NFTStaked(msg.sender, _amount);
    }

    /**
     * This function allows a user to withdraw a certain amount of tokens staked in the contract.
     * @param _amount - amount of tokens to withdraw
     */
    function unstake(uint _amount) external updateRewards(msg.sender) {  

        require(_amount > 0, "amount = 0"); 
   
        // Updates user's balance
        balanceOf[msg.sender] -= _amount;
    
        // Updates total staked amount
        totalStaked -= _amount;

        // Transfers token from contract to user
        stakingToken.safeTransferFrom(address(this), msg.sender, 1, _amount, "");

        emit NFTUnstaked(msg.sender, _amount);
    }


    /**
     * Allows user to claim rewards
     */
     function claimRewards() public updateRewards(msg.sender) {

        // Get user current reward (Note that this reward is updated via the modifier)
        uint reward = rewards[msg.sender];
        require(reward > 0, "No rewards to be claimed"); 
        
        // Resets user rewards
        rewards[msg.sender] = 0;
        
        // Transfers rewards to user
        payable(msg.sender).transfer(reward);        
     
        // Emits the associated event
        emit RewardsClaimed(msg.sender, reward);
    }


  

    /**
     * Allows user to claim rewards
     * @param _account - address of particular user
     * @notice - The rewards depends on current contract's balance, sometimes it worth waiting for a while
     * to claim rewards :) 
     * @return rewards - total rewards for user
     */
     function getRewards(address _account) public view returns (uint256) {

        // Get user reward (that was updated the last time he interacted with this contract)
        uint256 _user_total_reward = rewards[_account];

        // Get user accumulated reward with past and current reward rates
        uint256 _user_accumulated_reward = balanceOf[_account] * getRewardPerToken();

        // Get user reward already taken into account (that was updated the last time he interacted with this contract)
        uint256 _user_accounted_reward = balanceOf[_account] * userRewardPerTokenAccounted[_account];


        return _user_total_reward + _user_accumulated_reward - _user_accounted_reward; 
               
    }    


    /**
    * This function updates the reward per token 
    * It basically adds past rewards per token rate to the current one
    */
    function getRewardPerToken() public view returns (uint) {
        if (totalStaked == 0) {
            return accumulatedRewardPerNFT;
        }

        // Get current reward per token rate
        // This is calculated by multiplying the reward rate by the duration since the last update
        // and dividing by the total staked amount (in order to get the reward per token)
        uint256 _current_reward_per_token = 
                        (staking_info.reward_rate * (block.timestamp - updatedAt)) / totalStaked;

        return accumulatedRewardPerNFT + _current_reward_per_token;            
    }




    /**
     * Allows owner to withdraw all funds from the contract
     * @notice - This function is only for testing (not wasting faucet funds)
     */
    function emergencyWithdraw() external onlyOwner{
        payable(owner()).transfer(address(this).balance);
    }



    /**
    * This function is called by the fallback function
    * It checks if the staking period is over and if so, it calculates the reward rate
    * and updates the staking info
    */
    function manage_new_funds() public payable { // TODO : needs a require statement
        uint256 time_since_staking_started = block.timestamp - staking_info.start;

        // Note : We need a minimum amount for staking
        if (time_since_staking_started > staking_duration) {// && address(this).balance > 0.5 ether) {

            // If the period is over, calculate the reward rate
            staking_info.reward_rate = address(this).balance / staking_duration;
            staking_info.start = block.timestamp;

        }
        
    }



    // ***************************************************************************** //
    //                               SETTERS                                         //
    // ***************************************************************************** //



    /**
     * Allows owner to set the staking duration
     * @param _duration - new staking duration
     */
     function setStakingDuration(uint256 _duration) external onlyOwner {
        staking_duration = _duration;
    }

    

}
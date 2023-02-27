// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Staking.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IUniswapV2Router01.sol";
import "./utils/Ownable.sol";


contract FundsManager is Ownable {

    Staking public staking_contract;

    // Event to be emitted when funds are received
    event ReceivedFunds(address indexed sender, uint256 amount);

    // Address of the random contract 
    address public random_contract_address;


    // Minimum Link balance 
    uint256 public min_link_balance = 0.1 ether; // (Link also has 18 decimals)

    // Percentage of the balance to swap to Link, the rest is kept in FTM and sent to the staking contract
    uint256 public percentage_balance_link = 20; // 20% of the balance
    uint256 public percentage_balance_link_divisor = 100; // 100%
    

    // Spookyswap router address on the Fantom testnet (hardcoded)
    address private constant SPOOKYSWAP_V2_ROUTER = 0xa6AD18C2aC47803E193F75c3677b14BF19B94883;

    // WFTM and Link addresses on Fantom testnet (hardcoded)
    address private constant WFTM = 0xf1277d1Ed8AD466beddF92ef448A132661956621;
    address private constant LINK = 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F;   
    
    // Spookyswap router
    IUniswapV2Router01 private constant router = IUniswapV2Router01(SPOOKYSWAP_V2_ROUTER);

    // WFTM and Link tokens
    IERC20 private constant wftm = IERC20(WFTM);
    IERC20 private constant link = IERC20(LINK);


    constructor(address _random_contract_address, address _staking_contract_address) {
        random_contract_address = _random_contract_address;
        staking_contract = Staking(_staking_contract_address);
    }




    /**
    * Swap FTM to LINK
    * @param _amount The amount of FTM to swap
    */
    function swapFTMToLink(uint256 _amount) internal {

        // Define the path
        address[] memory path = new address[](2);
        path[0] = WFTM;
        path[1] = LINK;

        router.swapExactETHForTokens{value: _amount}(0, 
                                                     path, 
                                                     random_contract_address, 
                                                     block.timestamp);
    }


    /** 
    * Handle the funds received by the contract
    */
    function handle_funds() public payable {  // TODO : needs a require statement

        uint256 _link_balance = IERC20(LINK).balanceOf(random_contract_address);

        if (_link_balance < min_link_balance) {

            // Define the amount of FTM to swap to Link
            uint256 _balance_to_be_swapped = address(this).balance * percentage_balance_link / percentage_balance_link_divisor;
            
            // Define the amount of FTM to send to the staking contract
            uint256 _balance_to_be_sent = address(this).balance - _balance_to_be_swapped;
            
            // Swap FTM to Link            
            swapFTMToLink(_balance_to_be_swapped);

            // Send the rest of the balance to the staking contract
            staking_contract.manage_new_funds{value: _balance_to_be_sent}();
        }
        else {
            // Send the whole balance to the staking contract
            staking_contract.manage_new_funds{value: address(this).balance}();
        }


    }

    // Note : For tests only
    function emergencyWithdraw() public onlyOwner{
        payable(owner()).transfer(address(this).balance);
        IERC20(LINK).transfer(owner(), IERC20(LINK).balanceOf(address(this)));
    }


    // ***************************************************************************** //
    //                               SETTERS                                         //
    // ***************************************************************************** //


    /**
    * Set the random contract address (in case of an update of the contract)
    * @param _random_contract_address The random contract address
    */
    function setRandomContract(address _random_contract_address) public onlyOwner {
        random_contract_address = _random_contract_address;
    }


    /**
    * Set the staking contract address (in case of an update of the contract)
    * @param _staking_contract_address The staking contract address
    */
    function setStakinContract(address _staking_contract_address) public onlyOwner {
        staking_contract = Staking(_staking_contract_address);
    }

    /**
    * Set the minimum link balance
    * @param _min_link_balance The minimum link balance
    */
    function setMinLinkBalance(uint256 _min_link_balance) public onlyOwner {
        min_link_balance = _min_link_balance;
    }

    /**
    * Set the percentage of the balance to swap to Link
    * @param _percentage_balance_link The percentage of the balance to swap to Link
    */
    function setPercentageBalanceLink(uint256 _percentage_balance_link) public onlyOwner {
        percentage_balance_link = _percentage_balance_link;
    }


}
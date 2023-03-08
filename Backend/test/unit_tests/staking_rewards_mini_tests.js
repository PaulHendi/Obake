const {ethers} = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers"); // Useful when testing with forked testnet

// This script is useful to go step by step
// Waiting for the txs to appear in the explorer
// And checking the contract state 

describe("Staking", function () {

    let staking_contract, sft_contract; 
    let staking_contract_deployed, sft_contract_deployed; 

    let owner, alice, bob;

    let total_staked, staking_info, updated_at, accumulatedRewardPerNFT;
    let user_balance, user_rewards, user_rewards_per_token;

    beforeEach(async function () {


        // Get the Stacking contract
        staking_contract = await ethers.getContractFactory("Staking");

        // Use the script deploy_set_up_staking to set up the staking contract (with approval and all)
        staking_contract_deployed = await staking_contract.attach("0x302e0957744Fd06C8fC2c8949605F862E8421667");

        await staking_contract_deployed.deployed();

        console.log("Staking address:", staking_contract_deployed.address)

        // Approve the staking contract to spend the SFTs
        sft_contract = await ethers.getContractFactory("Obake");
        sft_contract_deployed = await sft_contract.attach("0xFF0B9b82716f5E1816790D6aA3D56d28A9dCd0f6");

        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");


        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);


    });


    async function queryData() {


        // Get staking info
        staking_info = await staking_contract_deployed.staking_info();
        console.log("Staking info : " + staking_info);

        // Get updatedAt
        updated_at = await staking_contract_deployed.updatedAt();
        console.log("Updated at : " + updated_at);

        // Get Accumulated rewards per token
        accumulatedRewardPerNFT = await staking_contract_deployed.accumulatedRewardPerNFT();
        console.log("Accumulated rewards per token : " + accumulatedRewardPerNFT);

        // Get total staked
        total_staked = await staking_contract_deployed.totalStaked();
        console.log("Total staked : " + total_staked);

    
    }

    async function queryDataForUser(account, who) {
        
        console.log("*************************************")
        console.log("*****Querying data for " + who)
        console.log("*************************************")

        // Get user balance
        user_balance = await staking_contract_deployed.balanceOf(account);
        console.log("User balance : " + user_balance);

        // Get user rewards
        user_rewards = await staking_contract_deployed.rewards(account);
        console.log("User rewards : " + user_rewards);

        // Get user rewards per token accounted
        user_rewards_per_token = await staking_contract_deployed.userRewardPerTokenAccounted(account);
        console.log("User rewards per token accounted : " + user_rewards_per_token);

    }

    // Changing this function to progressively test the contract (staking, unstaking, claiming rewards,..)
    it("Should test a normal scenario", async function () {

        await queryData();
        await queryDataForUser(owner.address, "owner");

        // Owner stake 1 NFT
        await(await staking_contract_deployed.stake(1)).wait(2);

        await queryData();
        await queryDataForUser(owner.address, "owner");

        // Wait 60 seconds (Testing duration period)
        console.log("Waiting 60 seconds")
        await new Promise(r => setTimeout(r, 60000));

        await queryData();
        await queryDataForUser(owner.address, "owner");
        

    });


});
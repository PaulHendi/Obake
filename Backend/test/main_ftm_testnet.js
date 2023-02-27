const {ethers} = require("hardhat");
const {expect} = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");


describe("Test all contracts", function () {

    let MintObake, Staking, Random, FundsManager, CoinFlip, Raffle;
    let MintObakeDeployed, StakingDeployed, RandomDeployed, FundsManagerDeployed, CoinFlipDeployed, RaffleDeployed;
    let owner, alice, bob, lisa, jack;

    let URI_BASE;

    beforeEach(async function () {

        // Get signers
        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);
        lisa = new ethers.Wallet(process.env.PRIVATE_KEY_LISA, provider);
        jack = new ethers.Wallet(process.env.PRIVATE_KEY_JACK, provider);
    


        console.log("Owner address:", owner.address);


        // 1) Deploy MintObake
        URI_BASE = "https://gateway.pinata.cloud/ipfs/QmXDt5rtJRwbyUFKY92hakskhUPcEdQWxeS1Mc7Gi5kiLg"

        MintObake = await ethers.getContractFactory("Obake");
        MintObakeDeployed = await MintObake.deploy(URI_BASE);

        await MintObakeDeployed.deployed();

        // Wait 5 seconds
        await new Promise(r => setTimeout(r, 5000));

        console.log("MintObake deployed to:", MintObakeDeployed.address);

        // 2) Deploy Staking
        Staking = await ethers.getContractFactory("Staking");
        StakingDeployed = await Staking.deploy(MintObakeDeployed.address);

        await StakingDeployed.deployed();

        // Wait 5 seconds
        await new Promise(r => setTimeout(r, 5000));

        console.log("Staking deployed to:", StakingDeployed.address);

        // 3) Deploy Random
        Random = await ethers.getContractFactory("RandomNumberConsumer");
        RandomDeployed = await Random.deploy();

        await RandomDeployed.deployed();

        // Wait 5 seconds
        await new Promise(r => setTimeout(r, 5000));        

        console.log("Random deployed to:", RandomDeployed.address);

        // 4) Deploy Funds Manager
        FundsManager = await ethers.getContractFactory("FundsManager");
        FundsManagerDeployed = await FundsManager.deploy(RandomDeployed.address, StakingDeployed.address);

        await FundsManagerDeployed.deployed();

        // Wait 5 seconds
        await new Promise(r => setTimeout(r, 5000));        

        console.log("FundsManager deployed to:", FundsManagerDeployed.address);

        // 5) Deploy CoinFlip
        CoinFlip = await ethers.getContractFactory("CoinFlip");
        CoinFlipDeployed = await CoinFlip.deploy(RandomDeployed.address, FundsManagerDeployed.address);

        await CoinFlipDeployed.deployed();

        // Wait 5 seconds
        await new Promise(r => setTimeout(r, 5000));        

        console.log("CoinFlip deployed to:", CoinFlipDeployed.address);


        // 6) Deploy Raffle
        Raffle = await ethers.getContractFactory("Raffle");
        RaffleDeployed = await Raffle.deploy(RandomDeployed.address, FundsManagerDeployed.address);

        await RaffleDeployed.deployed();

        // Wait 5 seconds
        await new Promise(r => setTimeout(r, 5000));        

        console.log("Raffle deployed to:", RaffleDeployed.address);


        // 7) Set CoinFlip and Raffle addresses in Random
        await(await RandomDeployed.set_contracts(CoinFlipDeployed.address, RaffleDeployed.address)).wait(2);


        // 8) Send FTM to CoinFlip
        await(await owner.sendTransaction({to:CoinFlipDeployed.address,
                                        value: ethers.utils.parseEther("1"), 
                                        gasLimit:2500000})).wait(2);


        // 9) Send Link to Random
        LINK_ADDRESS = "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F"
        Link = await ethers.getContractFactory("ERC20")
        Linkdeployed = Link.attach(LINK_ADDRESS);


        await(await Linkdeployed.transfer(RandomDeployed.address, ethers.utils.parseEther("0.1"))).wait(2);



    });



    async function queryDataStaking() {


        // Get staking info
        staking_info = await StakingDeployed.staking_info();
        console.log("Staking info : " + staking_info);

        // Get updatedAt
        updated_at = await StakingDeployed.updatedAt();
        console.log("Updated at : " + updated_at);

        // Get Accumulated rewards per token
        accumulatedRewardPerNFT = await StakingDeployed.accumulatedRewardPerNFT();
        console.log("Accumulated rewards per token : " + accumulatedRewardPerNFT);

        // Get total staked
        total_staked = await StakingDeployed.totalStaked();
        console.log("Total staked : " + total_staked);

    
    }    


    async function queryDataStakingForUser(account, who) {
        
        console.log("*************************************")
        console.log("*****Querying data for " + who)
        console.log("*************************************")

        // Get user balance
        user_balance = await StakingDeployed.balanceOf(account);
        console.log("User balance : " + user_balance);

        // Get user rewards
        user_rewards = await StakingDeployed.rewards(account);
        console.log("User rewards : " + user_rewards);

        // Get user rewards per token accounted
        user_rewards_per_token = await StakingDeployed.userRewardPerTokenAccounted(account);
        console.log("User rewards per token accounted : " + user_rewards_per_token);

    }    


    it("should test all contracts together (without Raffle) in a simple scenario", async function () {



        console.log("*************************************");

        // // Owner unpause Obake contract
        // console.log("****Owner unpause Mint Obake contract****");
        // await(await MintObakeDeployed.setPaused(false)).wait(2);        

        // // Alice mints 2 Obake
        // console.log("*****Alice mints 2 Obake*****");
        // await(await MintObakeDeployed.connect(alice).mint(2, {value: ethers.utils.parseEther("0.02")})).wait(2);

        // // Bob mints 5 Obake
        // console.log("*****Bob mints 5 Obake*****");
        // await(await MintObakeDeployed.connect(bob).mint(5, {value: ethers.utils.parseEther("0.05")})).wait(2);

        // // Wait 10 seconds
        // console.log("*****Wait 10 seconds*****");
        // await new Promise(r => setTimeout(r, 10000));


        // // Alice stakes her Obakes
        // console.log("*****Alice stakes 2 Obake*****");
        // await(await MintObakeDeployed.connect(alice).setApprovalForAll(StakingDeployed.address, true)).wait(2);
        // await StakingDeployed.connect(alice).stake(2);

        // // Bob stakes his Obakes
        // console.log("*****Bob stakes 5 Obake*****");
        // await(await MintObakeDeployed.connect(bob).setApprovalForAll(StakingDeployed.address, true)).wait(2);
        // await StakingDeployed.connect(bob).stake(5);

        // // query data
        // await queryDataStaking();
        // await queryDataStakingForUser(alice.address, "Alice");
        // await queryDataStakingForUser(bob.address, "Bob");
        
        // Now we wait for users to play CoinFlip
        
        // Print the balance of the staking contract
        balance = await ethers.provider.getBalance(StakingDeployed.address);
        console.log("Balance of Staking contract: ", ethers.utils.formatEther(balance));

        // Lisa and Jack play CoinFlip
        console.log("*****Lisa plays CoinFlip*****");
        await CoinFlipDeployed.connect(lisa).play(0,{value: ethers.utils.parseEther("0.1"), gasLimit:2500000});
        console.log("*****Jack plays CoinFlip*****");
        await CoinFlipDeployed.connect(jack).play(1,{value: ethers.utils.parseEther("0.1"), gasLimit:2500000});



    });


});
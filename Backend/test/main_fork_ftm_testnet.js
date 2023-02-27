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
        [owner, alice, bob, lisa, jack] = await ethers.getSigners();

        console.log("Owner address:", owner.address);


        // 1) Deploy MintObake
        URI_BASE = "https://gateway.pinata.cloud/ipfs/QmXDt5rtJRwbyUFKY92hakskhUPcEdQWxeS1Mc7Gi5kiLg"

        MintObake = await ethers.getContractFactory("Obake");
        MintObakeDeployed = await MintObake.deploy(URI_BASE);

        await MintObakeDeployed.deployed();

        console.log("MintObake deployed to:", MintObakeDeployed.address);

        // 2) Deploy Staking
        Staking = await ethers.getContractFactory("Staking");
        StakingDeployed = await Staking.deploy(MintObakeDeployed.address);

        await StakingDeployed.deployed();

        console.log("Staking deployed to:", StakingDeployed.address);

        // 3) Deploy Random
        Random = await ethers.getContractFactory("RandomNumberConsumer");
        RandomDeployed = await Random.deploy();

        await RandomDeployed.deployed();

        console.log("Random deployed to:", RandomDeployed.address);

        // 4) Deploy Funds Manager
        FundsManager = await ethers.getContractFactory("FundsManager");
        FundsManagerDeployed = await FundsManager.deploy(RandomDeployed.address, StakingDeployed.address);

        await FundsManagerDeployed.deployed();

        console.log("FundsManager deployed to:", FundsManagerDeployed.address);

        // 5) Deploy CoinFlip
        CoinFlip = await ethers.getContractFactory("CoinFlip");
        CoinFlipDeployed = await CoinFlip.deploy(RandomDeployed.address, FundsManagerDeployed.address);

        await CoinFlipDeployed.deployed();

        console.log("CoinFlip deployed to:", CoinFlipDeployed.address);


        // 6) Deploy Raffle
        Raffle = await ethers.getContractFactory("Raffle");
        RaffleDeployed = await Raffle.deploy(RandomDeployed.address, FundsManagerDeployed.address);

        await RaffleDeployed.deployed();

        console.log("Raffle deployed to:", RaffleDeployed.address);


        // 7) Set CoinFlip and Raffle addresses in Random
        await RandomDeployed.set_contracts(CoinFlipDeployed.address, RaffleDeployed.address);


        // 8) Send FTM to CoinFlip
        await owner.sendTransaction({to:CoinFlipDeployed.address,
                                        value: ethers.utils.parseEther("1"), 
                                        gasLimit:2500000});


        // 9) Send Link to Random
        LINK_ADDRESS = "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F"
        Link = await ethers.getContractFactory("ERC20")
        Linkdeployed = Link.attach(LINK_ADDRESS);


        await Linkdeployed.transfer(RandomDeployed.address, ethers.utils.parseEther("0.1"));



    });


    it("Should test Obake alone", async function () {

        console.log("*************************************");


        // Alice tries to mint 1 Obake but contract is paused
        await expect(MintObakeDeployed.connect(alice).mint(1, {value: ethers.utils.parseEther("0.01")})).to.be.revertedWith("The contract is paused!");

        // Owner unpause Obake contract
        await MintObakeDeployed.setPaused(false);

        // Alice mints 1 Obake
        await MintObakeDeployed.connect(alice).mint(1, {value: ethers.utils.parseEther("0.01")});

        // Get Obake ID
        let tokenID = await MintObakeDeployed.ID(); // ID is unique
        expect(tokenID).to.equal(1);

        // Check Alice's balance
        expect(await MintObakeDeployed.balanceOf(alice.address, tokenID)).to.equal(1);

        // Alice tries to mint 6 Obake
        await expect(MintObakeDeployed.connect(alice).mint(6, {value: ethers.utils.parseEther("0.06")})).to.be.revertedWith("Invalid mint amount!");

        // Alice tries to mint 2 Obake but send the wrong amount of FTM
        await expect(MintObakeDeployed.connect(alice).mint(2, {value: ethers.utils.parseEther("0.01")})).to.be.revertedWith("Incorrect amount!");

        // Bob mints 3 Obake
        await MintObakeDeployed.connect(bob).mint(3, {value: ethers.utils.parseEther("0.03")});

        // Check supply
        expect(await MintObakeDeployed.supply()).to.equal(4);

        // Check name and symbol
        expect(await MintObakeDeployed.name()).to.equal("Obake");
        expect(await MintObakeDeployed.symbol()).to.equal("OBK");

        // Check tokenURI
        expect(await MintObakeDeployed.uri(tokenID)).to.equal(URI_BASE); // TODO : Need to double check if it's okay

        // Owner increase the max amount of Obake that can be minted per transaction
        await MintObakeDeployed.setMaxMintAmountPerTx(2490);

        // Check MaxMintAmountPerTx
        expect(await MintObakeDeployed.maxMintAmountPerTx()).to.equal(2490);

        // Jack mints 2490 Obake
        await MintObakeDeployed.connect(jack).mint(2490, {value: ethers.utils.parseEther("24.90")});

        // Check supply
        expect(await MintObakeDeployed.supply()).to.equal(2494);

        // Check Max supply
        expect(await MintObakeDeployed.maxSupply()).to.equal(2500);

        // Lisa tries to mint 7 Obake but the max supply is reached
        await expect(MintObakeDeployed.connect(lisa).mint(7, {value: ethers.utils.parseEther("0.07")})).to.be.revertedWith("Max supply reached!");

        // Lisa mints 6 Obake
        await MintObakeDeployed.connect(lisa).mint(6, {value: ethers.utils.parseEther("0.06")});

        // Check supply
        expect(await MintObakeDeployed.supply()).to.equal(2500);

        // Owner withdraws all the FTM
        // Check balance before withdraw
        balance = await owner.getBalance()
        console.log("Balance before withdraw: ", ethers.utils.formatEther(balance));
        await MintObakeDeployed.withdraw();
        // Check balance after withdraw
        balance = await owner.getBalance()
        console.log("Balance after withdraw: ", ethers.utils.formatEther(balance));

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


    it("Should test Staking with Obake", async function () {

        console.log("*************************************");

        // Owner unpause Obake contract
        await MintObakeDeployed.setPaused(false);

        // Alice mints 1 Obake
        await MintObakeDeployed.connect(alice).mint(1, {value: ethers.utils.parseEther("0.01")});

        // Bob mints 2 Obake
        await MintObakeDeployed.connect(bob).mint(2, {value: ethers.utils.parseEther("0.02")});


        // Alice stakes her Obake
        await MintObakeDeployed.connect(alice).setApprovalForAll(StakingDeployed.address, true);
        await StakingDeployed.connect(alice).stake(1);

        // Bob stakes one of his Obake
        await MintObakeDeployed.connect(bob).setApprovalForAll(StakingDeployed.address, true);
        await StakingDeployed.connect(bob).stake(1);

        // query data
        await queryDataStaking();

        // Increase time by 1 hour
        await time.increase(3600);

        // query data
        await queryDataStaking();
        await queryDataStakingForUser(alice.address, "Alice");

        // Owner sends 1 FTM to Staking contract
        await owner.sendTransaction({to: StakingDeployed.address, value: ethers.utils.parseEther("1")})

        // Increase time by 1 hour
        await time.increase(3600);


        // query data
        await queryDataStaking();   
        await queryDataStakingForUser(alice.address, "Alice");  
        
        // Bob stakes his second Obake
        await StakingDeployed.connect(bob).stake(1);
     
        // query data
        await queryDataStaking();   
        await queryDataStakingForUser(alice.address, "Bob");   
        
        
        // Bob claims his rewards
        // Print balance before claim
        balance = await bob.getBalance()
        console.log("Balance before claim: ", ethers.utils.formatEther(balance));
        await StakingDeployed.connect(bob).claimRewards();
        // Print balance after claim
        balance = await bob.getBalance()
        console.log("Balance after claim: ", ethers.utils.formatEther(balance));

        // Owner sends 10 FTM to Staking contract
        await owner.sendTransaction({to: StakingDeployed.address, value: ethers.utils.parseEther("10")})

        // Increase time by 1 hour
        await time.increase(3600);

        // query data
        await queryDataStaking();
        await queryDataStakingForUser(alice.address, "Alice");
        await queryDataStakingForUser(bob.address, "Bob");

        // Alice claims her rewards
        // Print balance before claim
        balance = await alice.getBalance()
        console.log("Balance before claim: ", ethers.utils.formatEther(balance));
        await StakingDeployed.connect(alice).claimRewards();
        // Print balance after claim
        balance = await alice.getBalance()
        console.log("Balance after claim: ", ethers.utils.formatEther(balance));


        // Print rate
        rate = await StakingDeployed.getRewardPerToken();
        console.log("Rate : " + rate);

        // Increase time by 1 day
        await time.increase(86400);

        // Print rate
        rate = await StakingDeployed.getRewardPerToken();
        console.log("Rate : " + rate);

        // query data
        await queryDataStaking();
        await queryDataStakingForUser(alice.address, "Alice");
        await queryDataStakingForUser(bob.address, "Bob");

        // Alice claims her rewards
        // Print balance before claim
        balance = await alice.getBalance()
        console.log("Balance before claim: ", ethers.utils.formatEther(balance));
        await StakingDeployed.connect(alice).claimRewards();
        // Print balance after claim
        balance = await alice.getBalance()
        console.log("Balance after claim: ", ethers.utils.formatEther(balance));

        // Bob claims his rewards
        // Print balance before claim
        balance = await bob.getBalance()
        console.log("Balance before claim: ", ethers.utils.formatEther(balance));
        await StakingDeployed.connect(bob).claimRewards();
        // Print balance after claim
        balance = await bob.getBalance()
        console.log("Balance after claim: ", ethers.utils.formatEther(balance));

        // Owner sends 100 FTM to Staking contract
        await owner.sendTransaction({to: StakingDeployed.address, value: ethers.utils.parseEther("100")})


        // Increase time by 1 day
        await time.increase(86400);

        // Alice unstakes her Obake
        await StakingDeployed.connect(alice).unstake(1);

        // Bob unstakes his Obake
        await StakingDeployed.connect(bob).unstake(2);


        // Alice claims her rewards
        // Print balance before claim
        balance = await alice.getBalance()
        console.log("Balance before claim: ", ethers.utils.formatEther(balance));
        await StakingDeployed.connect(alice).claimRewards();
        // Print balance after claim
        balance = await alice.getBalance()
        console.log("Balance after claim: ", ethers.utils.formatEther(balance));

        // // Bob claims his rewards
        // // Print balance before claim
        // balance = await bob.getBalance()
        // console.log("Balance before claim: ", ethers.utils.formatEther(balance));
        // await StakingDeployed.connect(bob).claimRewards();
        // // Print balance after claim
        // balance = await bob.getBalance()
        // console.log("Balance after claim: ", ethers.utils.formatEther(balance));  // This fails




    });

    it("should test all contracts together (without Raffle) in a simple scenario", async function () {



        console.log("*************************************");

        // Owner unpause Obake contract
        console.log("****Owner unpause Mint Obake contract****");
        await MintObakeDeployed.setPaused(false);        

        // Alice mints 2 Obake
        console.log("*****Alice mints 2 Obake*****");
        await MintObakeDeployed.connect(alice).mint(2, {value: ethers.utils.parseEther("0.02")});

        // Bob mints 5 Obake
        console.log("*****Bob mints 5 Obake*****");
        await MintObakeDeployed.connect(bob).mint(5, {value: ethers.utils.parseEther("0.05")});


        // Alice stakes her Obakes
        console.log("*****Alice stakes 2 Obake*****");
        await MintObakeDeployed.connect(alice).setApprovalForAll(StakingDeployed.address, true);
        await StakingDeployed.connect(alice).stake(2);

        // Bob stakes his Obakes
        console.log("*****Bob stakes 5 Obake*****");
        await MintObakeDeployed.connect(bob).setApprovalForAll(StakingDeployed.address, true);
        await StakingDeployed.connect(bob).stake(5);

        // query data
        await queryDataStaking();
        await queryDataStakingForUser(alice.address, "Alice");
        await queryDataStakingForUser(bob.address, "Bob");
        
        // Now we wait for users to play CoinFlip
        
        // Print the balance of the staking contract
        balance = await ethers.provider.getBalance(StakingDeployed.address);
        console.log("Balance of Staking contract: ", ethers.utils.formatEther(balance));

        // Lisa and Jack play CoinFlip
        console.log("*****Lisa plays CoinFlip*****");
        await CoinFlipDeployed.connect(lisa).play(0,{value: ethers.utils.parseEther("0.5"), gasLimit: 2500000});
        console.log("*****Jack plays CoinFlip*****");
        await CoinFlipDeployed.connect(jack).play(1,{value: ethers.utils.parseEther("0.5"), gasLimit: 2500000});

        // Print the balance of the staking contract
        balance = await ethers.provider.getBalance(StakingDeployed.address);
        console.log("Balance of Staking contract: ", ethers.utils.formatEther(balance));




    });


});
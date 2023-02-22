const {ethers} = require("hardhat");
const {expect} = require("chai");


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


});
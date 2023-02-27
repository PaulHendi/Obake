const {ethers} = require("hardhat");

async function main() {

    // Get owner
    const [owner] = await ethers.getSigners();

    // 1) Deploy MintObake
    URI_BASE = "https://gateway.pinata.cloud/ipfs/QmXDt5rtJRwbyUFKY92hakskhUPcEdQWxeS1Mc7Gi5kiLg"

    const MintObake = await ethers.getContractFactory("Obake");
    const MintObakeDeployed = await MintObake.deploy(URI_BASE);

    await MintObakeDeployed.deployed();

    console.log("MintObake deployed to:", MintObakeDeployed.address);

    // 2) Deploy Staking
    const Staking = await ethers.getContractFactory("Staking");
    const StakingDeployed = await Staking.deploy(MintObakeDeployed.address);

    await StakingDeployed.deployed();

    console.log("Staking deployed to:", StakingDeployed.address);

    // 3) Deploy Random
    const Random = await ethers.getContractFactory("RandomNumberConsumer");
    const RandomDeployed = await Random.deploy();

    await RandomDeployed.deployed();

    console.log("Random deployed to:", RandomDeployed.address);

    // 4) Deploy Funds Manager
    const FundsManager = await ethers.getContractFactory("FundsManager");
    const FundsManagerDeployed = await FundsManager.deploy(RandomDeployed.address, StakingDeployed.address);

    await FundsManagerDeployed.deployed();

    console.log("FundsManager deployed to:", FundsManagerDeployed.address);

    // 5) Deploy CoinFlip
    const CoinFlip = await ethers.getContractFactory("CoinFlip");
    const CoinFlipDeployed = await CoinFlip.deploy(RandomDeployed.address, FundsManagerDeployed.address);

    await CoinFlipDeployed.deployed();

    console.log("CoinFlip deployed to:", CoinFlipDeployed.address);


    // 6) Deploy Raffle
    const Raffle = await ethers.getContractFactory("Raffle");
    const RaffleDeployed = await Raffle.deploy(RandomDeployed.address, FundsManagerDeployed.address);

    await RaffleDeployed.deployed();

    console.log("Raffle deployed to:", RaffleDeployed.address);


    // 7) Set CoinFlip and Raffle addresses in Random
    await(await RandomDeployed.set_contracts(CoinFlipDeployed.address, RaffleDeployed.address)).wait(2);


    // 8) Send FTM to CoinFlip
    await(await owner.sendTransaction({to:CoinFlipDeployed.address,
                                       value: ethers.utils.parseEther("1"), 
                                       gasLimit:2500000})).wait(2);


    // 9) Send Link to Random
    LINK_ADDRESS = "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F"
    const Link = await ethers.getContractFactory("ERC20")
    const Linkdeployed = await Link.attach(LINK_ADDRESS);


    await Linkdeployed.transfer(RandomDeployed.address, ethers.utils.parseEther("0.1"));


    // What's missing : Basically only unpausing contracts, then everything is ready :)

    // MintObake deployed to: 0x975C87aAabb4dc42336b3E7bb9f1Bd922a7b7CeC
    // Staking deployed to: 0xC26d81929ABC1E74bF39bcA1D0EC7001628e273E
    // Random deployed to: 0xF87133647aC1748D0e439de5C18eeeF99163e0fe
    // FundsManager deployed to: 0xa81Caa87B38aD4585EF9F3F1f5D2d27fCE9F824E
    // CoinFlip deployed to: 0xc40b2CA628e3a1CACCe531F1927246CE27bc59B0
    // Raffle deployed to: 0xe1eff0832aDac5910B110DDD5E4B9C4FB9b21A47

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
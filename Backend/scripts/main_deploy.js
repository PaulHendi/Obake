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

    // MintObake deployed to: 0x570341dEd80483EB439eE4fFfF42f88C1934f6ac
    // Staking deployed to: 0x52a6D23F0C04d284663dde33689D5e5ef0587E8a
    // Random deployed to: 0xfb6Ce4041D8C2F72FF92AC19f973Cba5FBCec12e
    // FundsManager deployed to: 0xBA4efD034B06f9b68848833a7781E9542BCebFb7
    // CoinFlip deployed to: 0xe66AcB2F2aCD4684FAC07C3A2e926F49AC0eB036
    // Raffle deployed to: 0x867F9a7d498790C24838D31F6C061423552e39CB

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
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


    // 8) Set CoinFlip and Raffle addresses in FundsManager
    await(await FundsManagerDeployed.setGamesContractAddresses(CoinFlipDeployed.address, RaffleDeployed.address)).wait(2);


    // 9) Set Funds manager address in Staking
    await(await StakingDeployed.setFundsManagerContractAddress(FundsManagerDeployed.address)).wait(2);


    // 10) Send FTM to CoinFlip
    await(await owner.sendTransaction({to:CoinFlipDeployed.address,
                                       value: ethers.utils.parseEther("1"), 
                                       gasLimit:2500000})).wait(2);


    // 11) Send Link to Random
    LINK_ADDRESS = "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F"
    const Link = await ethers.getContractFactory("ERC20")
    const Linkdeployed = await Link.attach(LINK_ADDRESS);


    await(await Linkdeployed.transfer(RandomDeployed.address, ethers.utils.parseEther("0.1"))).wait(2);

    // 12) Unpause Obake contract
    await (await MintObakeDeployed.setPaused(false)).wait(2);


    // What's missing : Verify the contracts using the dedicated bash script (verify_contracts.sh)
    // Copy paste the addresses in the script and run it
    // Then copy the addresses and the ABI in the frontend


}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
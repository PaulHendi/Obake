const {ethers} = require("hardhat");

// This script deploys the contracts and sets up the staking contract
// Get the output addresses and use them in the staking_rewards_mini_tests.js script

async function main() {

    // Deploy the Obake contract
    URI_BASE = "https://gateway.pinata.cloud/ipfs/QmXDt5rtJRwbyUFKY92hakskhUPcEdQWxeS1Mc7Gi5kiLg"

    const MintObake = await ethers.getContractFactory("Obake");
    const MintObakeDeployed = await MintObake.deploy(URI_BASE);

    await MintObakeDeployed.deployed();

    console.log("MintObake deployed to:", MintObakeDeployed.address);


    // Unpause the Obake contract
    await (await MintObakeDeployed.setPaused(false)).wait(2);



    // Deploy the Stacking contract
    const Staking = await ethers.getContractFactory("Staking");
    const StakingDeployed = await Staking.deploy(MintObakeDeployed.address);

    await StakingDeployed.deployed();

    console.log("Staking deployed to:", StakingDeployed.address);


    // Use main wallets for the tests
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");


    const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
    const bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);

    // Owner approves
    await MintObakeDeployed.setApprovalForAll(StakingDeployed.address, true);

    // Alice approves as well
    await MintObakeDeployed.connect(alice).setApprovalForAll(StakingDeployed.address, true);

    // Bob approves as well
    await MintObakeDeployed.connect(bob).setApprovalForAll(StakingDeployed.address, true);


    // Wait 10 seconds
    console.log("Everbody approves the staking contract");
    console.log("Now owner will send 1 FTM to the contract")
    console.log("Waiting 10 seconds for all txs to go through")
    await new Promise(r => setTimeout(r, 10000));


    // Owner set the funds manager address (here the owner address for unit tests)
    await(await StakingDeployed.setFundsManagerContractAddresses(owner.address)).wait(3);

    // Owner sends 1 FTM to the contract
    await (await StakingDeployed.manage_new_funds({value:ethers.utils.parseEther("1")})).wait(3);

    // Wait 10 seconds
    console.log("Waiting 10 seconds for all txs to go through")
    await new Promise(r => setTimeout(r, 10000));

    // Owner mints 5 SFT
    await MintObakeDeployed.mint(5,{value:ethers.utils.parseEther("0.05")});

    // Alice mints 5 SFT
    await MintObakeDeployed.connect(alice).mint(5,{value:ethers.utils.parseEther("0.05")});

    // Bob mints 5 SFT
    await MintObakeDeployed.connect(bob).mint(5,{value:ethers.utils.parseEther("0.05")});

    console.log("Everyboy minted 5 NFT");
   


}




main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
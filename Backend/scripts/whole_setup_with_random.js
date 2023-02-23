const {ethers} = require("hardhat");

async function main() {

    const [owner] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);

    // 1) Deploy random
    const randomn = await ethers.getContractFactory("RandomNumberConsumer");
    const randomn_deployed = await randomn.deploy();

    console.log("Random number generator address:", randomn_deployed.address);

    // Wait for the transaction to be confirmed (5 confirmations)
    await randomn_deployed.deployTransaction.wait(5)


    // 2) Deploy raffle using the address of the random number generator
    const raffle = await ethers.getContractFactory("Raffle");
    // owner.address is the fund manager here
    const raffle_deployed = await raffle.deploy(random_deployed.address, owner.address); 

    console.log("Raffle address:", raffle_deployed.address);  

    // Wait for the transaction to be confirmed (5 confirmations)
    await raffle_deployed.deployTransaction.wait(5)

    // 3) Deploy CoinFlip using the address of the random number generator
    const coinflip = await ethers.getContractFactory("CoinFlip");
    const coinflip_deployed = await coinflip.deploy(random_deployed.address, owner.address);

    console.log("CoinFlip address:", coinflip_deployed.address);

    // Wait for the transaction to be confirmed (5 confirmations)
    await coinflip_deployed.deployTransaction.wait(5)

    
    // 3) Set the raffle address in the random number consumer
    await random_deployed.set_contracts(coinflip_deployed.address, raffle_deployed.address);

    // Don't forget to fund the random contract with LINK tokens :)

}


main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
const {ethers} = require("hardhat");

async function main() {

    const [owner] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);

    // 1) Deploy random
    const randomn = await ethers.getContractFactory("RandomNumberConsumer");
    const randomn_deployed = await randomn.deploy();

    console.log("Random number generator address:", randomn_deployed.address);

    // Wait for the transaction to be confirmed (5 confirmations)
    await randomn_deployed.deployTransaction.wait(1)


    // 2) Deploy raffle using the address of the random number generator
    const raffle = await ethers.getContractFactory("Raffle");
    // owner.address is the fund manager here
    const raffle_deployed = await raffle.deploy(randomn_deployed.address, owner.address); 

    console.log("Raffle address:", raffle_deployed.address);  

    // Wait for the transaction to be confirmed (5 confirmations)
    await raffle_deployed.deployTransaction.wait(2)

    // 3) Deploy CoinFlip using the address of the random number generator
    const coinflip = await ethers.getContractFactory("CoinFlip");
    const coinflip_deployed = await coinflip.deploy(randomn_deployed.address, owner.address);

    console.log("CoinFlip address:", coinflip_deployed.address);

    // Wait for the transaction to be confirmed (5 confirmations)
    await coinflip_deployed.deployTransaction.wait(2)

    
    // 3) Set the raffle address in the random number consumer
    await(await randomn_deployed.set_contracts(coinflip_deployed.address, raffle_deployed.address)).wait(2);

    // 8) Send FTM to CoinFlip
    await(await owner.sendTransaction({to:coinflip_deployed.address,
                                       value: ethers.utils.parseEther("1"), 
                                       gasLimit:2500000})).wait(2);


    // 9) Send Link to Random
    LINK_ADDRESS = "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F"
    Link = await ethers.getContractFactory("ERC20")
    Linkdeployed = Link.attach(LINK_ADDRESS);


    await(await Linkdeployed.transfer(randomn_deployed.address, ethers.utils.parseEther("0.1"))).wait(2);

}


main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
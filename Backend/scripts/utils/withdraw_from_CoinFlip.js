const {ethers} = require("hardhat");

async function main() {

    coin_flip = await ethers.getContractFactory("CoinFlip");
    coin_flip_deployed = await coin_flip.attach("0x569813bF2c5c7106F5AD00c7d8AD23f7f8d469DD");

    // Withdraw all the funds from the contract
    await coin_flip_deployed.withdraw();

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
const {ethers} = require("hardhat");

async function playCoinFlip(user, bet, amount) {

    let tx = await CoinFlipDeployed.connect(user).play(bet, {value: amount, gasLimit:2500000});
    await tx.wait(1);
    console.log("CoinFlip played by", user.address, "with bet", bet, "and amount", ethers.utils.formatEther(amount));
}



async function getCoinFlipInfo() {

    let balance = await CoinFlipDeployed.fee_balance();
    console.log("Fee balance:", ethers.utils.formatEther(balance));
}

async function getMinLinkBalance() {
    //let tx = await FundsManagerDeployed.setMinLinkBalance(ethers.utils.parseEther("0.001"));
    //await tx.wait(1);

    // Check that the minLinkBalance has been set correctly
    let minLinkBalance = await FundsManagerDeployed.min_link_balance();
    console.log("Min link balance:", ethers.utils.formatEther(minLinkBalance));
}

async function getStakingInfo() {
    let stakingInfo = await StakingDeployed.staking_info();
    console.log("Staking info:", stakingInfo);
}


async function main() {


        // Get signers
        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);
        lisa = new ethers.Wallet(process.env.PRIVATE_KEY_LISA, provider);
        jack = new ethers.Wallet(process.env.PRIVATE_KEY_JACK, provider);
    


        console.log("Owner address:", owner.address);


        // 1) Deploy MintObake
        MintObake = await ethers.getContractFactory("Obake");
        MintObakeDeployed = await MintObake.attach("0xDD5F04d573324Beb7781094086Dc521c101F6bdA");


        // 2) Deploy Staking
        Staking = await ethers.getContractFactory("Staking");
        StakingDeployed = await Staking.attach("0x5b2df974d5A323De666914A9f8C747B6ddC40F43");


        // 3) Deploy Random
        Random = await ethers.getContractFactory("RandomNumberConsumer");
        RandomDeployed = await Random.attach("0x932858eCB16C42bCA2EcB9A259A46798A6d2946d");


        // 4) Deploy Funds Manager
        FundsManager = await ethers.getContractFactory("FundsManager");
        FundsManagerDeployed = await FundsManager.attach("0x2b09afAbAe6778D964c12ba5b469F98D9C9f9391");


        // 5) Deploy CoinFlip
        CoinFlip = await ethers.getContractFactory("CoinFlip");
        CoinFlipDeployed = await CoinFlip.attach("0x569813bF2c5c7106F5AD00c7d8AD23f7f8d469DD");



        // 6) Deploy Raffle
        Raffle = await ethers.getContractFactory("Raffle");
        RaffleDeployed = await Raffle.attach("0x9633454A4475a370325718589F27be96b4044EEd");


        await getMinLinkBalance();
        await getCoinFlipInfo();
        await playCoinFlip(alice, 1, ethers.utils.parseEther("0.1"));
        await getStakingInfo();
        // await playCoinFlip(bob, 0, ethers.utils.parseEther("0.1"));
        // await playCoinFlip(lisa, 1, ethers.utils.parseEther("0.1"));
        // await playCoinFlip(jack, 0, ethers.utils.parseEther("0.1"));




}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
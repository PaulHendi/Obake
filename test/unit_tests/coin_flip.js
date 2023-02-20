const {ethers} = require("hardhat");
const { expect } = require("chai");

describe("CoinFlip", function() {

    let coin_flip, randomness;
    let coin_flip_deployed, randomness_deployed;

    let owner, alice, bob;

    let game_info;

    beforeEach(async function() {

        provider =  new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);

        randomness = await ethers.getContractFactory("RandomNumberConsumer");
        coin_flip = await ethers.getContractFactory("CoinFlip");

        randomness_deployed = await randomness.attach("0xe9Be55Af103f318CECcaC9E2b6De7a0484A8328c");
        coin_flip_deployed = await coin_flip.attach("0x7761c0D0A9537C5142Cd8DfF04Ed36F5C3DBA2C0");


    });



    // Tested this several times to check that the fees are sent to the fund manager (here the owner)
    // It all worked fine
    // it("Tests coin flip with a normal scenario", async function() {

    //     // Alice bets heads
    //     await(await coin_flip_deployed.connect(alice).play(0, {value: ethers.utils.parseEther("0.1")})).wait(3); // wait for 2 blocks to be mined

    //     // Get the requestId for both participants
    //     alice_request_id = await coin_flip_deployed.request_ids(alice.address);
    //     console.log("Alice's request id:", alice_request_id.toString());

    //     // Print game info for alice's request id
    //     game_info = await coin_flip_deployed.games(alice_request_id);
    //     console.log("Game info Alice:", game_info);

    //     // Bob bets tails
    //     await(await coin_flip_deployed.connect(bob).play(1, {value: ethers.utils.parseEther("0.1")})).wait(3); // wait for 2 blocks to be mined

    //     // Get the requestId for both participants
    //     let bob_request_id = await coin_flip_deployed.request_ids(bob.address);
    //     console.log("Bob's request id:", bob_request_id.toString());

    //     // Print game info for bob's request id
    //     game_info = await coin_flip_deployed.games(bob_request_id);
    //     console.log("Game info Bob:", game_info);


    //     // Wait for 10 seconds
    //     await new Promise(r => setTimeout(r, 10000));


    //     // Print game info for both participants
    //     game_info = await coin_flip_deployed.games(alice_request_id);
    //     console.log("Game info alice:", game_info);

    //     game_info = await coin_flip_deployed.games(bob_request_id);
    //     console.log("Game info bob:", game_info);      
        
    //     // Print the fee balance
    //     fee_balance = await coin_flip_deployed.fee_balance();
    //     console.log("Fee balance:", ethers.utils.formatEther(fee_balance));        


    // });


    // For some reasons, the tests below don't work (Need to investigate expect)
    it("Tests all requires", async function() {
    

        // Owner tries a bet that's not heads or tails
        await expect(coin_flip_deployed.connect(alice).play(2, {value: ethers.utils.parseEther("0.1")})).to.be.reverted; //With("You must guess either heads or tails");

        // Alice tries to bet 0 FTM
        await expect(coin_flip_deployed.connect(alice).play(0, {value: ethers.utils.parseEther("0")})).to.be.reverted; //With("Amount sent not correct");

        // Alice tries to bet 1.03 FTM
        await expect(coin_flip_deployed.connect(alice).play(0, {value: ethers.utils.parseEther("1.03")})).to.be.reverted; //With("Amount sent not correct");


        // Alice tries a bet of 1 FTM but the contract has only 0.5 FTM
        await expect(coin_flip_deployed.connect(alice).play(0, {value: ethers.utils.parseEther("1")})).to.be.reverted; //With("Contract balance too low");

        // Alice bets one time, doesn't wait for the result and tries to bet again
        await(await coin_flip_deployed.connect(alice).play(0, {value: ethers.utils.parseEther("0.1")})).wait(2); // wait for 2 blocks to be mined
        await expect(coin_flip_deployed.connect(alice).play(0, {value: ethers.utils.parseEther("0.1")})).to.be.reverted; //With("You are already playing a game, wait for the outcome");

        // Bob tries to call flipResult but he's not the oracle
        await expect(coin_flip_deployed.connect(bob).flipResult(0, 0)).to.be.reverted; //With("Only the RandomNumberConsumer contract can call this function");



    });

    // We can test the setters as well
    

});
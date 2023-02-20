const {ethers} = require("hardhat");
const { expect } = require("chai");

describe("obake", function() {

    let obake, obake_deployed;

    let owner, alice, bob;

    beforeEach(async function() {
            
        provider =  new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);

        obake = await ethers.getContractFactory("Obake");
        obake_deployed = await obake.deploy("https://gateway.pinata.cloud/ipfs/QmQRpDw3QVP3AzwMMFowgkEWhmvMvdaaKZNrxs41VziL5B/1.json");

        await obake_deployed.deployed();

    });

    // Additional tests : 
    // - Name and symbol of the token visible on the explorer, yes
    // - Image accessible on a markeplace, yes (tested on opensea)
    // - Metadata accessible on a marketplace, yes (tested on opensea)


    it("Tests minting of obake", async function() {

        // First step : The owner unpause the contract 
        await(await obake_deployed.setPaused(false)).wait(2);

        // Alice mints 1 obake
        await(await obake_deployed.connect(alice).mint(1, {value: ethers.utils.parseEther("0.01")})).wait(2);

        // Alice checks her balance
        let alice_balance = await obake_deployed.balanceOf(alice.address, 1); // 1 is the token id
        expect(alice_balance.toString()).to.equal("1");

        // Check the supply
        let supply = await obake_deployed.supply();
        expect(supply).to.equal(1);


        // Bob mints 3 obake
        await(await obake_deployed.connect(bob).mint(3, {value: ethers.utils.parseEther("0.03")})).wait(2);

        // Check the supply
        supply = await obake_deployed.supply();
        expect(supply).to.equal(4);

    });


    // it("should test requires", async function() {
    
    //     // Alice tries to mint, but the contract is paused
    //     await expect(obake_deployed.connect(alice).mint(1, {value: ethers.utils.parseEther("0.1")})).to.be.reverted;

    //     // Alice tries to mint, but she doesn't have enough funds
    //     await(await obake_deployed.setPaused(false)).wait(2);
    //     await expect(obake_deployed.connect(alice).mint(1, {value: ethers.utils.parseEther("0.001")})).to.be.reverted;

    //     // Alice mints 6 obake
    //     await(await obake_deployed.connect(alice).mint(6, {value: ethers.utils.parseEther("0.06")})).wait(2);

    //     // Need to test the amount available before sold out

    //     // Need to test the setter as well


    // });

});
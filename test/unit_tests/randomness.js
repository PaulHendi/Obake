const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Randomness", function () {


    let randomness_contract, randomness_contract_deployed;

    let owner, alice, bob;

    beforeEach(async function () {
            
            const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");
    
            owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
            bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);

            randomness_contract = await ethers.getContractFactory("RandomNumberConsumer");
            randomness_contract_deployed = await randomness_contract.deploy();

            await randomness_contract_deployed.deployed();

            console.log("Randomness deployed to:", randomness_contract_deployed.address)

            // Set alice's address as the CoinFlip contract
            // Set Bob's address as the Lottery contract
            await randomness_contract_deployed.set_contracts(alice.address, bob.address);

            contract_as_alice = randomness_contract_deployed.connect(alice);
            contract_as_bob = randomness_contract_deployed.connect(bob);


    });

    it("Should tests the requires", async function () {


        // Owner request a random number
        await expect(randomness_contract_deployed.getRandom()).to.be.reverted;

        // Alice sets the callback gas limit
        await expect(contract_as_alice.set_callback_gas_limit(100000)).to.be.reverted;
        
        // Bob sets the request confirmation
        await expect(contract_as_bob.set_request_confirmation(true)).to.be.reverted;

        // Alice sets the link address
        await expect(contract_as_alice.set_link_address(alice.address)).to.be.reverted;

        // Bob sets the VRF Coordinator address
        await expect(contract_as_bob.set_vrf_coordinator_address(bob.address)).to.be.reverted;

        // Owner calls the fulfillRandomness function
        await expect(randomness_contract_deployed.fulfillRandomness(0, 0)).to.be.reverted;

    });

    // The rest of the tests actually need the CoinFlip and Lottery contracts

});

const {ethers} = require("hardhat");

describe("FundsManager", function () {

    // Note : the fund manager doesn't function by itself. It needs other contracts to interact with.
    // But we can test here the swap function and send Link tokens to Alice 
    // and FTM to Bob. The owner will act as the initiator by sending funds (instead of coinflip and lottery contracts)

    
    let funds_manager;
    let funds_manager_deployed;

    let owner, alice, bob;

    beforeEach(async function () {

            const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

            owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
            bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);


            funds_manager = await ethers.getContractFactory("FundsManager");

            // Alice and Bob are the addresses of the randomness and staking contracts (Respectively)
            funds_manager_deployed = await funds_manager.deploy(alice.address, bob.address);
    
            await funds_manager_deployed.deployed(); 
            
            console.log("Funds Manager deployed at : " + funds_manager_deployed.address)
    

    });

    it("Should the money management by the contract", async function () {

        // Owner sends 0.1FTM to the contract
        await(await owner.sendTransaction({value: ethers.utils.parseEther("0.1") ,to: funds_manager_deployed.address})).wait(3);

        // We check on the explorer all the txs
        // All good for the tests (check associated image)
        

    });

});
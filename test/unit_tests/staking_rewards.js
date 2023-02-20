const {ethers} = require("hardhat");


describe("Staking", function () {

    let staking_contract, sft_contract; 
    let staking_contract_deployed, sft_contract_deployed; 

    let owner, alice, bob;


    beforeEach(async function () {


        // Get the Stacking contract
        staking_contract = await ethers.getContractFactory("Staking");
        staking_contract_deployed = await staking_contract.deploy("0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b");

        await staking_contract_deployed.deployed();

        console.log("Staking deployed to:", staking_contract_deployed.address)

        // Approve the staking contract to spend the SFTs
        sft_contract = await ethers.getContractFactory("SFT");
        sft_contract_deployed = await sft_contract.attach("0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b");

        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");


        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);

        // Owner approves
        await sft_contract_deployed.setApprovalForAll(staking_contract_deployed.address, true);

        // Alice approves as well
        await sft_contract_deployed.connect(alice).setApprovalForAll(staking_contract_deployed.address, true);

        // Bob approves as well
        await sft_contract_deployed.connect(bob).setApprovalForAll(staking_contract_deployed.address, true);


        // Wait 10 seconds
        console.log("Everbody approves the staking contract");
        console.log("Now owner will send 1 FTM to the contract")
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

        // Owner sends 1 FTM to the contract
        await(await owner.sendTransaction({to:staking_contract_deployed.address, value:ethers.utils.parseEther("1")})).wait(3);

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

        // Owner mints 5 SFT
        await sft_contract_deployed.mint(5,{value:ethers.utils.parseEther("0.05")});

        // Alice mints 5 SFT
        await sft_contract_deployed.connect(alice).mint(5,{value:ethers.utils.parseEther("0.05")});

        // Bob mints 5 SFT
        await sft_contract_deployed.connect(bob).mint(5,{value:ethers.utils.parseEther("0.05")});

        console.log("Everyboy minted NFT");
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

    });

    it("Should stake", async function () {
    });


});
const {ethers}=require("hardhat");
const {expect}=require("chai");

describe("Lottery", function () {

    let lottery, random_number_generator;
    let lottery_deployed, random_number_generator_deployed;
    let owner, alice, bob;

    beforeEach(async function () {

        lottery = await ethers.getContractFactory("Lottery");
        random_number_generator = await ethers.getContractFactory("RandomNumberConsumer");

        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);


        lottery_deployed = await lottery.attach("0x36925BA255BEE771b8AE0d341A035813b4707Fb9")
        random_number_generator_deployed = await random_number_generator.attach("0x1FF97d2DAB7A52603D15e720b07eDf1b07e07BD6");

    });

    it("Test lottery", async function () {

        await(await lottery_deployed.start_new_lottery(ethers.utils.parseEther("0.1"))).wait(2); // wait for 2 blocks to be mined


        // Print balances of every participants
        console.log("Owner balance:", (await ethers.provider.getBalance(owner.address)).toString());
        console.log("Alice balance:", (await ethers.provider.getBalance(alice.address)).toString());
        console.log("Bob balance:", (await ethers.provider.getBalance(bob.address)).toString());

        
        // Alice and Bob join the lottery
        await lottery_deployed.connect(alice).enter({value: ethers.utils.parseEther("0.1")});
        await lottery_deployed.connect(bob).enter({value: ethers.utils.parseEther("0.1")});

        // Owner joins the lottery as well
        await(await lottery_deployed.enter({value: ethers.utils.parseEther("0.1")})).wait(3); // wait for 3 blocks to be mined

       // Print balances of every participants
       console.log("Owner balance:", (await ethers.provider.getBalance(owner.address)).toString());
       console.log("Alice balance:", (await ethers.provider.getBalance(alice.address)).toString());
       console.log("Bob balance:", (await ethers.provider.getBalance(bob.address)).toString());

        // Owner ends the lottery ( Max gas limit : 2,500,000 (from the docs) )
        await lottery_deployed.end_lottery({gasLimit: 2500000});


    });

});
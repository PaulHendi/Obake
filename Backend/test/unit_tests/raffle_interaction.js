const {ethers}=require("hardhat");
const {expect}=require("chai");

// Note : To test this contract we need accounts with NFTs
// I used a contract from another repo to generate some collections

// Note : Before running the tests, make sure to fund the random number generator with LINK tokens
// And double check the tx went trough, Fantom Testnet can be buggy sometimes

// Note : For this tests, we need to manually keep track of the NFTs we are using. They are transfered randomly
// We can just forget about the NFTs that were won, and set up the accounts with NFTs beforehand

describe("Raffle", function () {


    // Hardcode contract addresses for all the collections we are using
    let BabyMonkeys = "0x438b14F0C273a1D2828c0383a0B6531fa3b8DD67"
    let MozartX = "0x3B18C169369726B52C2F4d13B6667D1edDa3AB33"
    let WomanKats = "0x32095C9D22Bbb74F4CA6aD8b35805a0187c8C835"
    let Beagles = "0x8981be63E9E549F78ba21D994fCc8A8Ff176A701"

    let raffle, random_number_generator, ERC721;
    let raffle_deployed, random_number_generator_deployed, beagle_deployed;
    let owner, alice, bob;
    let raffleId, raffle_info;


    beforeEach(async function () {

        raffle = await ethers.getContractFactory("Raffle");
        random_number_generator = await ethers.getContractFactory("RandomNumberConsumer");
        ERC721 = await ethers.getContractFactory("ERC721");


        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);


        raffle_deployed = await raffle.attach("0xC76a241c2a24c069203750998449C347D1D4f0c9")
        random_number_generator_deployed = await random_number_generator.attach("0xf5aAd3A4f8c7bc353d97C5BA68EcD9888010D6bC");
        // CoinFlip : 0x978760A2Fb864D80E36513CA9D467B6c3A20cf63

        // Owner approve the raffle contract to transfer NFTs
        beagle_deployed = await ERC721.attach(Beagles);
    });

    async function queryMainInfo(_raffleId) {
        raffle_info = await raffle_deployed.lotteries(_raffleId)                                      

        // Print raffle info
        console.log("Raffle id:", _raffleId.toString());
        console.log("Raffle info:", raffle_info);
    }


    // it("Should call emergency withdraw", async function () {
    //     // Owner calls emergency withdraw
    //     await raffle_deployed.emergency_withdraw({gasLimit: 2500000});
    // });

    // it("should test a first raffle that doesn't end with solding all tickets", async function () {


    //     // Owner needs to approve the raffle contract to transfer NFTs (Beagles #3)
    //     await(await beagle_deployed.approve(raffle_deployed.address, 3)).wait(2); // wait for 2 blocks to be mined

    //     // Owner starts a new raffle (Beagle #3, 5 tickets, 0.1 FTM per ticket)
    //     await(await raffle_deployed.start_new_raffle(
    //                                                     Beagles,                            
    //                                                     3,
    //                                                     ethers.utils.parseEther("0.1"),
    //                                                     5)).wait(3); // wait for 2 blocks to be mined


    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(owner.address);
    //     await queryMainInfo(raffleId);

    //     // Alice and Bob join the raffle (They buy 1 ticket each, 0.1 FTM each)
    //     await raffle_deployed.connect(alice).enter(raffleId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await raffle_deployed.connect(bob).enter(raffleId, 1, {value: ethers.utils.parseEther("0.1")});

    //     // query main info
    //     await queryMainInfo(raffleId);


    //     // Owner ends the raffle (Before the 5 tickets are sold )
    //     await(await raffle_deployed.end_raffle(raffleId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined

    //     // query main info
    //     await queryMainInfo(raffleId);

    // });

    // it("should test a second raffle that ends with solding all tickets", async function () {

    //     // Owner needs to approve the raffle contract to transfer NFTs (Beagles #3)
    //     await(await beagle_deployed.approve(raffle_deployed.address, 3)).wait(2); // wait for 2 blocks to be mined

    //     // Owner starts a new raffle (Beagle #3, 5 tickets, 0.1 FTM per ticket)
    //     await(await raffle_deployed.start_new_raffle(
    //                                                     Beagles,                            
    //                                                     3,
    //                                                     ethers.utils.parseEther("0.1"),
    //                                                     5)).wait(3); // wait for 2 blocks to be mined


    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(owner.address);
    //     await queryMainInfo(raffleId);

    //     // Alice and Bob join the raffle (They buy 2 and 3 tickets respectively, correct price)
    //     await raffle_deployed.connect(alice).enter(raffleId, 2,{value: ethers.utils.parseEther("0.2")});
    //     await raffle_deployed.connect(bob).enter(raffleId, 3, {value: ethers.utils.parseEther("0.3")});

    //     // query main info
    //     await queryMainInfo(raffleId);


    //     // Owner ends the raffle (Before the 5 tickets are sold )
    //     await(await raffle_deployed.end_raffle(raffleId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined

    //     // query main info
    //     await queryMainInfo(raffleId);


    //     // At the end of the raffle, the owner should not have the NFT anymore

    // });




    // it("Should test two lotteries in a row by the same owner, first one not sold out, second one with same NFT sold out", async function () {

    //     // Owner needs to approve the raffle contract to transfer NFTs (Beagles #4)
    //     await(await beagle_deployed.approve(raffle_deployed.address, 4)).wait(2); // wait for 2 blocks to be mined

    //     // Owner starts a new raffle (Beagle #4, 5 tickets, 0.1 FTM per ticket)
    //     await(await raffle_deployed.start_new_raffle(
    //                                                     Beagles,                            
    //                                                     4,
    //                                                     ethers.utils.parseEther("0.1"),
    //                                                     5)).wait(3); // wait for 2 blocks to be mined


    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(owner.address); 
    //     await queryMainInfo(raffleId);

    //     // Alice and Bob join the raffle (They buy 1 ticket each, 0.1 FTM each)
    //     await raffle_deployed.connect(alice).enter(raffleId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await raffle_deployed.connect(bob).enter(raffleId, 1, {value: ethers.utils.parseEther("0.1")});

    //     // query main info
    //     await queryMainInfo(raffleId);


    //     // Owner ends the raffle (Before the 5 tickets are sold )
    //     await(await raffle_deployed.end_raffle(raffleId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined

    //     // query main info
    //     await queryMainInfo(raffleId);


    //     // Owner needs to approve the raffle contract to transfer NFTs (Beagles #4)
    //     await(await beagle_deployed.approve(raffle_deployed.address, 4)).wait(2); // wait for 2 blocks to be mined

    //     // Owner starts again a new raffle with the same parameters
    //     await(await raffle_deployed.start_new_raffle(
    //                                                     Beagles,                            
    //                                                     4,
    //                                                     ethers.utils.parseEther("0.1"),
    //                                                     5)).wait(3); // wait for 2 blocks to be mined


    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(owner.address);
    //     await queryMainInfo(raffleId);

    //     // Alice and Bob join the raffle (They buy 2 and 3 tickets respectively, correct price)
    //     await raffle_deployed.connect(alice).enter(raffleId, 2,{value: ethers.utils.parseEther("0.2")});
    //     await raffle_deployed.connect(bob).enter(raffleId, 3, {value: ethers.utils.parseEther("0.3")});

    //     // query main info
    //     await queryMainInfo(raffleId);


    //     // Owner ends the raffle (Before the 5 tickets are sold )
    //     await(await raffle_deployed.end_raffle(raffleId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined

    //     // query main info
    //     await queryMainInfo(raffleId);


    //     // At the end of the raffle, the owner should not have the NFT anymore


    // });


    // it("Should test two lotteries by different owners, the second one starts before the first one ends", async function () {

    //     // Bob needs to approve the raffle contract to transfer NFTs (Beagles #4)
    //     await(await beagle_deployed.connect(bob).approve(raffle_deployed.address, 4)).wait(2); // wait for 2 blocks to be mined

    //     // Bob starts a new raffle (Beagle #4, 5 tickets, 0.1 FTM per ticket)
    //     await(await raffle_deployed.connect(bob).start_new_raffle(
    //                                                                   Beagles,                            
    //                                                                   4,
    //                                                                   ethers.utils.parseEther("0.1"),
    //                                                                   5)).wait(3); // wait for 2 blocks to be mined

        
    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(bob.address);
    //     await queryMainInfo(raffleId);

    //     // Alice and Owner join the raffle 
    //     await raffle_deployed.connect(alice).enter(raffleId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await raffle_deployed.connect(owner).enter(raffleId, 1, {value: ethers.utils.parseEther("0.1")});


    //     // Alice needs to approve the raffle contract to transfer NFTs (Beagles #2)
    //     await(await beagle_deployed.connect(alice).approve(raffle_deployed.address, 2)).wait(2); // wait for 2 blocks to be mined

    //     // Alice starts a new raffle (Beagle #2, 5 tickets, 0.1 FTM per ticket)
    //     await(await raffle_deployed.connect(alice).start_new_raffle(
    //                                                                     Beagles,                            
    //                                                                     2,
    //                                                                     ethers.utils.parseEther("0.1"),
    //                                                                     5)).wait(3); // wait for 2 blocks to be mined

    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(alice.address);
    //     await queryMainInfo(raffleId);

    //     // Owner and Bob join the raffle 
    //     await raffle_deployed.connect(bob).enter(raffleId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await raffle_deployed.connect(owner).enter(raffleId, 1, {value: ethers.utils.parseEther("0.1")});     
        
    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(bob.address);
    //     await queryMainInfo(raffleId);       

    //     // Alice and Owner buy tickets again
    //     await raffle_deployed.connect(alice).enter(raffleId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await raffle_deployed.connect(owner).enter(raffleId, 2, {value: ethers.utils.parseEther("0.2")});

    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(bob.address);
    //     await queryMainInfo(raffleId);       
        
    //     // Bob ends the raffle 
    //     await(await raffle_deployed.connect(bob).end_raffle(raffleId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined


    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(alice.address);
    //     await queryMainInfo(raffleId);

    //     // Alice ends the raffle
    //     await(await raffle_deployed.connect(alice).end_raffle(raffleId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined


    //     // query main info
    //     raffleId = await raffle_deployed.ownerRaffleId(alice.address);
    //     await queryMainInfo(raffleId);
     

    // });


    // it("Should test all the requires", async function () {});


    // it("Should test sending fund to the funds manager", async function () {}); 


});
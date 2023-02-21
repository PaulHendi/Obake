const {ethers}=require("hardhat");
const {expect}=require("chai");

// Note : To test this contract we need accounts with NFTs
// I used a contract from another repo to generate some collections

// Note : Before running the tests, make sure to fund the random number generator with LINK tokens
// And double check the tx went trough, Fantom Testnet can be buggy sometimes

// Note : For this tests, we need to manually keep track of the NFTs we are using. They are transfered randomly
// We can just forget about the NFTs that were won, and set up the accounts with NFTs beforehand

describe("Lottery", function () {


    // Hardcode contract addresses for all the collections we are using
    let BabyMonkeys = "0x438b14F0C273a1D2828c0383a0B6531fa3b8DD67"
    let MozartX = "0x3B18C169369726B52C2F4d13B6667D1edDa3AB33"
    let WomanKats = "0x32095C9D22Bbb74F4CA6aD8b35805a0187c8C835"
    let Beagles = "0x8981be63E9E549F78ba21D994fCc8A8Ff176A701"

    let lottery, random_number_generator, ERC721;
    let lottery_deployed, random_number_generator_deployed, beagle_deployed;
    let owner, alice, bob;
    let lotteryId, lottery_info;


    beforeEach(async function () {

        lottery = await ethers.getContractFactory("Lottery");
        random_number_generator = await ethers.getContractFactory("RandomNumberConsumer");
        ERC721 = await ethers.getContractFactory("ERC721");


        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);


        lottery_deployed = await lottery.attach("0xC76a241c2a24c069203750998449C347D1D4f0c9")
        random_number_generator_deployed = await random_number_generator.attach("0xf5aAd3A4f8c7bc353d97C5BA68EcD9888010D6bC");
        // CoinFlip : 0x978760A2Fb864D80E36513CA9D467B6c3A20cf63

        // Owner approve the lottery contract to transfer NFTs
        beagle_deployed = await ERC721.attach(Beagles);
    });

    async function queryMainInfo(_lotteryId) {
        lottery_info = await lottery_deployed.lotteries(_lotteryId)                                      

        // Print lottery info
        console.log("Lottery id:", _lotteryId.toString());
        console.log("Lottery info:", lottery_info);
    }


    // it("Should call emergency withdraw", async function () {
    //     // Owner calls emergency withdraw
    //     await lottery_deployed.emergency_withdraw({gasLimit: 2500000});
    // });

    // it("should test a first lottery that doesn't end with solding all tickets", async function () {


    //     // Owner needs to approve the lottery contract to transfer NFTs (Beagles #3)
    //     await(await beagle_deployed.approve(lottery_deployed.address, 3)).wait(2); // wait for 2 blocks to be mined

    //     // Owner starts a new lottery (Beagle #3, 5 tickets, 0.1 FTM per ticket)
    //     await(await lottery_deployed.start_new_lottery(
    //                                                     Beagles,                            
    //                                                     3,
    //                                                     ethers.utils.parseEther("0.1"),
    //                                                     5)).wait(3); // wait for 2 blocks to be mined


    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(owner.address);
    //     await queryMainInfo(lotteryId);

    //     // Alice and Bob join the lottery (They buy 1 ticket each, 0.1 FTM each)
    //     await lottery_deployed.connect(alice).enter(lotteryId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await lottery_deployed.connect(bob).enter(lotteryId, 1, {value: ethers.utils.parseEther("0.1")});

    //     // query main info
    //     await queryMainInfo(lotteryId);


    //     // Owner ends the lottery (Before the 5 tickets are sold )
    //     await(await lottery_deployed.end_lottery(lotteryId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined

    //     // query main info
    //     await queryMainInfo(lotteryId);

    // });

    // it("should test a second lottery that ends with solding all tickets", async function () {

    //     // Owner needs to approve the lottery contract to transfer NFTs (Beagles #3)
    //     await(await beagle_deployed.approve(lottery_deployed.address, 3)).wait(2); // wait for 2 blocks to be mined

    //     // Owner starts a new lottery (Beagle #3, 5 tickets, 0.1 FTM per ticket)
    //     await(await lottery_deployed.start_new_lottery(
    //                                                     Beagles,                            
    //                                                     3,
    //                                                     ethers.utils.parseEther("0.1"),
    //                                                     5)).wait(3); // wait for 2 blocks to be mined


    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(owner.address);
    //     await queryMainInfo(lotteryId);

    //     // Alice and Bob join the lottery (They buy 2 and 3 tickets respectively, correct price)
    //     await lottery_deployed.connect(alice).enter(lotteryId, 2,{value: ethers.utils.parseEther("0.2")});
    //     await lottery_deployed.connect(bob).enter(lotteryId, 3, {value: ethers.utils.parseEther("0.3")});

    //     // query main info
    //     await queryMainInfo(lotteryId);


    //     // Owner ends the lottery (Before the 5 tickets are sold )
    //     await(await lottery_deployed.end_lottery(lotteryId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined

    //     // query main info
    //     await queryMainInfo(lotteryId);


    //     // At the end of the lottery, the owner should not have the NFT anymore

    // });




    // it("Should test two lotteries in a row by the same owner, first one not sold out, second one with same NFT sold out", async function () {

    //     // Owner needs to approve the lottery contract to transfer NFTs (Beagles #4)
    //     await(await beagle_deployed.approve(lottery_deployed.address, 4)).wait(2); // wait for 2 blocks to be mined

    //     // Owner starts a new lottery (Beagle #4, 5 tickets, 0.1 FTM per ticket)
    //     await(await lottery_deployed.start_new_lottery(
    //                                                     Beagles,                            
    //                                                     4,
    //                                                     ethers.utils.parseEther("0.1"),
    //                                                     5)).wait(3); // wait for 2 blocks to be mined


    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(owner.address); 
    //     await queryMainInfo(lotteryId);

    //     // Alice and Bob join the lottery (They buy 1 ticket each, 0.1 FTM each)
    //     await lottery_deployed.connect(alice).enter(lotteryId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await lottery_deployed.connect(bob).enter(lotteryId, 1, {value: ethers.utils.parseEther("0.1")});

    //     // query main info
    //     await queryMainInfo(lotteryId);


    //     // Owner ends the lottery (Before the 5 tickets are sold )
    //     await(await lottery_deployed.end_lottery(lotteryId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined

    //     // query main info
    //     await queryMainInfo(lotteryId);


    //     // Owner needs to approve the lottery contract to transfer NFTs (Beagles #4)
    //     await(await beagle_deployed.approve(lottery_deployed.address, 4)).wait(2); // wait for 2 blocks to be mined

    //     // Owner starts again a new lottery with the same parameters
    //     await(await lottery_deployed.start_new_lottery(
    //                                                     Beagles,                            
    //                                                     4,
    //                                                     ethers.utils.parseEther("0.1"),
    //                                                     5)).wait(3); // wait for 2 blocks to be mined


    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(owner.address);
    //     await queryMainInfo(lotteryId);

    //     // Alice and Bob join the lottery (They buy 2 and 3 tickets respectively, correct price)
    //     await lottery_deployed.connect(alice).enter(lotteryId, 2,{value: ethers.utils.parseEther("0.2")});
    //     await lottery_deployed.connect(bob).enter(lotteryId, 3, {value: ethers.utils.parseEther("0.3")});

    //     // query main info
    //     await queryMainInfo(lotteryId);


    //     // Owner ends the lottery (Before the 5 tickets are sold )
    //     await(await lottery_deployed.end_lottery(lotteryId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined

    //     // query main info
    //     await queryMainInfo(lotteryId);


    //     // At the end of the lottery, the owner should not have the NFT anymore


    // });


    // it("Should test two lotteries by different owners, the second one starts before the first one ends", async function () {

    //     // Bob needs to approve the lottery contract to transfer NFTs (Beagles #4)
    //     await(await beagle_deployed.connect(bob).approve(lottery_deployed.address, 4)).wait(2); // wait for 2 blocks to be mined

    //     // Bob starts a new lottery (Beagle #4, 5 tickets, 0.1 FTM per ticket)
    //     await(await lottery_deployed.connect(bob).start_new_lottery(
    //                                                                   Beagles,                            
    //                                                                   4,
    //                                                                   ethers.utils.parseEther("0.1"),
    //                                                                   5)).wait(3); // wait for 2 blocks to be mined

        
    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(bob.address);
    //     await queryMainInfo(lotteryId);

    //     // Alice and Owner join the lottery 
    //     await lottery_deployed.connect(alice).enter(lotteryId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await lottery_deployed.connect(owner).enter(lotteryId, 1, {value: ethers.utils.parseEther("0.1")});


    //     // Alice needs to approve the lottery contract to transfer NFTs (Beagles #2)
    //     await(await beagle_deployed.connect(alice).approve(lottery_deployed.address, 2)).wait(2); // wait for 2 blocks to be mined

    //     // Alice starts a new lottery (Beagle #2, 5 tickets, 0.1 FTM per ticket)
    //     await(await lottery_deployed.connect(alice).start_new_lottery(
    //                                                                     Beagles,                            
    //                                                                     2,
    //                                                                     ethers.utils.parseEther("0.1"),
    //                                                                     5)).wait(3); // wait for 2 blocks to be mined

    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(alice.address);
    //     await queryMainInfo(lotteryId);

    //     // Owner and Bob join the lottery 
    //     await lottery_deployed.connect(bob).enter(lotteryId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await lottery_deployed.connect(owner).enter(lotteryId, 1, {value: ethers.utils.parseEther("0.1")});     
        
    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(bob.address);
    //     await queryMainInfo(lotteryId);       

    //     // Alice and Owner buy tickets again
    //     await lottery_deployed.connect(alice).enter(lotteryId, 1,{value: ethers.utils.parseEther("0.1")});
    //     await lottery_deployed.connect(owner).enter(lotteryId, 2, {value: ethers.utils.parseEther("0.2")});

    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(bob.address);
    //     await queryMainInfo(lotteryId);       
        
    //     // Bob ends the lottery 
    //     await(await lottery_deployed.connect(bob).end_lottery(lotteryId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined


    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(alice.address);
    //     await queryMainInfo(lotteryId);

    //     // Alice ends the lottery
    //     await(await lottery_deployed.connect(alice).end_lottery(lotteryId, {gasLimit: 2500000})).wait(2); // wait for 2 blocks to be mined


    //     // query main info
    //     lotteryId = await lottery_deployed.ownerLotteryId(alice.address);
    //     await queryMainInfo(lotteryId);
     

    // });


    // it("Should test all the requires", async function () {});


    // it("Should test sending fund to the funds manager", async function () {}); 


});
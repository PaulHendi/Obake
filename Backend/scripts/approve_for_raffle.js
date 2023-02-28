const {ethers}=require("hardhat");
const {expect}=require("chai");

// Note : To test this contract we need accounts with NFTs
// I used a contract from another repo to generate some collections

// Note : Before running the tests, make sure to fund the random number generator with LINK tokens
// And double check the tx went trough, Fantom Testnet can be buggy sometimes

// Note : For this tests, we need to manually keep track of the NFTs we are using. They are transfered randomly
// We can just forget about the NFTs that were won, and set up the accounts with NFTs beforehand

async function main() {
        // Hardcode contract addresses for all the collections we are using
        let BabyMonkeys = "0x438b14F0C273a1D2828c0383a0B6531fa3b8DD67"
        let MozartX = "0x3B18C169369726B52C2F4d13B6667D1edDa3AB33"
        let WomanKats = "0x32095C9D22Bbb74F4CA6aD8b35805a0187c8C835"
        let Beagles = "0x8981be63E9E549F78ba21D994fCc8A8Ff176A701"
    
        const raffle_address = "0xe1eff0832aDac5910B110DDD5E4B9C4FB9b21A47"
        const nft_id = 4
    
    
       
        const ERC721 = await ethers.getContractFactory("ERC721");
        const beagle_deployed = await ERC721.attach(Beagles);
    
        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");
    
        const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        const bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);
    
        //await beagle_deployed.approve(raffle_address, nft_id); // wait for 2 blocks to be mined

        // Check that the NFT was approved
        let approved = await beagle_deployed.getApproved(nft_id);
        console.log("Approved:", approved);

        // Check that the NFT was approved with isApprovedForAll
        let approved_for_all = await beagle_deployed.isApprovedForAll(owner.address, raffle_address);
        console.log("Approved for all:", approved_for_all);

        // Get token URI
        let token_uri = await beagle_deployed.tokenURI(nft_id);
        console.log("Token URI:", token_uri);
    
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});



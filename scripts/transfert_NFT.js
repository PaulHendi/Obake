const {ethers} = require("hardhat");


async function main() {

    // Hardcode contract addresses for all the collections we are using
    let BabyMonkeys = "0x438b14F0C273a1D2828c0383a0B6531fa3b8DD67"
    let MozartX = "0x3B18C169369726B52C2F4d13B6667D1edDa3AB33"
    let WomanKats = "0x32095C9D22Bbb74F4CA6aD8b35805a0187c8C835"
    let Beagles = "0x8981be63E9E549F78ba21D994fCc8A8Ff176A701"    

    ERC721 = await ethers.getContractFactory("ERC721");

    const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

    owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
    bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);

    beagle_deployed = await ERC721.attach(Beagles);

    // Bob transfers a NFT to the owner
    await beagle_deployed.connect(alice).transferFrom(alice.address, bob.address, 2);


}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
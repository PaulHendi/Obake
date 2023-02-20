const {ethers} = require("hardhat");

async function main() {

    address_liquidity_pool = "0x1060b870859c981b05C4CC7baE91d884f7dF9590";
    address_wftm = "0xf1277d1Ed8AD466beddF92ef448A132661956621";
    address_link = "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F";
    spookyswap_router = "0xa6AD18C2aC47803E193F75c3677b14BF19B94883";

    // Those values are harcoded. Go on the explorer check the current balances
    balance_link = 0.1953;
    balance_wftm = 0.1038;

    // This is hardcoded as well. IT's up to you to change it
    balance_link_desired = balance_link*20;
    balance_wftm_desired = balance_wftm*20;

    // Owner approves the router to spend the Link tokens
    const [owner] = await ethers.getSigners();

    // from WFTM contract
    let iface = new ethers.utils.Interface(["function approve(address guy, uint256 wad)"]);
    let data = iface.encodeFunctionData("approve", [spookyswap_router, ethers.utils.parseEther(balance_link_desired.toString())]);   
    
    await(await owner.sendTransaction({to: address_link, data : data})).wait(3);

    // Swap Exact Tokens For Tokens
    let iface2 = new ethers.utils.Interface(["function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline)"]);
    let data2 =  iface2.encodeFunctionData("addLiquidityETH", 
                                            [address_link,
                                            ethers.utils.parseEther(balance_link_desired.toString()),
                                            "0",
                                            "0",
                                            owner.address,
                                            Math.floor(Date.now() / 1000) + 60 * 60]);  

    await(await owner.sendTransaction({value: ethers.utils.parseEther(balance_wftm_desired.toString()) ,to: spookyswap_router, data : data2, gasLimit:2500000})).wait(3);

    

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
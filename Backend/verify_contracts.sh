# Utils script to verify contracts on FTMScan
# Note that you need to have a FTMScan API key in order to verify contracts
# If you get an ABI error, clean the artifacts and cache folder and compile again

OBAKE_URI="https://gateway.pinata.cloud/ipfs/QmXDt5rtJRwbyUFKY92hakskhUPcEdQWxeS1Mc7Gi5kiLg"

# Need to update those addresses everytime we deploy the smart contracts (with main_deploy.js)
MINT_OBAKE_ADDRESS="0x126A7fb74074fC05A4ed9827EeB2986F5eAe7D9D"
STAKING_ADDRESS="0x9103BC0194E4ABe24FeAE5E95DD88Fe37e3df8aa"
RANDOM_ADDRESS="0x603138aa93DAa0145CC51796105F5e0C89616900"
FUNDS_MANAGER_ADDRESS="0x4d1650888F2EC0b912F932e81Af6cEfA81E48628"
COINFLIP_ADDRESS="0xb4BAa1bc4c8ccA25904DbeA074c0aCdFfdB83987"
RAFFLE_ADDRESS="0x889e83B84412B58a3B3957768287B38D7B8974d0"


echo ""
echo "1) Verifying Mint Obake smart contract"
npx hardhat verify ${MINT_OBAKE_ADDRESS} ${OBAKE_URI}

echo ""
echo "2) Verifying Staking smart contract"
npx hardhat verify ${STAKING_ADDRESS} ${MINT_OBAKE_ADDRESS}


echo ""
echo "3) Verifying Random smart contract"
npx hardhat verify ${RANDOM_ADDRESS} 


echo ""
echo "4) Verifying Funds Manager smart contract"
npx hardhat verify ${FUNDS_MANAGER_ADDRESS} ${RANDOM_ADDRESS} ${STAKING_ADDRESS}


echo ""
echo "5) Verifying CoinFlip smart contract"
npx hardhat verify ${COINFLIP_ADDRESS} ${RANDOM_ADDRESS} ${FUNDS_MANAGER_ADDRESS}


echo ""
echo "6) Verifying Raffle smart contract"
npx hardhat verify ${RAFFLE_ADDRESS} ${RANDOM_ADDRESS} ${FUNDS_MANAGER_ADDRESS}
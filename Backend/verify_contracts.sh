# Utils script to verify contracts on FTMScan
# Note that you need to have a FTMScan API key in order to verify contracts
# If you get an ABI error, clean the artifacts and cache folder and compile again

OBAKE_URI="https://gateway.pinata.cloud/ipfs/QmXDt5rtJRwbyUFKY92hakskhUPcEdQWxeS1Mc7Gi5kiLg"

# Need to update those addresses everytime we deploy the smart contracts (with main_deploy.js)
MINT_OBAKE_ADDRESS="0x54676ee3a10F0C6F0632315F5200a7D3C1FCdb04"
STAKING_ADDRESS="0x0Df82C074212A53E89715477f2592CAaeA94a9c8"
RANDOM_ADDRESS="0xBa88e014Da5c30c439352D03a199801deED3cC5e"
FUNDS_MANAGER_ADDRESS="0x0E4ff4563399919E9dDA3E2c8969db5d26936d0A"
COINFLIP_ADDRESS="0x3386cedD128c04C615F30EbCbF839481aE7dC085"
RAFFLE_ADDRESS="0xf649A00A3Bf97B9b1E275cC1a1F2614C514e9fEF"


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
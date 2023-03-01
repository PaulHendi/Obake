# Utils script to verify contracts on FTMScan
# Note that you need to have a FTMScan API key in order to verify contracts
# If you get an ABI error, clean the artifacts and cache folder and compile again

OBAKE_URI="https://gateway.pinata.cloud/ipfs/QmXDt5rtJRwbyUFKY92hakskhUPcEdQWxeS1Mc7Gi5kiLg"

# Need to update those addresses everytime we deploy the smart contracts (with main_deploy.js)
MINT_OBAKE_ADDRESS=0x975C87aAabb4dc42336b3E7bb9f1Bd922a7b7CeC
STAKING_ADDRESS=0xC26d81929ABC1E74bF39bcA1D0EC7001628e273E
RANDOM_ADDRESS=0xF87133647aC1748D0e439de5C18eeeF99163e0fe
FUNDS_MANAGER_ADDRESS=0xa81Caa87B38aD4585EF9F3F1f5D2d27fCE9F824E
COINFLIP_ADDRESS=0xc40b2CA628e3a1CACCe531F1927246CE27bc59B0
RAFFLE_ADDRESS=0xe1eff0832aDac5910B110DDD5E4B9C4FB9b21A47


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
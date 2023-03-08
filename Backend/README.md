# Obake Backend

## Smart contracts

There are 6 SCs in Obake : 

- MintObake : Mint an Obake NFT
- Staking : Stake an Obake NFT to get revenues from the games
- Random : This SC is interacting with Chainlink in order to get a non predictable random number for the games
- Raffle : An NFT raffle, user can sell their NFT, selling tickets, or buy tickets hoping to get an NFT cheaper than the market price
- CoinFlip : Heads or tails ? This simple game can make you double your bet
- FundsManager : This SC handles the fees collected from the games, and use them to buy LINK tokens and to fund the staking contract


## Deployement and set up

In order to deploy and set up the contracts you can run the script "main_deploy" : 

```npx hardhat run scripts/main_deploy.js```

Basically the deployment goes like this : 

1. Deploy MintObake with the [URI](https://gateway.pinata.cloud/ipfs/QmXDt5rtJRwbyUFKY92hakskhUPcEdQWxeS1Mc7Gi5kiLg) of the NFT 
2. Deploy the Staking contract with the MintObake's address
3. Deploy the Random contract
4. Deploy the FundsManager contract with the Random and Staking contracts addresses
5. Deploy the CoinFlip contract with the Random and FundsManager contracts addresses
6. Deploy the Raffle contract with the Random and FundsManager contracts addresses

Then the set up goes like this : 

1. Set CoinFlip and Raffle addresses in Random
2. Set CoinFlip and Raffle addresses in FundsManager
3. Set Funds manager address in Staking
4. Send some FTM to the CoinFlip contract(to have initial funds)
5. Send some LINK to Random
6. Unpause MintObake contract (just before the mint)


## Verifying contracts 

Contracts can be verified on FTMScan (testnet) using the ```verify_contracts.sh``` script. This is particularly useful knowing that there are many contracts.


## Testing

Several tests were performed, unit and integration tests. All the script to deploy, and perform simple interactions are in the scripts folder.
And the tests are in the test folder.

Note that you'll need NFT faucet on Fantom testnet (ERC721) in order to test the raffle.

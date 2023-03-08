# Obake Frontend

## Necessary dependencies

The Frontend is using : 

- useDapp for wallet connection, transactions, almost every Web3.0 related features
- Covalent for querying NFT balance of an address (Moralis only has an NFT API for Fantom Mainnet)
- Styled components for CSS
- React framework
- React-router-dom for the navbar
- Vitejs to get a quick React template

## Run the app

To run it, first install the libraries : 

`npm install`

Then start the server : 

`npm run dev`


If you just updated the contract, don't forget to update the ABIs and set the correct addresses in the env.js file

## Todo 

Many things, but basically : 

- Force the user to set up the right network
- Better UI globally 
- Correct some bugs 
- Before launching on the mainnet, use Moralis NFT API to scan the wallet

## Futur improvements 

We could add many dApps to improve the experience : 

- English auction
- A roulette
- A lending platform
- A peer-to-peer NFT marketplace

All those dApps could generate revenues and distribute them to holders.
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

## Todo 

Many things, but basically : 

- Handle the wallet connection by spreading the address everywhere it's needed. But also force the user to set up the right network
- Add the staking ABI and finish the page
- Maybe do a better UI for the CoinFlip page, with an animation for example. Recode the didWin component
- Finish scanning the wallet, and get the address and ID of the NFT selected, in order to prepare a tx
- Code a second page in the raffle page, to see current raffles
- Finish the UI
- Maybe launch the website in prod with Heroku, so that people can test the dApp

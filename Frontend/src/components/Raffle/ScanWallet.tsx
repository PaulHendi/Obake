import React from "react";
import  axios  from "axios";

import {ScanWalletContainer, ImageContainer, StartLotteryContainer, NewLotteryContainer} from "../../styles/ScanWallet.style";
import { useEthers } from "@usedapp/core";
import {JoinRaffleContainer, NavbarRaffleLink} from "../../styles/Raffle.style";

export default function ScanWallet() {
  const {account} = useEthers()
  const [nft_selected, setNFTSelected] = React.useState("");


  const [nft, setNFT] = React.useState<{[fieldName: string]: string}> ({});


  React.useEffect(() => {

    if (account == undefined) {
      return;
    }
    console.log(account);


    let url = `https://api.covalenthq.com/v1/4002/address/${account}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_96a32bab72724e39a3e5011afe2`;


    axios.get(url).then(response => {
      let nft_url : any = {}
      for (let i = 0;i<response.data.data.items.length;i++){
          if (response.data.data.items[i].type == "nft"){
              for (let j=0; j<response.data.data.items[i].nft_data.length;j++) {
                // Replace https://ipfs.io by https://gateway.pinata.cloud/ to get the image quicker
                let image_url : string = response.data.data.items[i].nft_data[j].external_data.image.replace("https://ipfs.io", "https://gateway.pinata.cloud");
                let nft_name : string = response.data.data.items[i].nft_data[j].external_data.name;
                let nft_description : string = response.data.data.items[i].contract_address.slice(0, 6) ;
                nft_url[nft_name + "_" + nft_description] =  image_url;
              }
          }
      }
      setNFT(nft_url);
    })
   
    }, []);

 

  const sendTransaction = () => {
    console.log("Send transaction");
  }


  const StartNewLottery = () => {
    console.log("Start new lottery");
    // Get NFT info

    return (
      <StartLotteryContainer>
        <img src={nft_selected}/>
        <input type="number" placeholder="Price of a ticket" className='ticket_price' />
        <input type="number" placeholder="Number of tickets" className='ticket_amount' />
        <button onClick={() => {sendTransaction()}}>Start a new lottery</button>
        <button onClick={() => {setNFTSelected("")}}>Cancel</button>
      </StartLotteryContainer>
    )
  }



  

  return (
   
    <NewLotteryContainer>
      
      {!account && (<h1>Connect your wallet</h1>)}
      {account && !nft_selected && (<h1>Select an NFT</h1>)}
      {account && nft_selected && (<h1>Set ticket price and quantity</h1>)}

      <ScanWalletContainer>

        {account && !nft_selected && Object.keys(nft).map((key) => {
                                          return ( <ImageContainer onClick={() => {setNFTSelected(nft[key])}}>  
                                                      <img src={nft[key]} key={key}/>
                                                      <h2>{key.split("_")[0]}</h2> 
                                                  </ImageContainer>)})}
                  
        {account && nft_selected && <StartNewLottery/>}

      </ScanWalletContainer>
    </NewLotteryContainer>
  );
}
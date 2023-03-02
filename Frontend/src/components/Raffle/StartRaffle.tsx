import React from "react";
import {useState} from 'react';
import  axios  from "axios";
import { MetaMaskInpageProvider } from "@metamask/providers";

import {ScanWalletContainer, ImageContainer, StartLotteryContainer, NewLotteryContainer} from "../../styles/ScanWallet.style";
import { useCall, useEthers } from "@usedapp/core";
import Raffle from '../../abi/Raffle.json'
import ERC721 from '../../abi/ERC721.json'
import { utils, ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, transactionErrored } from "@usedapp/core";
import { StatusAnimation } from '../TransactionAnimation'
import GetTxInfo  from '../GetTxInfo'

import {RAFFLE_ADDRESS, PROVIDER_URL} from "../../env";



declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

export default function StartRaffle() {
  
  const {account} = useEthers()

  const RaffleInterface = new utils.Interface(Raffle.abi)
  const provider = new ethers.providers.Web3Provider(window.ethereum)//(PROVIDER_URL)
  

  const RaffleContract = new Contract(RAFFLE_ADDRESS, RaffleInterface) 

  const { state : state_start_raffle, send :start_raffle } = useContractFunction(RaffleContract, 'start_new_raffle', { transactionName: 'start_new_raffle' })

  const [nft_selected, setNFTSelected] = React.useState("");
  const [contract_approved, setContractApproved] = React.useState(false);

  const [nftInfo, setNFTInfo] = useState({loading: true, nft: {}});


  React.useEffect(() => { 
 
    if (account == undefined) {
      return;
    }
    console.log(account);


    let url = `https://api.covalenthq.com/v1/4002/address/${account}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_96a32bab72724e39a3e5011afe2`;


    axios.get(url).then(response => {
      let nft_url : any = {}
      let response_data = response.data.data.items;

      for (let i = 0;i<response_data.length;i++){

        if (response_data[i].type == "nft" && response_data[i].supports_erc[1] == "erc721"){

          for (let j=0; j<response_data[i].nft_data.length;j++) {

            // Replace https://ipfs.io by https://gateway.pinata.cloud/ to get the image quicker
            let image_url : string = response_data[i].nft_data[j].external_data.image.replace("https://ipfs.io", "https://gateway.pinata.cloud");
            let nft_name : string = response_data[i].nft_data[j].external_data.name;
            let nft_sc : string = response_data[i].contract_address;
            let nft_id : string = response_data[i].nft_data[j].token_id;
            nft_url[nft_name+ "_" + nft_sc.slice(0,6)] = {"url" : image_url, "sc_contract" : nft_sc, "id" : nft_id}
          }
              
        }
      }

      setNFTInfo({loading : false, nft : nft_url});
    })
   
  }, [account]); 
  // Need to recall the useEffect when account list NFT (useState with a new state that checks if a new raflle has been created)


  const { loading, nft } = nftInfo;


  const startRaffleTx = (contract_address : string, 
                           nft_id :string, 
                           ticket_amount: number, 
                           ticket_price: number) => {


    void start_raffle(contract_address, nft_id, utils.parseEther(ticket_price.toString()), ticket_amount, {gasLimit: 2500000});
  }


  const approveContract = (contract : Contract, id: number) => {
    // This workaround works but there's no state hence no transactionAnimation
    // And there's no error handling 
    // Idea : Define 'Success' if the transaction is mined and 'Error' if it fails
    contract.connect(provider.getSigner(account)).approve(RAFFLE_ADDRESS, id).then((response : any) => {
                console.log(response)
              }).catch((error : any) => {
                console.log(error);
              });

  }

  // TODO : Pb when creating a lottery, the query getAproved is set to false, hence approve button appears

  const StartNewLottery = () => {

    const NFTContractAddress = nft_selected["sc_contract"]
    const NFTInterface = new utils.Interface(ERC721.abi)
    const NFTContract = new Contract(NFTContractAddress, NFTInterface, provider)
    

    // Check if user approved the contract to transfer the NFT
    let reponse = useCall({contract : NFTContract, 
             method : 'getApproved', 
             args :[nft_selected["id"]]})
    

    if(reponse?.value?.toString() !== RAFFLE_ADDRESS) {
      
      return (
        <StartLotteryContainer>
          <img src={nft_selected["url"]}/>
          <button onClick={() => {approveContract(NFTContract, nft_selected["id"])}}>Approve</button>
          <button onClick={() => {setNFTSelected("")}}>Cancel</button>
        </StartLotteryContainer>
      )
    }

    else {
      console.log("Start new lottery");
      // Get NFT info
      setContractApproved(true);
      console.log(nft_selected);
      return (
        <StartLotteryContainer>
          
            <img src={nft_selected["url"]}/>
            <input type="number" placeholder="Price of a ticket" className='ticket_price' />
            <input type="number" placeholder="Number of tickets" className='ticket_amount' />
            <button onClick={() => {startRaffleTx(
                                              nft_selected["sc_contract"],
                                              nft_selected["id"],
                                              document.getElementsByClassName('ticket_amount')[0].value,
                                              document.getElementsByClassName('ticket_price')[0].value
                                    )}}>Start a new lottery</button>
            <button onClick={() => {setNFTSelected(""); setContractApproved(false);}}>Cancel</button>
          
        </StartLotteryContainer>
      )
    }
  }



  

  return (
   
    <NewLotteryContainer>
      
      {!account && (<h1>Connect your wallet</h1>)}
      {account && !nft_selected && (<h1>Select an NFT</h1>)}
      {account && nft_selected && !contract_approved && (<h1>Approve the contract first</h1>)}
      {account && nft_selected && contract_approved && (<h1>Set ticket price and quantity</h1>)}

      <ScanWalletContainer>
      {loading ? account ? <p>Loading...</p> : <p></p> : Object.keys(nft).length === 0 ? <p>No NFT found</p> : 
      account && !nft_selected && Object.keys(nft).map((key) => {
                                          return ( <ImageContainer onClick={() => {setNFTSelected(nft[key])}}>  
                                                      <img src={nft[key]["url"]} />
                                                      <h2>{key}</h2> 
                                                  </ImageContainer>)})}
                  
        {account && nft_selected && <StartNewLottery/>}

        <StatusAnimation transaction={state_start_raffle} />
        {state_start_raffle.status === 'Success' && <GetTxInfo/>}
       

      </ScanWalletContainer>
    </NewLotteryContainer>
  );
}


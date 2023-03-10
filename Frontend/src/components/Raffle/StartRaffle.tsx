import React from "react";
import {useState} from 'react';
import  axios  from "axios";
import { MetaMaskInpageProvider } from "@metamask/providers";

import {ScanWalletContainer, 
        ImageContainer, 
        StartLotteryContainer, 
        NewLotteryContainer, 
        RaffleCreatedContainer,
        ApproveContainer} from "../../styles/ScanWallet.style";

import { useCall, useEthers } from "@usedapp/core";
import Raffle from '../../abi/Raffle.json'
import ERC721 from '../../abi/ERC721.json'
import { utils, ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from "@usedapp/core";
import { StatusAnimation } from '../TransactionAnimation'
import GetTxInfo  from '../GetTxInfo'

import {RAFFLE_ADDRESS} from "../../env";
import { NavLink } from "react-router-dom";



declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

export default function StartRaffle() {
  

  // Raffle contract
  const RaffleInterface = new utils.Interface(Raffle.abi)
  const RaffleContract = new Contract(RAFFLE_ADDRESS, RaffleInterface) 

  // Define the provider (Used for the approve transaction, that is made without the useContractFunction)
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  // Get the account from useEthers
  const {account} = useEthers()

  // Start raffle tx
  const { state : state_start_raffle, send :start_raffle } = useContractFunction(RaffleContract, 'start_new_raffle', { transactionName: 'start_new_raffle' })

  // States : NFT selected, contract approved, raffle started, NFT info
  const [nft_selected, setNFTSelected] = React.useState("");
  const [contract_approved, setContractApproved] = React.useState(false);
  const [raffle_started, setRaffleStarted] = React.useState(false);
  const [nftInfo, setNFTInfo] = useState({loading: true, nft: {}});


  // Get the list of NFT of the connected wallet
  React.useEffect(() => { 
 
    // If no account is connected, return
    if (account == undefined) {
      return;
    }

    // Get the list of NFT in the wallet of the account (using Covalent API)
    let url = `https://api.covalenthq.com/v1/4002/address/${account}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_96a32bab72724e39a3e5011afe2`;


    
    axios.get(url).then(response => {

      let nft_url : any = {}
      let response_data = response.data.data.items;

      for (let i = 0;i<response_data.length;i++){

        if (response_data[i].type == "nft" && response_data[i].supports_erc[1] == "erc721"){

          for (let j=0; j<response_data[i].nft_data.length;j++) {

            // Replace https://ipfs.io by https://gateway.pinata.cloud/ to get the image quicker
            // Note : this is a workaround, the image should be fetched directly from the contract
            // This needs to be change when launching the app
            let image_url : string = response_data[i].nft_data[j].external_data.image.replace("https://ipfs.io", "https://gateway.pinata.cloud");
            let nft_name : string = response_data[i].nft_data[j].external_data.name;
            let nft_sc : string = response_data[i].contract_address;
            let nft_id : string = response_data[i].nft_data[j].token_id;
            nft_url[nft_name] = {"url" : image_url, "sc_contract" : nft_sc, "id" : nft_id}
          }
              
        }
      }

      setNFTInfo({loading : false, nft : nft_url});
    })
   
  }, [account, raffle_started]); 
  

  const { loading, nft } = nftInfo;


  // Start a new raffle transaction
  const startRaffleTx = (contract_address : string, 
                           nft_id :string, 
                           ticket_amount: number, 
                           ticket_price: number) => {

    // Send the transaction
    void start_raffle(contract_address, nft_id, utils.parseEther(ticket_price.toString()), ticket_amount, {gasLimit: 2500000});
    setRaffleStarted(true);
  }


  // Approve the contract to transfer the NFT
  const approveContract = (contract : Contract, id: number) => {

    // This workaround works but there's no state hence no transactionAnimation
    contract.connect(provider.getSigner(account)).approve(RAFFLE_ADDRESS, id).then((response : any) => {
                console.log(response)
              }).catch((error : any) => {
                console.log(error);
              });

  }

  // This component handles the creation of a new raffle (approving the contract, starting the raffle)
  const StartNewLottery = () => {

    // Create a new instance of an ERC721 contract (with given address)
    const NFTContractAddress = nft_selected["sc_contract"]
    const NFTInterface = new utils.Interface(ERC721.abi)
    const NFTContract = new Contract(NFTContractAddress, NFTInterface, provider)
    

    // Check if user approved the contract to transfer the NFT
    let reponse = useCall({contract : NFTContract, 
             method : 'getApproved', 
             args :[nft_selected["id"]]})
    

    // If the contract is not approved, display the approve button
    if(reponse?.value?.toString() !== RAFFLE_ADDRESS && !raffle_started) {
      
      return (
        <ApproveContainer>
          <img src={nft_selected["url"]}/>
          <button onClick={() => {approveContract(NFTContract, nft_selected["id"])}}>Approve</button>
          <button onClick={() => {setNFTSelected("")}}>Cancel</button>
        </ApproveContainer>
      )
    }

    // If the contract is approved, display the start raffle button
    else {
      setContractApproved(true);

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


  // This component is displayed when a raffle is created
  const RaffleCreated = () => {

    return (
      <RaffleCreatedContainer>
        <img src={nft_selected["url"]} width="30%"/>
        <br/>
        <NavLink to="/raffle">Go to the raffle page</NavLink> 
        <br/>       
        <GetTxInfo/>
      </RaffleCreatedContainer>
    )
  }


  

  return (
   
    <NewLotteryContainer>
      
      {!account && (<h1>Connect your wallet</h1>)}
      {account && !nft_selected && (<h1>Select an NFT</h1>)}
      {account && nft_selected && !contract_approved && state_start_raffle.status !== 'Success' && (<h1>Approve the contract first</h1>)}
      {account && nft_selected && contract_approved && state_start_raffle.status !== 'Success' && (<h1>Set ticket price and quantity</h1>)}
      {account && state_start_raffle.status === 'Success' && (<h1>Congrats for your new raffle !</h1>)}

      <ScanWalletContainer>

      {loading ? 
          account ? <p>Loading...</p> : <></> 
          : Object.keys(nft).length === 0 ? <p>No NFT found in wallet</p> : 
            account && !nft_selected && Object.keys(nft).map((key, i) => {
                                          return ( <ImageContainer onClick={() => {setNFTSelected(nft[key])}} key={i}>  
                                                      <img src={nft[key]["url"]} key={i} />
                                                      <h2>{key}</h2> 
                                                  </ImageContainer>)})}
                  
        
      
      </ScanWalletContainer>
      {account && nft_selected && state_start_raffle.status !== 'Success' && <StartNewLottery/>}



      {account && nft_selected && state_start_raffle.status === 'Success' && <RaffleCreated/>}
      {account && nft_selected && state_start_raffle.status !== 'PendingSignature' && <StatusAnimation transaction={state_start_raffle} /> }

      
    </NewLotteryContainer>
  );
}


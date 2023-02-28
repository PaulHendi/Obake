import React from "react";
import  axios  from "axios";

import {ScanWalletContainer, ImageContainer, StartLotteryContainer, NewLotteryContainer} from "../../styles/ScanWallet.style";
import { useCall, useEthers } from "@usedapp/core";
import {JoinRaffleContainer, NavbarRaffleLink} from "../../styles/Raffle.style";
import Raffle from '../../abi/Raffle.json'
import ERC721 from '../../abi/ERC721.json'
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useTransactions, transactionErrored } from "@usedapp/core";
import { StatusAnimation } from '../TransactionAnimation'

import {RAFFLE_ADDRESS} from "../../env";



export default function ScanWallet() {
  const { transactions } = useTransactions()
  const {account} = useEthers()

  const RaffleInterface = new utils.Interface(Raffle.abi)
  const RaffleContract = new Contract(RAFFLE_ADDRESS, RaffleInterface) 

  const { state, send } = useContractFunction(RaffleContract, 'start_new_raffle', { transactionName: 'start_new_raffle' })
  const state_start_raffle = state;
  const start_raffle = send ;




  const [nft_selected, setNFTSelected] = React.useState("");
  const [contract_approved, setContractApproved] = React.useState(false);

  const [nft, setNFT] = React.useState<{[fieldName: string]: string}> ({});

  //address_raffle = "0xe1eff0832aDac5910B110DDD5E4B9C4FB9b21A47"

  React.useEffect(() => {  // Don't trust this, because it updates only when page reloads
 
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
                if (response.data.data.items[i].nft_data[0].supports_erc[1] == "erc1155")  continue;
                
                // Replace https://ipfs.io by https://gateway.pinata.cloud/ to get the image quicker
                let image_url : string = response.data.data.items[i].nft_data[j].external_data.image.replace("https://ipfs.io", "https://gateway.pinata.cloud");
                let nft_name : string = response.data.data.items[i].nft_data[j].external_data.name;
                let nft_sc : string = response.data.data.items[i].contract_address;
                let nft_id : string = response.data.data.items[i].nft_data[j].token_id;
                //nft_url[nft_name + "_" + nft_description] =  image_url;
                nft_url[nft_name+ "_" + nft_sc.slice(0,6)] = {"url" : image_url, "sc_contract" : nft_sc, "id" : nft_id}
              }
          }
      }
      setNFT(nft_url);
    })
   
    }, []);

    const GetTx = () => {

      let tx = transactions[0].receipt?.transactionHash;
      let tx_link = "https://testnet.ftmscan.com/tx/" + tx;

      // Get first six and last four characters of the hash
      let tx_hash = tx?.slice(0, 6) + "..." + tx?.slice(-4);

      return (  <a href={tx_link} target="_blank">{tx_hash}</a> )
       
    }

  const startRaffleTx = (contract_address : string, 
                           nft_id :string, 
                           ticket_amount: number, 
                           ticket_price: number) => {


    void start_raffle(contract_address, nft_id, utils.parseEther(ticket_price.toString()), ticket_amount, {gasLimit: 2500000});
  }


  const approveContract = (contract : Contract, id: number) => {
    const { state, send } = useContractFunction(contract, 'approve', { transactionName: 'approve' })
    void send(RAFFLE_ADDRESS, id);
  }



  const StartNewLottery = () => {

    const NFTContractAddress = nft_selected["sc_contract"]
    const NFTInterface = new utils.Interface(ERC721.abi)
    const NFTContract = NFTContractAddress && (new Contract(NFTContractAddress, NFTInterface) )

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
          <button onClick={() => {setNFTSelected("")}}>Cancel</button>
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

        {account && !nft_selected && Object.keys(nft).map((key) => {
                                          return ( <ImageContainer onClick={() => {setNFTSelected(nft[key])}}>  
                                                      <img src={nft[key]["url"]} />
                                                      <h2>{key}</h2> 
                                                  </ImageContainer>)})}
                  
        {account && nft_selected && <StartNewLottery/>}

        <StatusAnimation transaction={state_start_raffle} />
        {state_start_raffle.status === 'Success' && transactions.length !== 0 && <GetTx/>}

      </ScanWalletContainer>
    </NewLotteryContainer>
  );
}

//key={key}/>
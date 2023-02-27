import React from "react";
import {JoinRaffleContainer, NavbarRaffleLink} from "../../styles/Raffle.style";
import Raffle from '../../abi/Raffle.json'
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import {useCall} from '@usedapp/core'


export default function RaffleMain() {
    const MintNFTContractAddress = "0xe1eff0832aDac5910B110DDD5E4B9C4FB9b21A47" 
    const MintNFTInterface = new utils.Interface(Raffle.abi)
    const contract = MintNFTContractAddress && (new Contract(MintNFTContractAddress, MintNFTInterface) )


    const GetCurrentRaffle = () => {

        const current_raffle_id =
        useCall( {
            contract: contract, // instance of called contract
            method: "raffleId", // Method to be called
            args: [], // Method arguments - address to be checked for balance
            }
        ) ?? {};      


        const current_raffle = 
        useCall( {
            contract: contract, // instance of called contract
            method: "lotteries", // Method to be called
            args: [current_raffle_id?.value?.toString()-1], // Method arguments - address to be checked for balance
            }
        ) ?? {};

        console.log(current_raffle_id?.value?.toString()-1)


        let nft_id, nft_contract, owner, ticket_price, ticket_amount;
        if ("value" in current_raffle) {
            let value = current_raffle["value"]
            nft_id = value["NFTid"]?.toString()
            nft_contract = value["NFTcontract"].toString()
            owner = value["owner"].toString()
            ticket_price = utils.formatEther(value["ticket_price"].toString());
            ticket_amount = value["ticket_amount"].toString()
        }
        
  
        return ( 
          <p>
            Current lotteries: {current_raffle_id?.value?.toString()}
            <br/>
            NFT id: {nft_id}
            <br/>
            NFT contract: {nft_contract}
            <br/>
            Owner: {owner}
            <br/>
            Ticket price: {ticket_price}
            <br/>
            Ticket amount: {ticket_amount}
          </p>
          )
      }

    return (
        <JoinRaffleContainer>
            <h1>Join a raffle</h1>
            <GetCurrentRaffle/>
            <NavbarRaffleLink to="/raffle/start_new_raffle">Start a new raffle</NavbarRaffleLink>
        </JoinRaffleContainer>
    );

}
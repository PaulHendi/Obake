import  axios  from "axios";
import { useState, useEffect } from "react";
import {JoinRaffleContainer, NavbarRaffleLink} from "../../styles/Raffle.style";
import Raffle from '../../abi/Raffle.json'
import NFT from '../../abi/ERC721.json'
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import {useCall} from '@usedapp/core'
import { ImageContainer } from "../../styles/ScanWallet.style";
import {RAFFLE_ADDRESS} from "../../env";

export default function RaffleMain() {

    const RaffleInterface = new utils.Interface(Raffle.abi)
    const RaffleContract = new Contract(RAFFLE_ADDRESS, RaffleInterface)
    const [post, setPost] = useState(null);
    const [currentRaffle, setCurrentRaffle] = useState("");




    const GetCurrentRaffle = () => {



        const current_raffle_id =
        useCall( {
            contract: RaffleContract, // instance of called contract
            method: "raffleId", // Method to be called
            args: [], // Method arguments - address to be checked for balance
            }
        ) ?? {};      
    
    
        const current_raffle = 
        useCall( {
            contract: RaffleContract, // instance of called contract
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

            // Get the beginning of the NFT contract address
            owner = value["owner"].toString().substring(0, 6) + "..." + value["owner"].toString().substring(38, 42)
            ticket_price = utils.formatEther(value["ticket_price"].toString());
            ticket_amount = value["ticket_amount"].toString()
    
            setCurrentRaffle(ticket_price);
        }

        // Get NFT metadata
        const MintNFTContractAddress = nft_contract 
        const MintNFTInterface = new utils.Interface(NFT.abi)
        const NFTContract = MintNFTContractAddress && (new Contract(MintNFTContractAddress, MintNFTInterface) )


        let response = useCall( MintNFTContractAddress && {contract : NFTContract, 
                                method: "tokenURI", 
                                args: [nft_id]} );

        axios.get(response?.value).then((res) => {setPost(res.data.image)});                                
    
        

        return (  
          <p>
            Current lotteries: {current_raffle_id?.value?.toString()}
            <br/>
            {post && <img src={post}/>}
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
import  axios  from "axios";
import { useState, useEffect } from "react";
import {JoinRaffleContainer, 
        NavbarRaffleLink, 
        ImageContainer,
        Input,
        InputRow,
        SmallButton} from "../../styles/Raffle.style";
import Raffle from '../../abi/Raffle.json'
import NFT from '../../abi/ERC721.json'
import { utils, ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import {useCall, useContractFunction, useEthers} from '@usedapp/core'
import {RAFFLE_ADDRESS, PROVIDER_URL} from "../../env";
import { StatusAnimation } from '../TransactionAnimation'
import GetTxInfo  from '../GetTxInfo'

interface LotteryInputProps {
    Owner : string;
    isOwner: boolean;
    ticketPrice: number;
}


export default function JoinRaffle() {

    // TODO : Correct bug useEffect doesn't show everything
    // and sometimes bug with is_owner

    const RaffleInterface = new utils.Interface(Raffle.abi)
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const RaffleContract = new Contract(RAFFLE_ADDRESS, RaffleInterface, provider)
    const { account } = useEthers();
    const { state : state_enter, send : enterTx } = useContractFunction(RaffleContract, 'enter', { transactionName: 'enter' })
    const { state : state_endRaffle, send : endRaffleTx } = useContractFunction(RaffleContract, 'end_raffle', { transactionName: 'end_raffle' })

    const [currentRaffle, setCurrentRaffle] = useState({loading: true,
                                                        existsRaffle: false,
                                                        raffles : [{}]});
    




    useEffect(() => {

        let _raffles = [{}];
        RaffleContract.get_current_raffles().then((raffles : Array<any>) => {
            let raffles_length = raffles.length;
            if (raffles_length == 0) {
                setCurrentRaffle({...currentRaffle, loading : false, existsRaffle: false});
                return;
            }
            
            raffles.map((raffle : any, i) => {



                let nft_id : number = parseInt(raffle.NFTid?.toString())
                let nft_contract : string = raffle.NFTcontract?.toString()
                let owner : string = raffle.owner?.toString()
                let ticket_price : number = Number(utils.formatEther(raffle.ticket_price?.toString()));
                let ticket_amount : number = raffle.ticket_amount?.toString()
                let ticket_sold : number = raffle.ticket_sold?.toString()
                let is_owner = (account?.toString() === raffle.owner?.toString())

                // Get NFT metadata
                const MintNFTContractAddress = nft_contract 
                const MintNFTInterface = new utils.Interface(NFT.abi)
                const NFTContract = new Contract(MintNFTContractAddress, MintNFTInterface, provider) 


                NFTContract.tokenURI(nft_id).then((response : string) => {

                    axios.get(response).then((res) => {
                        
                        _raffles = [..._raffles,{owner: owner,
                            is_owner: is_owner,
                            ticket_price: ticket_price,
                            ticket_amount: ticket_amount,
                            ticket_sold: ticket_sold,
                            nft_url: res.data.image}]

                        if (i == raffles_length-1) setCurrentRaffle({loading : false, existsRaffle: true, raffles: _raffles })
                        
                    });                                
                });

            })
        })

    }, [account, state_endRaffle.status=== "Success"]);        
    
    
    const { loading , existsRaffle, raffles } = currentRaffle;
    console.log(currentRaffle)

    const buyTickets = async (raffle_owner : string, ticket_price : number) => { 
        let ticket_amount : number = document.getElementsByClassName("number_of_tickets")[0]?.value;
        RaffleContract.ownerRaffleId(raffle_owner).then((raffle_id : number) => {
            void enterTx(raffle_id, ticket_amount, {value: utils.parseEther((ticket_price*ticket_amount).toString())})
        })
    }

    const endRaffle = async (raffle_owner : string) => {
        RaffleContract.ownerRaffleId(raffle_owner).then((raffle_id : number) => {
            console.log(raffle_id)
            void endRaffleTx(raffle_id)
        })
        
    }


    const LotteryInput = ({Owner, isOwner, ticketPrice} : LotteryInputProps) => {
    
        if (isOwner) { 
            return(
                    <InputRow>
                        <SmallButton onClick={() => endRaffle(Owner)}>End Raffle</SmallButton>
                    </InputRow>)
        }
        else {
            return (
                <InputRow>
                <Input type="number" placeholder="ticket to buy" className='number_of_tickets' />
                    <SmallButton onClick={() => buyTickets(Owner, ticketPrice)} disabled={!account}>Buy ticket</SmallButton>
                </InputRow>)
        }

    }

    return (
        <JoinRaffleContainer>
            <h1>Join a raffle</h1>
            

            {loading? <p>Loading...</p> : 
              existsRaffle ? raffles.map((raffle : any, i) => { 
                return ( i>0 &&
                    <ImageContainer key={i}>
                        <img src={raffle["nft_url"]}/>
                        <p>Owner: {raffle["owner"].substring(0, 6) + "..." + raffle.owner?.toString().substring(38, 42)}</p>
                        <p>Ticket price: {raffle["ticket_price"]}</p>
                        <p>Tickets left: {raffle["ticket_amount"]-raffle["ticket_sold"]}/{raffle["ticket_amount"]}</p>
                        <LotteryInput Owner = {raffle["owner"]} isOwner={raffle["is_owner"]} ticketPrice = {raffle["ticket_price"]}/>
   
                    </ImageContainer> )}) : <p>No raffle available at the moment</p>}
            

            {state_enter.status !== 'None' && <StatusAnimation transaction={state_enter} />}
            {state_endRaffle.status !== 'None' && <StatusAnimation transaction={(state_endRaffle)}/>}
            {(state_enter.status === 'Success' ||
            state_endRaffle.status === 'Success') && <GetTxInfo/>}

        </JoinRaffleContainer>
    );

}
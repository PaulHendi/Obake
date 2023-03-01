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
import { loadConfigFromFile } from "vite";




export default function JoinRaffle() {

    // TODO : if User is owner of the raffle => show a button to end the raffle 

    const RaffleInterface = new utils.Interface(Raffle.abi)
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const RaffleContract = new Contract(RAFFLE_ADDRESS, RaffleInterface, provider)
    const { account } = useEthers();
    const { state : state_enter, send : enterTx } = useContractFunction(RaffleContract, 'enter', { transactionName: 'enter' })


    const [currentRaffle, setCurrentRaffle] = useState({
                                                            loading: true,
                                                            raffle_id: 0,
                                                            owner: "",
                                                            ticket_price: 0,
                                                            ticket_amount: 0,
                                                            ticket_sold: 0,
                                                            nft_url: ""
                                                        });




    useEffect(() => {

        RaffleContract.raffleId().then((raffle_id : ethers.BigNumber) => {
            let raffleId : number = parseInt(raffle_id.toString())-1
            RaffleContract.lotteries(raffleId).then((current_raffle : any) => {

                let nft_id : number = parseInt(current_raffle.NFTid?.toString())
                let nft_contract : string = current_raffle.NFTcontract?.toString()
                let owner : string = current_raffle.owner?.toString().substring(0, 6) + "..." + current_raffle.owner?.toString().substring(38, 42)
                let ticket_price : number = parseInt(utils.formatEther(current_raffle.ticket_price?.toString()));
                let ticket_amount : number = current_raffle.ticket_amount?.toString()
                let ticket_sold : number = current_raffle.ticket_sold?.toString()
        
                

                // Get NFT metadata
                const MintNFTContractAddress = nft_contract 
                const MintNFTInterface = new utils.Interface(NFT.abi)
                const NFTContract = new Contract(MintNFTContractAddress, MintNFTInterface, provider) 
                NFTContract.tokenURI(nft_id).then((response : string) => {

                    axios.get(response).then((res) => {

                        setCurrentRaffle(
                            {
                                loading: false,
                                raffle_id: raffleId,
                                owner: owner,
                                ticket_price: ticket_price,
                                ticket_amount: ticket_amount,
                                ticket_sold: ticket_sold,
                                nft_url: res.data.image
                            }
                        )});                                
                });


            })

        });
    }, [account]);        
    
    
    const { loading , raffle_id, owner, ticket_price, ticket_amount, ticket_sold, nft_url } = currentRaffle;



    const buyTickets = async (raffle_id : number, ticket_price : number) => { 
        let ticket_amount : number = document.getElementsByClassName("number_of_tickets")[0]?.value;

        void enterTx(raffle_id, ticket_amount, {value: utils.parseEther((ticket_price*ticket_amount).toString())})
    }


    return (
        <JoinRaffleContainer>
            <h1>Join a raffle</h1>
            

            {loading? <p>Loading...</p> : 
            <ImageContainer>
                <img src={nft_url}/>
                <p>Owner: {owner}</p>
                <p>Ticket price: {ticket_price}</p>
                <p>Tickets left: {ticket_amount-ticket_sold}/{ticket_amount}</p>
                <InputRow>
                    <Input type="number" placeholder="ticket to buy" className='number_of_tickets' />
                    <SmallButton onClick={() => buyTickets(raffle_id, ticket_price)}>Buy ticket</SmallButton>
                </InputRow>
            </ImageContainer>} 
            

            <NavbarRaffleLink to="/raffle/start_new_raffle">Start a new raffle</NavbarRaffleLink>
            {state_enter.status !== 'PendingSignature' && <StatusAnimation transaction={state_enter} />}
            {state_enter.status === 'Success' && <GetTxInfo/>}

        </JoinRaffleContainer>
    );

}
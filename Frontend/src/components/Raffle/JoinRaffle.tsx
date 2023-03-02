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
    const { state : state_endRaffle, send : endRaffleTx } = useContractFunction(RaffleContract, 'end_raffle', { transactionName: 'end_raffle' })
    
    const [currentRaffle, setCurrentRaffle] = useState({loading: true,
                                                        existsRaffle: false,
                                                        raffles : [{}]});




    useEffect(() => {

        if (!currentRaffle.loading) return;

        RaffleContract.get_current_raffles().then((raffles : Array<any>) => {
            let raffles_length = raffles.length;

            if (raffles_length == 0) {
                setCurrentRaffle({...currentRaffle, loading : false, existsRaffle: false});
                return;
            }
            
            raffles.map((raffle : any, i) => {
                console.log(i)
                console.log("Raffle len",raffles_length)

                if (i == raffles_length-1) currentRaffle.loading = false
                    

                let nft_id : number = parseInt(raffle.NFTid?.toString())
                let nft_contract : string = raffle.NFTcontract?.toString()
                let owner : string = raffle.owner?.toString().substring(0, 6) + "..." + raffle.owner?.toString().substring(38, 42)
                let ticket_price : number = parseInt(utils.formatEther(raffle.ticket_price?.toString()));
                let ticket_amount : number = raffle.ticket_amount?.toString()
                let ticket_sold : number = raffle.ticket_sold?.toString()
        
                // Get NFT metadata
                const MintNFTContractAddress = nft_contract 
                const MintNFTInterface = new utils.Interface(NFT.abi)
                const NFTContract = new Contract(MintNFTContractAddress, MintNFTInterface, provider) 


                NFTContract.tokenURI(nft_id).then((response : string) => {

                    axios.get(response).then((res) => {


                        setCurrentRaffle(
                            {
                                ...currentRaffle,
                                existsRaffle: true,
                                raffles: [...currentRaffle.raffles, {owner: owner,
                                                                    isOwner: account == raffle.owner,
                                                                    ticket_price: ticket_price,
                                                                    ticket_amount: ticket_amount,
                                                                    ticket_sold: ticket_sold,
                                                                    nft_url: res.data.image}]
                                
                            }
                        )});                                
                });

            })
        })

    }, []);        
    
    
    const { loading , existsRaffle, raffles } = currentRaffle;

    console.log("Loading outside useEffect",loading)
    console.log("Raffles",raffles)

    const buyTickets = async (raffle_id : number, ticket_price : number) => { 
        let ticket_amount : number = document.getElementsByClassName("number_of_tickets")[0]?.value;

        void enterTx(raffle_id, ticket_amount, {value: utils.parseEther((ticket_price*ticket_amount).toString())})
    }

    const endRaffle = async (raffle_id : number) => {
        void endRaffleTx(raffle_id)
    }


    return (
        <JoinRaffleContainer>
            <h1>Join a raffle</h1>
            

            {loading? <p>Loading...</p> : 
              existsRaffle && raffles.map((raffle : any, i) => { 
                return ( i>0 &&
                    <ImageContainer key={i}>
                        <img src={raffle["nft_url"]}/>
                        <p>Owner: {raffle["owner"]}</p>
                        <p>Ticket price: {raffle["ticket_price"]}</p>
                        <p>Tickets left: {raffle["ticket_amount"]-raffle["ticket_sold"]}/{raffle["ticket_amount"]}</p>
                        {raffle["isOwner"]} &&
                        <InputRow>
                            <SmallButton onClick={() => endRaffle(0)}>End Raffle</SmallButton>
                        </InputRow>
                         : 
                        <InputRow>
                            <Input type="number" placeholder="ticket to buy" className='number_of_tickets' />
                            <SmallButton onClick={() => buyTickets(0, raffle["ticket_price"])}>Buy ticket</SmallButton>
                        </InputRow>
                    </ImageContainer> )})}
            

            <NavbarRaffleLink to="/raffle/start_new_raffle">Start a new raffle</NavbarRaffleLink>
            {state_enter.status !== 'PendingSignature' && <StatusAnimation transaction={state_enter} />}
            {(state_enter.status === 'Success' ||
            state_endRaffle.status === 'Success') && <GetTxInfo/>}

        </JoinRaffleContainer>
    );

}
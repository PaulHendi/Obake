import  axios  from "axios";
import { useState, useEffect } from "react";
import {JoinRaffleContainer, 
        ImageContainer,
        Input,
        InputRow,
        SmallButton,
        Plus, 
        Minus,
        OutcomeContainer} from "../../styles/Raffle.style";
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
    ticketLeft: number;
}


export default function JoinRaffle() {

    // Declare Raffle contract
    const RaffleInterface = new utils.Interface(Raffle.abi)
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const RaffleContract = new Contract(RAFFLE_ADDRESS, RaffleInterface, provider)

    // Get account from useEthers
    const { account } = useEthers();

    // Transactions : enter and end_raffle
    const { state : state_enter, send : enterTx } = useContractFunction(RaffleContract, 'enter', { transactionName: 'enter' })
    const { state : state_endRaffle, send : endRaffleTx } = useContractFunction(RaffleContract, 'end_raffle', { transactionName: 'end_raffle' })
    

    // States : currentRaffle, endingRaffle, currentTx, ticketsLeftForSelectedRaffle
    const [currentRaffle, setCurrentRaffle] = useState({loading: true,
                                                        existsRaffle: false,
                                                        raffles : [{}]});
    const [endingRaffle, setEndingRaffle] = useState(0)   
    const [currentTx, setCurrentTx] = useState("")
    const [ticketsLeftForSelectedRaffle, setTicketsLeftForSelectedRaffle] = useState(1)



    // In the useEffect, we get the current raffles from the contract
    useEffect(() => {

        let _raffles = [{}];

        // Get current raffles
        RaffleContract.get_current_raffles().then((raffles : Array<any>) => {
            let raffles_length = raffles.length;
            if (raffles_length == 0) {
                setCurrentRaffle({...currentRaffle, loading : false, existsRaffle: false});
                return;
            }
            
            // For each raffle
            raffles.map((raffle : any, i) => {

                // Get raffle info
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

                // Get NFT URI
                NFTContract.tokenURI(nft_id).then((response : string) => {

                    axios.get(response).then((res) => {
                        
                        // Add raffle info to _raffles
                        _raffles = [..._raffles,{owner: owner,
                            is_owner: is_owner,
                            ticket_price: ticket_price,
                            ticket_amount: ticket_amount,
                            ticket_sold: ticket_sold,
                            nft_url: res.data.image}]

                        // Set currentRaffle
                        if (i == raffles_length-1) setCurrentRaffle({loading : false, existsRaffle: true, raffles: _raffles })
                        
                    });                                
                });

            })
        })

    }, [account, state_enter.status === 'Success']);  
    
    
    // Destructuring currentRaffle
    const { loading , existsRaffle, raffles } = currentRaffle;

    // Buying tickets function 
    const buyTickets = async (raffle_owner : string, ticket_price : number) => { 
        // Set currentTx to enter (useful for the tx animation)
        setCurrentTx("enter")

        let ticket_amount : number = document.getElementsByClassName("number_of_tickets")[0]?.value;

        // Get raffle id
        RaffleContract.ownerRaffleId(raffle_owner).then((raffle_id : number) => {
            // Send the transaction
            void enterTx(raffle_id, ticket_amount, {value: utils.parseEther((ticket_price*ticket_amount).toString())})
        })
    }

    // Ending raffle function
    const endRaffle = async (raffle_owner : string) => {

        // Get raffle id
        RaffleContract.ownerRaffleId(raffle_owner).then((raffle_id : number) => {
            // Set endingRaffle to raffle_id
            setEndingRaffle(raffle_id);

            // Set currentTx to end_raffle (useful for the tx animation)
            setCurrentTx("end_raffle");

            // Send the transaction
            void endRaffleTx(raffle_id, {gasLimit: 2500000})
        })
        
    }

    // Get the outcome when ending the raffle
    const Outcome = () => {

        // No outcome if tickets left, NFT sent back to owner, and ticket amount back to buyers
        console.log(ticketsLeftForSelectedRaffle)
        if (ticketsLeftForSelectedRaffle > 0) return (<></>)


        // Get the raffle info
        const call_status : any =
        useCall( account &&  {
            contract: RaffleContract, // instance of called contract
            method: "lotteries",      // Method to be called
            args: [endingRaffle],     // Method arguments - id of the raffle 
            }) ?? {};


        if ("value" in call_status) {

            // Get the winner
            let winner : string = call_status.value.winner?.toString()
            
            // If no winner yet, return waiting to announce the winner
            if (winner === "0x0000000000000000000000000000000000000000"){
                return (<OutcomeContainer>
                            <p>Waiting to announce the winner of the raffle...</p>
                        </OutcomeContainer>)
            }

            // Else, return the winner
            else {
                
                // Get the address summary (first 4 and last 2 characters)
                let summary_adress = winner.slice(0, 4) + "..." + winner.slice(-2)

                // Get the explorer url
                let explorer_url = "https://testnet.ftmscan.com/address/" + winner + "#tokentxnsErc721"
    
                return (
                    <OutcomeContainer>
                        <a href = {explorer_url} target="_blank">{summary_adress}</a>
                        <p>The winner of the raffle is  </p>
                    </OutcomeContainer>
                )
        
            }              
        }

        return (<></>)

    }


    // Decrement the number of tickets to buy (UI button)
    const StepDown = () => {       
        let NFT_number = document.getElementsByClassName('number_of_tickets')[0] as HTMLInputElement;
        let input = parseInt(NFT_number.value);
        input-=1;
        if (input < 0) input = 0;  // Prevent negative numbers
        NFT_number.value = input.toString();
    }    
  
    // Increment the number of tickets to buy (UI button)
    const StepUp = (ticketLeft : number) => {       
        let NFT_number = document.getElementsByClassName('number_of_tickets')[0] as HTMLInputElement;
        let input = parseInt(NFT_number.value);
        input+=1;
        if (input > ticketLeft) input = ticketLeft;  // Prevent buying more tickets than available
        NFT_number.value = input.toString();
    }       


    // Component to show the input to buy tickets
    const LotteryInput = ({Owner, isOwner, ticketPrice, ticketLeft} : LotteryInputProps) => {
    
        // Set the number of tickets left for the selected raffle
        setTicketsLeftForSelectedRaffle(ticketLeft);

        // If the user is the owner, show the end raffle button
        if (isOwner) { 
            return(
                    <InputRow>
                        <SmallButton onClick={() => endRaffle(Owner)}>End Raffle</SmallButton>
                    </InputRow>)
        }

        // Else, show the input to buy tickets (if there are tickets left)
        else if (!isOwner && ticketLeft>0) {
            
            return (
                <InputRow>
                <Minus onClick={() => StepDown()}>-</Minus>
                <Input type="number" value="0" className='number_of_tickets' readonly="readonly"/>
                <Plus onClick={() => StepUp(ticketLeft)}>+</Plus>
                <SmallButton onClick={() => buyTickets(Owner, ticketPrice)} disabled={!account}>Buy ticket</SmallButton>
                </InputRow>)
        }
        else {
            return (<p><br/>No more tickets for this raffle. <br/>Wait for the owner to end it.</p>)
        }

    }


    // AnimateStakingTransacion component
    const AnimateRaffleTransaction = () => {

        if (state_enter.status !== 'None' && currentTx === "enter")
            return  (<StatusAnimation transaction={(state_enter)}/>)
        else if (state_endRaffle.status !== 'None' && currentTx === "end_raffle") 
            return  (<StatusAnimation transaction={(state_endRaffle)}/>)
        else return (<></>)
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
                        <LotteryInput Owner = {raffle["owner"]} isOwner={raffle["is_owner"]} ticketPrice = {raffle["ticket_price"]} ticketLeft = {raffle["ticket_amount"]-raffle["ticket_sold"]}/>  
                    </ImageContainer> )}) : <p>No raffle available at the moment</p>}
            

            <AnimateRaffleTransaction/>
            
            {state_endRaffle.status === 'Success' && <Outcome/>}
            {(state_enter.status === 'Success' ||
            state_endRaffle.status === 'Success') && <GetTxInfo/>}

        </JoinRaffleContainer>
    );

}
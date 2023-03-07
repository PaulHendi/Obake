import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useCall, useContractFunction } from '@usedapp/core'
import CoinFlip from '../../abi/CoinFlip.json'
import {CoinFlipContainer,Wrapper, CustomInput, LabelInput, RadioInput, Label, OutcomContainer, CoinWrapper} from  "../../styles/HeadsOrTail.js"
import { StatusAnimation } from '../TransactionAnimation'
import { useEthers } from '@usedapp/core'
import { COINFLIP_ADDRESS } from '../../env'
import GetTxInfo  from '../GetTxInfo'

import { useState } from 'react'


interface GameInfo {
  bet: number,
  ended: boolean,
  won: boolean,
  amount: number,
  owner: string
}


export default function CoinFlipPlay() {


    // TODO : 
    // Clean code
    // See if there's a way to wait for the results and not display previous results 
    // If won include a link to the Tx on FTMScan

    // CoinFlip contract
    const CoinFlipInterface = new utils.Interface(CoinFlip.abi)
    const coinFlipcontract = new Contract(COINFLIP_ADDRESS, CoinFlipInterface) 

    // Play tx
    const { state, send } = useContractFunction(coinFlipcontract, 'play', { transactionName: 'play' })

    // Get the account from useEthers
    const {account} = useEthers();

    // States : Heads or Tails
    const [result, setResult] = useState("");



    // Function to play the game
    const play = () => {

      const element_heads_or_tail = document.getElementsByName('heads_or_tail')[0] as HTMLInputElement
      const element_price_first = document.getElementsByName('price')[0] as HTMLInputElement
      const element_price_second = document.getElementsByName('price')[1] as HTMLInputElement

      const choice = element_heads_or_tail.checked as boolean
      const price =  element_price_first.checked as boolean ? 0.1 : element_price_second.checked as boolean ? 0.5 : 1
                   

      if (choice) {
        void send(0, {value: utils.parseEther(price.toString()), gasLimit: 2500000})}
      else {
        void send(1, {value: utils.parseEther(price.toString()), gasLimit: 2500000})}

    }
    

    // Get the outcome of the game (After receiving chainlink's random number)
    // This component could ne optimized (And we shouldn't setState within a component)
    const Outcome = () => {

      const call_status : GameInfo  | any =
          useCall( account &&  {
              contract: coinFlipcontract, // instance of called contract
              method: "getGameInfo", // Method to be called
              args: [account], // Method arguments - address 
              }) ?? {};
  
  
      let result_text = ""
      if ("value" in call_status) {

          let value = call_status["value"][0] 
          let bet : number = Number(value["bet"]?.toString())

          console.log(bet)
          console.log(value["ended"])
          console.log(value["won"])
          

          if (value["ended"]) {

            if (value["won"]) {
              result_text = "You won! :)"
              if (bet == 0) setResult("heads");
              else setResult("tails");
            }
            else {
              result_text = "You lost! :( Better luck next time!"
              if (bet == 0) setResult("tails");
              else setResult("heads");
            }
          }

          else {
              setResult("loading");
              result_text = "Wait a bit for the outcome ..."
          }
      }    
  
      return (<OutcomContainer>
                  <CoinWrapper className={result}>
                    <div className="side-a"><br/><br/>Heads</div>
                    <div className="side-b"><br/><br/>Tails</div>
                  </CoinWrapper>
                  <p>{result_text}</p>
              </OutcomContainer>)}
        
     
    return (
      <CoinFlipContainer>
        <h1>CoinFlip</h1>
        <p>How much ? (FTM)</p>
        <Wrapper>
           <CustomInput>
             <Label>
               <RadioInput id="first" name="price" defaultChecked/>
               <LabelInput htmlFor="first">0.1</LabelInput>
              </Label>
           </CustomInput>
           <CustomInput>
             <Label>
               <RadioInput id="second" name="price"/>
               <LabelInput htmlFor="second">0.5</LabelInput>
              </Label>
           </CustomInput>
           <CustomInput>
             <Label>
               <RadioInput id="third" name="price"/>
               <LabelInput htmlFor="third">1</LabelInput>
              </Label>
           </CustomInput>           
        </Wrapper>        
        <p>Which side of the coin ?</p>
        <Wrapper>
           <CustomInput>
             <Label>
               <RadioInput id="heads" name="heads_or_tail" defaultChecked/>
               <LabelInput htmlFor="heads">Heads</LabelInput>
              </Label>
           </CustomInput>
           <CustomInput>
             <Label>
               <RadioInput id="tail" name="heads_or_tail"/>
               <LabelInput htmlFor="tail">Tails</LabelInput>
              </Label>
           </CustomInput>
        </Wrapper>
        <button onClick={() => play()} disabled={!account}>Play</button>
        {state.status=="Success" && <Outcome/>}
        {state.status !== 'PendingSignature' &&<StatusAnimation transaction={state} />}
        {state.status === 'Success' && <GetTxInfo/>}
        
      
      </CoinFlipContainer>
      
    )
  }


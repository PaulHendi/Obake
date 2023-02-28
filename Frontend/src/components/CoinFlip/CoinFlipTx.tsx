import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useCall, useContractFunction } from '@usedapp/core'
import CoinFlip from '../../abi/CoinFlip.json'
import {CoinFlipContainer,Wrapper, CustomInput, LabelInput, RadioInput, Label} from  "../../styles/HeadsOrTail.js"
import { StatusAnimation } from '../TransactionAnimation'
import { useEthers } from '@usedapp/core'
import { COINFLIP_ADDRESS } from '../../env'


export default function CoinFlipPlay() {
    const {account} = useEthers();
    const CoinFlipInterface = new utils.Interface(CoinFlip.abi)
    const coinFlipcontract = new Contract(COINFLIP_ADDRESS, CoinFlipInterface) 
    const { state, send } = useContractFunction(coinFlipcontract, 'play', { transactionName: 'play' })
  
    const play = () => {
      // Get output from input field

      const element_heads_or_tail = document.getElementsByName('heads_or_tail')[0] as HTMLInputElement
      const element_price_first = document.getElementsByName('price')[0] as HTMLInputElement
      const element_price_second = document.getElementsByName('price')[1] as HTMLInputElement

      const choice = element_heads_or_tail.checked as boolean
      const price =  element_price_first.checked as boolean ? 0.1 : element_price_second.checked as boolean ? 0.5 : 1
                                            
      console.log(choice)
      console.log(price)
      if (choice) {
        void send(1, {value: utils.parseEther(price.toString()), gasLimit: 2500000})}
      else {
        void send(0, {value: utils.parseEther(price.toString()), gasLimit: 2500000})}

    }
    


    const Outcome = () => {

      const call_status =
          useCall( account &&  {
              contract: coinFlipcontract, // instance of called contract
              method: "getGameInfo", // Method to be called
              args: [account], // Method arguments - address 
              }) ?? {};
  
  
      let result = ""
      if ("value" in call_status) {
          let value = call_status["value"][0] 
          if (value["ended"] && value["won"]) {
              result = "You won! :)"
          }
          else if (value["ended"] && !value["won"]) {
              result = "You lost! :( Better luck next time!"
          }
          else {
              result = "Wait a bit for the outcome ..."
          }
      }    
  
      return (<div>
                  <h1>Results</h1>
                  <p>{result}</p>
              </div>)}
        
     
    return (
      <CoinFlipContainer>
        <h1>Play</h1>
        <p>How much ?</p>
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
        <p>Which side of a coin ?</p>
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
               <LabelInput htmlFor="tail">Tail</LabelInput>
              </Label>
           </CustomInput>
        </Wrapper>
        <button onClick={() => play()} disabled={!account}>Play</button>
        {state.status !== 'PendingSignature' &&<StatusAnimation transaction={state} />}
        {state.status=="Success" && <Outcome/>}
        
      </CoinFlipContainer>
      
    )
  }




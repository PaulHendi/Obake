import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useCall, useLogs, useTokenBalance, useContractFunction } from '@usedapp/core'
import CoinFlip from '../../abi/CoinFlip.json'
import Outcome from './CoinFlipOutcome'
import {CoinFlipContainer,Wrapper, CustomInput, LabelInput, RadioInput, Label} from  "../../styles/HeadsOrTail.js"
import { StatusAnimation } from '../TransactionAnimation'
import { useEthers } from '@usedapp/core'

export default function CoinFlipPlay() {
    const {account} = useEthers();
    const CoinFlipContractAddress = "0xc40b2CA628e3a1CACCe531F1927246CE27bc59B0"
    const CoinFlipInterface = new utils.Interface(CoinFlip.abi)
    const contract = CoinFlipContractAddress && (new Contract(CoinFlipContractAddress, CoinFlipInterface) )
    const { state, send } = useContractFunction(contract, 'play', { transactionName: 'play' })
  
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
        <StatusAnimation transaction={state} />
        {state.status=="Success" && <Outcome/>}
        
      </CoinFlipContainer>
      
    )
  }




import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useCall, useLogs, useTokenBalance, useContractFunction } from '@usedapp/core'
import SFT from '../../abi/SFT.json'
import { MintNFTContainer } from '../../styles/MintNFT.style'
import { StatusAnimation } from '../TransactionAnimation'

export default function MintNFT() {
    const MintNFTContractAddress = "0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b" 
    const MintNFTInterface = new utils.Interface(SFT.abi)
    const contract = MintNFTContractAddress && (new Contract(MintNFTContractAddress, MintNFTInterface) )
    const { state, send } = useContractFunction(contract, 'mint', { transactionName: 'mint' })
    const MINT_PRICE = 0.01;

    const mint = () => {
          
      // Get ouiput from input field
      const amount = document.getElementsByClassName('NFT_number')[0].value as number
      const price = (amount*MINT_PRICE).toString()
      void send(amount, {value: utils.parseEther(price), gasLimit: 2500000})
    }


    return (
      <MintNFTContainer>
        <img src="https://gateway.pinata.cloud/ipfs/QmSe8mwsyJ17QXYn1ka2Tw4z4RSkthoVLJQpvQsoTLgxLD" alt="Obake" />
        <h1>Mint Obake</h1>
        <p>Cost: 0.01 FTM per NFT</p>
        <input type="number" placeholder="How many NFT?" className='NFT_number' />
        <button onClick={() => mint()}>Mint</button>
        <StatusAnimation transaction={state} />
      </MintNFTContainer>

    )
  }




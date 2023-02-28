import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useCall, useLogs, useTokenBalance, useContractFunction } from '@usedapp/core'
import Obake from '../../abi/Obake.json'
import { MintNFTContainer, Input, InputRow, SmallButton } from '../../styles/MintNFT.style'
import { StatusAnimation } from '../TransactionAnimation'
import { useEthers, useTransactions } from '@usedapp/core'
import { MINTNFT_ADDRESS } from '../../env'


export default function MintNFT() {
    const { transactions } = useTransactions()

    const MintNFTInterface = new utils.Interface(Obake.abi)
    const contract = new Contract(MINTNFT_ADDRESS, MintNFTInterface) 
    const { state, send } = useContractFunction(contract, 'mint', { transactionName: 'mint' })
    const {account} = useEthers();
    const MINT_PRICE = 0.01;  // Todo : get price from contract


    const mint = async () => {

      // Get ouiput from input field
      const amount = document.getElementsByClassName('NFT_number')[0].value as number
      const price = (amount*MINT_PRICE).toString()
      void send(amount, {value: utils.parseEther(price), gasLimit: 2500000})
    }

    const GetTx = () => {

      let tx = transactions[0].receipt?.transactionHash;
      let tx_link = "https://testnet.ftmscan.com/tx/" + tx;

      // Get first six and last four characters of the hash
      let tx_hash = tx?.slice(0, 6) + "..." + tx?.slice(-4);

      return (  <a href={tx_link} target="_blank">{tx_hash}</a> )
       
    }

    const GetSupply = () => {
      const supplyMinted =
      useCall( {
          contract: contract, // instance of called contract
          method: "supply", // Method to be called
          args: [], // Method arguments - address to be checked for balance
          }
      ) ?? {};      
      const MaxSupply = 2500;

      return ( 
        <p>
          Supply minted: {supplyMinted?.value?.toString()}/ {MaxSupply}
        </p>
        )
    }



    





    return (
      <MintNFTContainer>
        <img src="https://gateway.pinata.cloud/ipfs/QmSe8mwsyJ17QXYn1ka2Tw4z4RSkthoVLJQpvQsoTLgxLD" alt="Obake" />
        <h1>Mint Obake</h1>
        <p>Cost: 0.01 FTM per NFT (Max 5/transaction)</p>
        <GetSupply/>
        <InputRow>
          <Input type="number" placeholder="How many NFT?" className='NFT_number' />
          <SmallButton onClick={() => mint()} disabled={!account}>Mint</SmallButton>
        </InputRow>
      {state.status !== 'PendingSignature' && <StatusAnimation transaction={state} />}
      {state.status === 'Success' && transactions.length !== 0 && <GetTx/>}

               
                
             
      </MintNFTContainer>

    )
  }




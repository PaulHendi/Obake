import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useCall, useLogs, useTokenBalance, useContractFunction } from '@usedapp/core'
import SFT from '../../abi/SFT.json'
import { MintNFTContainer, Input, InputRow, SmallButton } from '../../styles/MintNFT.style'
import { StatusAnimation } from '../TransactionAnimation'
import { useEthers, useTransactions } from '@usedapp/core'


export default function MintNFT() {
    const { transactions } = useTransactions()

    const MintNFTContractAddress = "0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b" 
    const MintNFTInterface = new utils.Interface(SFT.abi)
    const contract = MintNFTContractAddress && (new Contract(MintNFTContractAddress, MintNFTInterface) )
    const { state, send } = useContractFunction(contract, 'mint', { transactionName: 'mint' })
    const {account} = useEthers();
    const MINT_PRICE = 0.01;


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


    return (
      <MintNFTContainer>
        <img src="https://gateway.pinata.cloud/ipfs/QmSe8mwsyJ17QXYn1ka2Tw4z4RSkthoVLJQpvQsoTLgxLD" alt="Obake" />
        <h1>Mint Obake</h1>
        <p>Cost: 0.01 FTM per NFT (Max 5/transaction)</p>
        <InputRow>
          <Input type="number" placeholder="How many NFT?" className='NFT_number' />
          <SmallButton onClick={() => mint()} disabled={!account}>Mint</SmallButton>
        </InputRow>
        <StatusAnimation transaction={state} />
      {state.status === 'Success' && transactions.length !== 0 && <GetTx/>}

               
                
             
      </MintNFTContainer>

    )
  }



// <td>{transaction.receipt?.blockHash ?? 'Pending...'}</td>
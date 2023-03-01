import { Contract } from '@ethersproject/contracts'
import { utils, ethers } from 'ethers'
import { useCall, useContractFunction } from '@usedapp/core'
import Obake from '../../abi/Obake.json'
import { MintNFTContainer, Input, InputRow, SmallButton } from '../../styles/MintNFT.style'
import { StatusAnimation } from '../TransactionAnimation'
import { useEthers } from '@usedapp/core'
import { MINTNFT_ADDRESS, PROVIDER_URL } from '../../env'
import { useEffect, useState } from 'react'
import GetTxInfo  from '../GetTxInfo'


const FACTOR = 1000000000000000000;

export default function MintNFT() {

    const MintNFTInterface = new utils.Interface(Obake.abi)
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const contract = new Contract(MINTNFT_ADDRESS, MintNFTInterface, provider) 

    const { state, send } = useContractFunction(contract, 'mint', { transactionName: 'mint' })
    const {account} = useEthers();
    const [mintInfo, setMintInfo] = useState({loading: false, mint_price: 0});
   
    useEffect(() => {
      setMintInfo({ loading: true, mint_price: 0 });
      contract.cost().then((res:BigInt) => {
              let mint_price : number = parseInt(res.toString());
              setMintInfo({loading: false, mint_price:mint_price/FACTOR});
            });
    }, []);
    
    const { loading, mint_price } = mintInfo;


    const mint = async () => {

      // Get output from input field
      const amount = document.getElementsByClassName('NFT_number')[0].value as number
      const price = (amount*mint_price).toString()
      void send(amount, {value: utils.parseEther(price), gasLimit: 2500000})
    }



    const GetMintInfo = () => {


      const supplyMinted =
      useCall( {
          contract: contract, // instance of called contract
          method: "supply", // Method to be called
          args: [], // Method arguments - address to be checked for balance
          }
      ) ?? {};      
      const MaxSupply = 2500;

      return ( 
        <div>
          <p>Cost: { mint_price} FTM per NFT (Max 5/transaction)</p>
          <p>Supply minted: {supplyMinted?.value?.toString()}/ {MaxSupply}</p>
        </div>
        )
    }


    return (
      <MintNFTContainer>
        <img src="https://gateway.pinata.cloud/ipfs/QmSe8mwsyJ17QXYn1ka2Tw4z4RSkthoVLJQpvQsoTLgxLD" alt="Obake" />
        <h1>Mint Obake</h1>
        {loading ? <p>Loading...</p> :  <GetMintInfo/>}
        <InputRow>
          <Input type="number" placeholder="How many NFT?" className='NFT_number' />
          <SmallButton onClick={() => mint()} disabled={!account}>Mint</SmallButton>
        </InputRow>
      {state.status !== 'PendingSignature' && <StatusAnimation transaction={state} />}
      {state.status === 'Success' && <GetTxInfo/>}

             
      </MintNFTContainer>

    )
  }




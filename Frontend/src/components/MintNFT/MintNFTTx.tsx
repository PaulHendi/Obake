import { Contract } from '@ethersproject/contracts'
import { utils, ethers } from 'ethers'
import { useCall, useContractFunction } from '@usedapp/core'
import Obake from '../../abi/Obake.json'
import { MintNFTContainer, Input, InputRow, SmallButton } from '../../styles/MintNFT.style'
import { StatusAnimation } from '../TransactionAnimation'
import { useEthers } from '@usedapp/core'
import { MINTNFT_ADDRESS, PROVIDER_URL, OBAKE_NFT_URL } from '../../env'
import { useEffect, useState } from 'react'
import GetTxInfo  from '../GetTxInfo'


const FACTOR = 1000000000000000000;

export default function MintNFT() {

    // Declare MintNFT contract
    const MintNFTInterface = new utils.Interface(Obake.abi)
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const contract = new Contract(MINTNFT_ADDRESS, MintNFTInterface, provider) 

    // A single tx in this component : Mint NFT
    const { state, send } = useContractFunction(contract, 'mint', { transactionName: 'mint' })

    // Get account from useEthers
    const {account} = useEthers();

    // States : MintInfo
    const [mintInfo, setMintInfo] = useState({loading: false, mint_price: 0});
   
    // In the useEffect, we get the mint price from the contract
    useEffect(() => {      
      contract.cost().then((res:BigInt) => {
              let mint_price : number = parseInt(res.toString());
              setMintInfo({loading: false, mint_price:mint_price/FACTOR});
            });
    }, []); // No need to reload on a special occasion, the price normally doesn't change
    
    const { loading, mint_price } = mintInfo;


    // Function to mint NFT
    const mint = async () => {

      const amount = document.getElementsByClassName('NFT_number')[0].value as number
      const price = (amount*mint_price).toString()
      void send(amount, {value: utils.parseEther(price), gasLimit: 2500000})
    }


    // This component is used to display the mint price and the supply minted
    // We query the contract to get the supply minted with a useCall here
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

        <img src={OBAKE_NFT_URL} alt="Obake" />
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




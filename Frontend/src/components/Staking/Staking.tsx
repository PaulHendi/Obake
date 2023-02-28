import { useState, useEffect } from "react";
import {StakingContainer, Input, InputRow, SmallButton, UserRewardContainer} from "../../styles/Staking.styles";
import { Contract } from '@ethersproject/contracts'
import { utils, ethers } from 'ethers'
import { useCall, useContractFunction, useEthers, useTransactions } from '@usedapp/core'
import Staking from '../../abi/Staking.json'
import { StatusAnimation } from "../TransactionAnimation";
import { STAKING_ADDRESS } from "../../env";


const formatter = new Intl.NumberFormat('en-us', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })

export default function(){
    const StakingInterface = new utils.Interface(Staking.abi)
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet")
    const contract = new Contract(STAKING_ADDRESS, StakingInterface, provider) 

    const { state : state_stake, send : stakeTx } = useContractFunction(contract, 'stake', { transactionName: 'stake' })
    const { state : state_unstake, send : unstakeTx } = useContractFunction(contract, 'unstake', { transactionName: 'unstake' })
    const { state : state_claimReward, send : claimRewardTx } = useContractFunction(contract, 'claimRewards', { transactionName: 'claimRewards' });

    const { account } = useEthers()
    const { transactions } = useTransactions()
    const [disabled, setDisabled] = useState(false)
    const [isStaking, setIsStaking] = useState(false)

    useEffect(() => {
        contract.balanceOf(account).then((res:BigInt) => {
        if (parseInt(res.toString())> 0) setIsStaking(true)});
    }, [account])


    const stake = () => {
        setDisabled(true);
        const NFT_to_stake = document.getElementsByName('NFT_to_stake')[0] as HTMLInputElement
        void stakeTx(NFT_to_stake.value)
    }

    const unstake = () => {
        setDisabled(true);
        const NFT_to_unstake = document.getElementsByName('NFT_to_unstake')[0] as HTMLInputElement
        void unstakeTx(NFT_to_unstake.value)
    }


    const UserReward = () => {

        const user_reward_reponse = useCall({contract : contract, method : 'getRewards', args : [account]})
        const user_reward : string = user_reward_reponse?.value?.toString();
        return ( 
            <UserRewardContainer>
                <p>Current user reward : </p>
                <p>{user_reward && formatter.format(utils.formatEther(user_reward))} FTM</p>
            </UserRewardContainer>)
    }

    const claimReward = () => {
        setDisabled(true);
        void claimRewardTx();
    }


    const GetTx = () => {

        setDisabled(false);
        let tx = transactions[0].receipt?.transactionHash;
        let tx_link = "https://testnet.ftmscan.com/tx/" + tx;
  
        // Get first six and last four characters of the hash
        let tx_hash = tx?.slice(0, 6) + "..." + tx?.slice(-4);
  
        return (  <a href={tx_link} target="_blank">{tx_hash}</a> )
         
      }


    return(
        <StakingContainer>
            <h1>Staking</h1>
            <p>You can stake your NFTs here</p>
            <InputRow>
                <Input type="number" placeholder="amount" name="NFT_to_stake"/>
                <SmallButton onClick={() => stake()} disabled={!account || disabled}>Stake</SmallButton>
            </InputRow>

            {account && isStaking  && <UserReward />}
            {account && isStaking &&  
                
                    <SmallButton onClick={() => claimReward()} disabled={!account || disabled}>ClaimReward</SmallButton>
                 }   

            {account && isStaking && (<p>You can unstake your NFTs here</p>)}
            {account && isStaking &&  
            
            <InputRow>
                
                <Input type="number" placeholder="amount" name="NFT_to_unstake"/>
                <SmallButton onClick={() => unstake()} disabled={!account || disabled}>Unstake</SmallButton>
            </InputRow> }   

            {state_stake.status !== 'None' && <StatusAnimation transaction={(state_stake)}/>}
            {state_unstake.status !== 'None'  && <StatusAnimation transaction={(state_unstake)}/>}
            {state_claimReward.status !== 'None'  && <StatusAnimation transaction={(state_claimReward)}/>}
            
            {(state_stake.status === 'Success' || 
             state_unstake.status === 'Success' ||
             state_claimReward.status === 'Success') && transactions.length !== 0 && <GetTx/>}

        </StakingContainer>
    );
}


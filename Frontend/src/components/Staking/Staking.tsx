import { useState, useEffect } from "react";
import {StakingContainer, Input, InputRow, SmallButton, StakingSubContainer, ApproveContainer} from "../../styles/Staking.styles";
import { Contract } from '@ethersproject/contracts'
import { utils, ethers } from 'ethers'
import { useCall, useContractFunction, useEthers } from '@usedapp/core'
import Staking from '../../abi/Staking.json'
import Obake from   '../../abi/Obake.json'
import { StatusAnimation } from "../TransactionAnimation";
import { STAKING_ADDRESS, MINTNFT_ADDRESS, PROVIDER_URL } from "../../env";
import GetTxInfo  from '../GetTxInfo'


const formatter = new Intl.NumberFormat('en-us', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })

export default function(){


    // Todo : Correct some worflow problems 
    // But basically we have all the elements

    const StakingInterface = new utils.Interface(Staking.abi)
    const ObakeInterface = new utils.Interface(Obake.abi)
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const StakingContract = new Contract(STAKING_ADDRESS, StakingInterface, provider) 
    const ObakeContract = new Contract(MINTNFT_ADDRESS, ObakeInterface, provider)

    const { state : state_stake, send : stakeTx } = useContractFunction(StakingContract, 'stake', { transactionName: 'stake' })
    const { state : state_unstake, send : unstakeTx } = useContractFunction(StakingContract, 'unstake', { transactionName: 'unstake' })
    const { state : state_claimReward, send : claimRewardTx } = useContractFunction(StakingContract, 'claimRewards', { transactionName: 'claimRewards' });
    const { state : state_approve, send : approveContract } = useContractFunction(ObakeContract, 'setApprovalForAll', { transactionName: 'setApprovalForAll' });

    const { account } = useEthers()
    const [disabled, setDisabled] = useState(false)
    const [userInfo, setUserInfo] = useState({loading: true, balance: 0, isStaking : false});
    const [userApproved, setUserApproved] = useState({loading: true, approved : false});
    const [balanceUnstaked, setBalanceUnstaked] = useState({loading: true, balance_unstaked :0});

    // Note : There's still an error of promise due to useEffect it seems
    // However it seems to work fine, and I don't how to debug it yet

    useEffect(() => {
        StakingContract.balanceOf(account).then((res:BigInt) => {
                let balance_user : number = parseInt(res.toString());
                if (balance_user > 0) setUserInfo({loading: false, balance: balance_user, isStaking : true})
                else setUserInfo({loading: false, balance: 0, isStaking : false})})

        ObakeContract.isApprovedForAll(account, STAKING_ADDRESS).then((res:boolean) => {
            let approved : boolean = res;
            setUserApproved({loading: false, approved : approved})
        })

        ObakeContract.balanceOf(account, 1).then((res:BigInt) => {
            let balance_user : number = parseInt(res.toString());
            setBalanceUnstaked({loading:false, balance_unstaked: balance_user})});
        setDisabled(false);
        
    }, [account, 
        state_approve.status==='Success', 
        state_stake.status==='Success', 
        state_unstake.status==='Success', 
        state_claimReward.status==='Success'])



    const { loading : loading_user_info, balance, isStaking } = userInfo;
    const { loading : loading_user_approved, approved } = userApproved;
    const { loading : loading_balance_unstaked, balance_unstaked } = balanceUnstaked;



    const stake = async () => {
        setDisabled(true);
        const NFT_to_stake = document.getElementsByName('NFT_to_stake')[0] as HTMLInputElement
        void stakeTx(NFT_to_stake.value)
    }

    const unstake = async () => {
        setDisabled(true);
        const NFT_to_unstake = document.getElementsByName('NFT_to_unstake')[0] as HTMLInputElement
        void unstakeTx(NFT_to_unstake.value)
    }

    const claimReward = async () => {
        setDisabled(true);
        void claimRewardTx();
    }

    const approveStakingContract = async () => {
        setDisabled(true);
        void approveContract(STAKING_ADDRESS, true);
    }
 
    const StartStaking = () => {

        if (loading_user_approved || approved) {
            return (
                <div>
                    <InputRow>
                        <Input type="number" placeholder="amount" name="NFT_to_stake"/>
                        <SmallButton onClick={() => stake()} disabled={!account || disabled}>Stake</SmallButton>
                    </InputRow>
                </div>)
        }
        else  {

            return (
                <ApproveContainer>
                    <p>You need to approve the contract to stake your NFTs</p>
                    <SmallButton onClick={() => approveStakingContract()} disabled={!account || disabled}>Approve</SmallButton>
                </ApproveContainer>
            )
        }
        

    }


    const UserReward = () => {

        const user_reward_reponse = useCall({contract : StakingContract, method : 'getRewards', args : [account]})
        const user_reward  = user_reward_reponse?.value?.toString();


        return ( 
            <div>
                <p>Current reward : {user_reward && formatter.format(utils.formatEther(user_reward))} FTM</p>
            </div>)
    }


    return(
        <StakingContainer>
            <h1>Staking</h1>

            {account && loading_balance_unstaked ? <p>Loading...</p> : 
                    (<StakingSubContainer>
                    <p>Stake NFT (balance : {balance_unstaked} NFT)</p> 
                     <StartStaking/>
                     </StakingSubContainer>)}
            
            

            {account && loading_user_info ? <p>Loading...</p> : isStaking  && 
            <StakingSubContainer>
                <UserReward />
                <SmallButton onClick={() => claimReward()} disabled={!account || disabled}>ClaimReward</SmallButton>
            
                <div>
                    <p>Unstake NFT (current stake :  {balance} NFT)</p>
                </div>
             
                <InputRow>
                    <Input type="number" placeholder="amount" name="NFT_to_unstake"/>
                    <SmallButton onClick={() => unstake()} disabled={!account || disabled}>Unstake</SmallButton>
                </InputRow> 
            </StakingSubContainer>}   

            {state_stake.status !== 'None' && <StatusAnimation transaction={(state_stake)}/>}
            {state_unstake.status !== 'None'  && <StatusAnimation transaction={(state_unstake)}/>}
            {state_claimReward.status !== 'None'  && <StatusAnimation transaction={(state_claimReward)}/>}
            {state_approve.status !== 'None'  && <StatusAnimation transaction={(state_approve)}/>}

            
            
            {(state_stake.status === 'Success' || 
             state_unstake.status === 'Success' ||
             state_claimReward.status === 'Success' ||
             state_approve.status === 'Success')  && <GetTxInfo/>}

        </StakingContainer>
    );
}


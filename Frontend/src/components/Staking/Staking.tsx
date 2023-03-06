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


// This is the number of decimals used when displaying the rewards of the user
const formatter = new Intl.NumberFormat('en-us', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })

export default function(){


    // Declare Staking and Obake contracts
    const StakingInterface = new utils.Interface(Staking.abi)
    const ObakeInterface = new utils.Interface(Obake.abi)
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const StakingContract = new Contract(STAKING_ADDRESS, StakingInterface, provider) 
    const ObakeContract = new Contract(MINTNFT_ADDRESS, ObakeInterface, provider)

    // 4 txs : stake, unstake, claimReward, approve
    const { state : state_stake, send : stakeTx } = useContractFunction(StakingContract, 'stake', { transactionName: 'stake' })
    const { state : state_unstake, send : unstakeTx } = useContractFunction(StakingContract, 'unstake', { transactionName: 'unstake' })
    const { state : state_claimReward, send : claimRewardTx } = useContractFunction(StakingContract, 'claimRewards', { transactionName: 'claimRewards' });
    const { state : state_approve, send : approveContract } = useContractFunction(ObakeContract, 'setApprovalForAll', { transactionName: 'setApprovalForAll' });

    // Get the account from useEthers
    const { account } = useEthers()

    // Declare the states
    const [disabled, setDisabled] = useState(false)
    const [userInfo, setUserInfo] = useState({loading: true, balance: 0, isStaking : false});
    const [userApproved, setUserApproved] = useState({loading: true, approved : false});
    const [balanceUnstaked, setBalanceUnstaked] = useState({loading: true, balance_unstaked :0});

    // In this UseEffect we do 3 queries : 
    // 1) Check if the user is staking (the balance of the user in the staking contract)
    // 2) Check if the user has approved the staking contract to spend his tokens
    // 3) Check the balance of the user in the Obake contract (the balance that can be staked)
    // Note : this is done without useCall, because we're inside a useEffect
    useEffect(() => {
        if (account === undefined) return;

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
        state_claimReward.status==='Success']) // Note : It updates everytime a tx is successful


    // Note : 3 loading but they come from different qeueries
    const { loading : loading_user_info, balance, isStaking } = userInfo;
    const { loading : loading_user_approved, approved } = userApproved;
    const { loading : loading_balance_unstaked, balance_unstaked } = balanceUnstaked;


    // Stake Tx async function
    const stake = async () => {
        setDisabled(true);
        const NFT_to_stake = document.getElementsByName('NFT_to_stake')[0] as HTMLInputElement
        void stakeTx(NFT_to_stake.value)
    }

    // Unstake Tx async function
    const unstake = async () => {
        setDisabled(true);
        const NFT_to_unstake = document.getElementsByName('NFT_to_unstake')[0] as HTMLInputElement
        void unstakeTx(NFT_to_unstake.value)
    }

    // Claim reward Tx async function
    const claimReward = async () => {
        setDisabled(true);
        void claimRewardTx();
    }

    // Approve Tx async function
    const approveStakingContract = async () => {
        setDisabled(true);
        void approveContract(STAKING_ADDRESS, true);
    }
 

    // StartStaking component (Either approve first or stake)
    const StartStaking = () => {

        // loading_user_approved : While loading the user approved status, we show the stake button 
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

    // UserStaking component 
    const UserReward = () => {

        const user_reward_reponse = useCall({contract : StakingContract, method : 'getRewards', args : [account]})
        const user_reward  = user_reward_reponse?.value?.toString();


        return ( 
            <div>
                <p>Current reward : {user_reward && formatter.format(utils.formatEther(user_reward))} FTM</p>
            </div>)
    }


    // AnimateStakingTransacion component
    const AnimateStakingTransacion = () => {

        //TODO : Rethink this part

        if (state_stake.status !== 'None') return  (<StatusAnimation transaction={(state_stake)}/>)
        else if (state_unstake.status !== 'None') return  (<StatusAnimation transaction={(state_unstake)}/>)
        else if (state_claimReward.status !== 'None') return  (<StatusAnimation transaction={(state_claimReward)}/>)
        else if (state_approve.status !== 'None') return  (<StatusAnimation transaction={(state_approve)}/>)
        else return (<></>)
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

            <AnimateStakingTransacion/>

            
            {(state_stake.status === 'Success' || 
             state_unstake.status === 'Success' ||
             state_claimReward.status === 'Success' ||
             state_approve.status === 'Success')  && <GetTxInfo/>}

        </StakingContainer>
    );
}


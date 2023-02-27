import React from "react";
import {StakingContainer, Input, InputRow, SmallButton} from "../../styles/Staking.styles";
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useCall, useLogs, useTokenBalance, useContractFunction, useEthers } from '@usedapp/core'
import Staking from '../../abi/Staking.json'
import {WalletIcon, SpinnerIcon, CheckIcon, ExclamationIcon} from "../../assets/Icons";
import { StatusAnimation } from "../TransactionAnimation";
import { useState } from "react";

export default function(){
    const StakingContractAddress = "0xC26d81929ABC1E74bF39bcA1D0EC7001628e273E"
    const StakingInterface = new utils.Interface(Staking.abi)
    const contract = StakingContractAddress && (new Contract(StakingContractAddress, StakingInterface) )
    const { state, send } = useContractFunction(contract, 'stake', { transactionName: 'stake' })
    const { account } = useEthers()
    const [disabled, setDisabled] = useState(false)

    const stake = () => {



        setDisabled(true);
        const NFT_to_stake = document.getElementsByName('NFT_to_stake')[0] as HTMLInputElement
        void send(NFT_to_stake.value)

    }



    const UserReward = () => {
        const user_reward = useCall({contract : contract, method : 'getRewards', args : [account]})
        return ( 
            <div>
                <p>Current user reward is : </p>
                <p>{user_reward?.value?.toString() && utils.formatEther(user_reward?.value?.toString())} FTM</p>
            </div>)
    }

    return(
        <StakingContainer>
            <h1>Staking</h1>
            <p>You can stake your NFTs here</p>
            <InputRow>
                <Input type="number" placeholder="amount" name="NFT_to_stake"/>
                <SmallButton onClick={() => stake()} disabled={!account || disabled}>Stake</SmallButton>
            </InputRow>
            {account && <UserReward />}
            
            <StatusAnimation transaction={state} />
        </StakingContainer>
    );
}


import React from "react";
import {StakingContainer, Input, InputRow, SmallButton} from "../../styles/Staking.styles";
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useCall, useLogs, useTokenBalance, useContractFunction, useEthers } from '@usedapp/core'
import CoinFlip from '../../abi/CoinFlip.json'
import {WalletIcon, SpinnerIcon, CheckIcon, ExclamationIcon} from "../../assets/Icons";
import { StatusAnimation } from "../TransactionAnimation";
import { useState } from "react";

export default function(){
    const StakingContractAddress = "0xb999a44A9f014B7151cF11fCd11c5749A6e2E461"
    const StakingInterface = new utils.Interface(CoinFlip.abi)
    const contract = StakingContractAddress && (new Contract(StakingContractAddress, StakingInterface) )
    const { state, send } = useContractFunction(contract, 'play', { transactionName: 'play' })
    const { account } = useEthers()
    const [disabled, setDisabled] = useState(false)

    const stake = () => {



        setDisabled(true);
        const NFT_to_stake = document.getElementsByName('NFT_to_stake')[0] as HTMLInputElement
        void send(NFT_to_stake.value)

    }



    const UserReward = () => {
        const user_reward = useCall({contract : contract, method : 'user_reward', args : [account]})
        return ( 
            <div>
                <p>Current user reward is : </p>
                <p>{user_reward}</p>
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


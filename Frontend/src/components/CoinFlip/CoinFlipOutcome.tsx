import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useCall, useLogs, useTokenBalance, useContractFunction, useEthers } from '@usedapp/core'
import CoinFlip from '../../abi/CoinFlip.json'



export default function Outcome() {


    const CoinFlipContractAddress = "0xb999a44A9f014B7151cF11fCd11c5749A6e2E461"
    let tokenID : string = "" //for the moment
    const CoinFlipInterface = new utils.Interface(CoinFlip.abi)
    const coinFlipcontract = CoinFlipContractAddress && (new Contract(CoinFlipContractAddress, CoinFlipInterface) )
    const { account } = useEthers()


    // const call_status =
    //     useCall( account &&  {
    //         contract: coinFlipcontract, // instance of called contract
    //         method: "getGameInfo", // Method to be called
    //         args: [account], // Method arguments - address 
    //         }) ?? {};


    const call_id_status =
        useCall( account && {
            contract: coinFlipcontract, // instance of called contract
            method: "request_ids", // Method to be called
            args: [account], // Method arguments - address to be checked for balance
            }
        ) ?? {};

    if ("value" in  call_id_status) {
        tokenID = call_id_status["value"].toString() as string
    }

    const call_status =
        useCall( {
            contract: coinFlipcontract, // instance of called contract
            method: "games", // Method to be called
            args: [tokenID], // Method arguments - address to be checked for balance
            }
        ) ?? {};

    let result = ""
    if ("value" in call_status) {
        let value = call_status["value"]
        if (value["ended"] && value["won"]) {
            result = "You won!"
        }
        else if (value["ended"] && !value["won"]) {
            result = "You lost!"
        }
        else {
            result = "Game is still in progress"
        }
    }


    return (
        <div>
            <h1>Results</h1>
            <p>{result}</p>
        </div>
    )

}
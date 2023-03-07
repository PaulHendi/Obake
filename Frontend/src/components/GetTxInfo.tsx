
import { useTransactions } from '@usedapp/core'

export default function GetTxInfo() {

    const { transactions } = useTransactions()

    let tx = transactions[0].receipt?.transactionHash;

    if (tx == undefined) return ( <div></div> )

    let tx_link = "https://testnet.ftmscan.com/tx/" + tx;

    // Get first six and last four characters of the hash
    let tx_hash = tx?.slice(0, 6) + "..." + tx?.slice(-4);
  
    return (  <a href={tx_link} target="_blank">Transaction details</a> )
         
    
}
  
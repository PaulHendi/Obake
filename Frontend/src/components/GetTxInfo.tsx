
import { useTransactions } from '@usedapp/core'

export default function GetTxInfo() {

    const { transactions } = useTransactions()

    // Retrieve the last transaction hash
    let tx = transactions[0].receipt?.transactionHash;

    // If undefined, return an empty div
    if (tx == undefined) return ( <div></div> )

    // Create a link to the transaction
    let tx_link = "https://testnet.ftmscan.com/tx/" + tx;

    // Get first six and last four characters of the hash
    let tx_hash = tx?.slice(0, 6) + "..." + tx?.slice(-4);
  
    // Return the link
    return (  <a href={tx_link} target="_blank">Transaction details</a> )
         
    
}
  
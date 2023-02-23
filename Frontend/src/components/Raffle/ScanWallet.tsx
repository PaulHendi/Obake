import React from "react";
import  axios  from "axios";

import {ScanWalletContainer, ImageContainer, ImageButton} from "../../styles/ScanWallet.style";

export default function ScanWallet() {
  let url = 'https://api.covalenthq.com/v1/4002/address/0x29Fd00FA40c90aec39AC604D875907874f237baA/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_96a32bab72724e39a3e5011afe2';

  const [nft, setNFT] = React.useState<{[fieldName: string]: string}> ({});


  React.useEffect(() => {
    axios.get(url).then(response => {
      let nft_url : any = {}
      for (let i = 0;i<response.data.data.items.length;i++){
          if (response.data.data.items[i].type == "nft"){
              for (let j=0; j<response.data.data.items[i].nft_data.length;j++) {
                // Replace https://ipfs.io by https://gateway.pinata.cloud/ to get the image quicker
                let image_url : string = response.data.data.items[i].nft_data[j].external_data.image.replace("https://ipfs.io", "https://gateway.pinata.cloud");
                let nft_name : string = response.data.data.items[i].nft_data[j].external_data.name;
                let nft_description : string = response.data.data.items[i].contract_address.slice(0, 6) ;
                nft_url[nft_name] =  image_url;
              }
          }
      }
      setNFT(nft_url);
    })
   
    }, []);


  
function handleClick(key: any) {
    console.log(key)
  }
console.log(nft)

  return (
    <div>
      <h1>Scan Wallet</h1>
   
    <ScanWalletContainer>
      


      {Object.keys(nft).map((key) => {
        return ( <ImageContainer onClick={() => handleClick(key)}>  
                    <img src={nft[key]} key={key}/>
                    <h1>{key}</h1> 
                </ImageContainer>)
      })}
                
      
    </ScanWalletContainer>
    </div>
  );
}
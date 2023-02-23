import React from "react";
import { useEthers, useEtherBalance, Config} from '@usedapp/core'
import styled from "styled-components";

const ConnectWalletButton = styled.button`
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  font-size: large;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  justify-content: center;
  &:hover {
    color: #9381FF;
    transform: translate(0, -2px);
  }
`;


interface ConnectorProps {
    config: Config
  }

function Connector({config} : ConnectorProps) {
    const { account, activateBrowserWallet, deactivate,chainId } = useEthers()
    const userBalance = useEtherBalance(account)

    const ConnectButton = () => (
        <div>
          <ConnectWalletButton onClick={() => activateBrowserWallet()}>Connect Wallet</ConnectWalletButton>
        </div>
      )
    
      const MetamaskConnect = () => (
        
        <div>
          
          {!account && <ConnectButton />}
          {account && <ConnectWalletButton onClick={deactivate}>Disconnect Wallet</ConnectWalletButton>}
        </div>
      )

 


          
    

  return (
    <div>
      <MetamaskConnect/>
    </div>
  );
}

export default Connector;







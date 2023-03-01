import React from "react";
import { useEthers, useEtherBalance, Config} from '@usedapp/core'

interface ConnectorProps {
    config: Config
  }

function Connector({config} : ConnectorProps) {
    const { account, activateBrowserWallet, deactivate,chainId } = useEthers()
    const userBalance = useEtherBalance(account)

      
    const ConnectButton = () => (
        <div>
          <button onClick={() => activateBrowserWallet()}>Connect</button>
        </div>
      )
    
      const MetamaskConnect = () => (
        <div>
          {account && (
            <div>
              <div className="inline">
                
                &nbsp;
                <div className="account">{account}</div>
              </div>
              <br />
            </div>
          )}
          {!account && <ConnectButton />}
          {(!config.readOnlyUrls[chainId]) &&
            (<p>Please use either Fantom or Fantom testnet.</p>)
          }
          {account && <button onClick={deactivate}>Disconnect</button>}
          <br />
        </div>
      )

 


          
    

  return (
    <div>
      <MetamaskConnect/>
    </div>
  );
}

export default Connector;







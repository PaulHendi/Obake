import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import {
  DAppProvider,
  Config,
  MetamaskConnector,
  FantomTestnet,
  Fantom,
  useEthers
} from '@usedapp/core'

const doc = document.getElementById('root') as HTMLElement;

const readOnlyUrls: Config['readOnlyUrls'] = {
  [Fantom.chainId]: 'https://rpc.ankr.com/fantom',
  [FantomTestnet.chainId]: 'https://rpc.ankr.com/fantom_testnet',
}




const config: Config = {
  readOnlyUrls,
  multicallVersion: 1 as const,
  fastMulticallEncoding: true,
  noMetamaskDeactivate: true,
  connectors: {
    metamask: new MetamaskConnector(),
  },
}




ReactDOM.createRoot(doc).render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App config = {config}/>
    </DAppProvider>
  </React.StrictMode>,
)

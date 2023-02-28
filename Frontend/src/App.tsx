import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Config} from '@usedapp/core'

import Navbar from "./components/Navbar"
import CoinFlipPlay from './components/CoinFlip/CoinFlipTx'
import MintNFT from './components/MintNFT/MintNFTTx'
import ScanWallet from './components/Raffle/ScanWallet'
import Home from './components/Home'
import Footer from './components/Footer'
import Staking from './components/Staking/Staking'
import RaffleMain from './components/Raffle/RaffleMain'


interface ConfigProps {
  config: Config
}


function App({config} : ConfigProps) {

  return (
    <Router>
      <Navbar config = {config}/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/mint" element={<MintNFT/>} />
        <Route path="/raffle" element={<RaffleMain/>} />
        <Route path="/raffle/start_new_raffle" element={<ScanWallet/>} />
        <Route path="/coinflip" element={<CoinFlipPlay/>} />
        <Route path="/staking" element={<Staking/>} />
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App

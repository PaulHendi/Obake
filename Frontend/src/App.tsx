import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Config} from '@usedapp/core'

import Navbar from "./components/Navbar"
import CoinFlipPlay from './components/CoinFlip/CoinFlipTx'
import MintNFT from './components/MintNFT/MintNFTTx'
import StartRaffle from './components/Raffle/StartRaffle'
import Home from './components/Home'
import Footer from './components/Footer'
import Staking from './components/Staking/Staking'
import JoinRaffle from './components/Raffle/JoinRaffle'


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
        <Route path="/raffle" element={<JoinRaffle/>} />
        <Route path="/raffle/start_new_raffle" element={<StartRaffle/>} />
        <Route path="/coinflip" element={<CoinFlipPlay/>} />
        <Route path="/staking" element={<Staking/>} />
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App

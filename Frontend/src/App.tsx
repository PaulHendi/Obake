import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from "./components/Navbar"
import {Config} from '@usedapp/core'
import Play from './components/CoinFlip/Transaction'
import MintNFT from './components/MintNFT/Transaction'
import ScanWallet from './components/Raffle/ScanWallet'
import Home from './components/Home'
import Footer from './components/Footer'
import Staking from './components/Staking/Staking'

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
        <Route path="/Raffle" element={<ScanWallet/>} />
        <Route path="/coinflip" element={<Play/>} />
        <Route path="/staking" element={<Staking/>} />
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App

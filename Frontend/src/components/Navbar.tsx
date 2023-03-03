import {useState} from "react";
import {NavbarContainer,
        LeftContainer,
        RightContainer,
        NavbarInnerContainer,
        NavbarExtendedContainer,
        NavbarLinkCointainer,
        NavbarLink,
        Logo,
        Name,
        DropdownContent,
        Dropdown,
        DropdownLink
} from "../styles/Navbar.style.jsx";
import Connector from "./Connector"
import {Config} from '@usedapp/core'



import LogoImg from "../assets/ObakeLogo.jpg";

interface ConfigProps {
  config: Config
}

function Navbar({config} : ConfigProps) {

  <div class="navbar">
  <a href="#home">Home</a>
  <a href="#news">News</a>
  <div class="dropdown">
    <button class="dropbtn">Dropdown
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
      <a href="#">Link 3</a>
    </div>
  </div>
</div>


  return (
    <NavbarContainer>
      <NavbarInnerContainer>
        <LeftContainer>
        <Logo src={LogoImg} />
        <Name>Obake</Name>
         </LeftContainer>
        <RightContainer>
          <NavbarLinkCointainer>
            <NavbarLink to="/">Home</NavbarLink>
            <NavbarLink to="/mint">Mint</NavbarLink>
              
              <NavbarLink to="/raffle">Raffle
               
              

              <DropdownContent>
              <DropdownLink to="/raffle">Join Raffle</DropdownLink>
              <DropdownLink to="/raffle/start_new_raffle">Start Raffle</DropdownLink>
              </DropdownContent>
              </NavbarLink> 
            <NavbarLink to="/coinflip">CoinFlip</NavbarLink>
            <NavbarLink to="/staking">Staking</NavbarLink>
            <Connector config={config}/>
          </NavbarLinkCointainer>
        </RightContainer>
      </NavbarInnerContainer>
      <NavbarExtendedContainer>
        
      </NavbarExtendedContainer>

    </NavbarContainer>

  );
}

export default Navbar;

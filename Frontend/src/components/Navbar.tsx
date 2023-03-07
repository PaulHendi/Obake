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
        NavbarDiv,
        DropdownLink
} from "../styles/Navbar.style.jsx";
import Connector from "./Connector"
import {Config} from '@usedapp/core'



import LogoImg from "../assets/ObakeLogo.jpg";

interface ConfigProps {
  config: Config
}

function Navbar({config} : ConfigProps) {


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
              <NavbarDiv>Raffle
                <DropdownContent>
                <DropdownLink to="/raffle">Join Raffle</DropdownLink>
                <DropdownLink to="/raffle/start_new_raffle">Start Raffle</DropdownLink>
                </DropdownContent>
              </NavbarDiv> 
            <NavbarLink to="/coinflip">CoinFlip</NavbarLink>
            <NavbarLink to="/staking">Staking</NavbarLink>
            <NavbarLink to="https://pilu.gitbook.io/obake/" target="_blank">Docs</NavbarLink>
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

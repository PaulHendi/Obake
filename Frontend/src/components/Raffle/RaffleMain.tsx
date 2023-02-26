import React from "react";
import {JoinRaffleContainer, NavbarRaffleLink} from "../../styles/Raffle.style";

export default function RaffleMain() {



    return (
        <JoinRaffleContainer>
            <h1>Join a raffle</h1>
            <NavbarRaffleLink to="/raffle/start_new_raffle">Start a new raffle</NavbarRaffleLink>
        </JoinRaffleContainer>
    );

}
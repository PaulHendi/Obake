import React from "react";
import { Router, Routes, Route } from "react-router-dom";
import {NavbarContainer,
    LeftContainer,
    RightContainer,
    NavbarInnerContainer,
    NavbarExtendedContainer,
    NavbarLinkCointainer,
    NavbarLink,
    Logo,
    Name
} from "../../styles/Navbar.style.jsx";

export default function RaffleNavBar() {

    return (
            <NavbarLinkCointainer>
                <NavbarLink to="/raffle/join_raffle">Join raffle</NavbarLink>
                <NavbarLink to="/raffle/start_new_raffle">Start new raffle</NavbarLink>
            </NavbarLinkCointainer>
    );

}
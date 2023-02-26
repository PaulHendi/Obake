import styled from "styled-components";
import {Link} from "react-router-dom";

export const NavbarRaffleLink = styled(Link)`
color: #fff;
text-decoration: none;
cursor: pointer;
background-color: black;
transition: all 0.3s ease-in-out;
&:hover {
    color: #9381FF;
    transform: translate(0, -2px);
}
`;

export const JoinRaffleContainer = styled.div`
    display: flex;
    border-radius: 4px;
    margin-left: 30%;
    margin-right: 30%;
    margin-top: 2%;
    margin-bottom: 2%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;    
    background-color: #F5F5F5;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
`;

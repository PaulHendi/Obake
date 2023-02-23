import styled from 'styled-components';
import {Link} from 'react-router-dom';

export const NavbarContainer = styled.nav`
    width: 100%;
    height: 80px;
    background-color: #041B15;
    display: flex;
    flex-direction: column;
`

export const LeftContainer = styled.div`
    flex: 30%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 2%;
`
export const RightContainer = styled.div`
    flex: 70%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 2%;
`

export const NavbarInnerContainer = styled.div`
    width: 100%;
    height: 80px;
    display: flex;`

export const NavbarLinkCointainer = styled.div`
    display: flex;
`

export const NavbarLink = styled(Link)`
    color : #FFFFFF;
    font-size: x-large;
    font-family: Arial, Helvetica, sans-serif;
    text-decoration: none;
    margin: 10px;
    &:hover {
        color: #9381FF;
        transform: translate(0,  -2px);
    }
`    

export const Logo = styled.img`
margin: 5px;
max-width:80px;
height:auto;
` 

export const Name = styled.h1`
    color: #9381FF;
    margin: 10px;
    `
    
export const NavbarExtendedContainer = styled.div``


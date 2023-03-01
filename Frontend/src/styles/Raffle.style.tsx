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

    img{
        width: 50%;
        height: 50%;
        margin-left: 1%;

    }
    p{
        margin-left: 1%;
        margin-right: 1%;
        margin-top: 1%;
        margin-bottom: 1%;

    }
    h1{
        margin-left: 1%;
        margin-right: 1%;
        margin-top: 1%;
        margin-bottom: 1%;
    }
`;


export const ImageContainer = styled.div`
    margin-left: 1%;
    margin-top: 2%;
    margin-bottom: 2%;
    width:50%;
    border:none;
    border-radius: 5%;
    background-color: #F5F5F5;
    

    img{
        width: 98%;
        height: 98%;
        border-radius: 24px;
    }
    p{
        margin-left: 1%;
        margin-right: 1%;
        margin-top: 1%;
        margin-bottom: 1%;
    }
    
    `


export const Input = styled.input`
    border-radius:24px;
    //height: 100%;
    text-align: center;
    border: 0;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

`

export const InputRow = styled.div`
    display: flex;
    margin: 0;
    color: dark gray;
    border: gray 1px solid;
    border-radius: 24px;
    overflow: hidden;
`


export const SmallButton = styled.button`
  display: flex;
  justify-content: center;
  //min-width: 95px;
  width: 100%;
  padding: 8px 24px;
  border-radius: 24px;

`